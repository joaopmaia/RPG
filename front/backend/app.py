"""
API REST do projeto RPG (stateless: JWT Bearer).
CRUD: armas, armaduras, alquimia, reinos, materiais, runas, NPC, equipamentos_NPC, elixir_NPC, imagens.
Autenticação: JWT no header Authorization: Bearer <token>; logout invalida hash no MongoDB.
"""
import hashlib
import json
import os
import re
import sys
import time
import traceback
import uuid
from datetime import datetime, timedelta
from functools import wraps

from bson import ObjectId
from bson.errors import InvalidId
from flask import Flask, g, request, jsonify, send_file, make_response
from flask_cors import CORS
from werkzeug.exceptions import HTTPException
from werkzeug.security import generate_password_hash, check_password_hash
import jwt

from config import settings
from logging_config import setup_logging
from errors import api_error
from campaign_access import (
    assert_doc_in_campaign,
    merge_campaign_filter,
    normalize_uuid,
    pode_editar_roleplaying_response,
    require_roleplaying_context,
    resolve_campanha_for_insert,
    strip_campanha_from_body_for_player,
)

logger = setup_logging()

from db import get_db

# Raiz do repositório (front/backend/../..)
PROJECT_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
if PROJECT_ROOT not in sys.path:
    sys.path.insert(0, PROJECT_ROOT)

# Pasta de histórias dos reinos (front/historias)
HISTORIAS_DIR = os.path.join(os.path.dirname(__file__), "..", "historias")
# Pasta de mapas por reino (front/historias/mapas) — imagens com nome do reino
MAPAS_DIR = os.path.join(HISTORIAS_DIR, "mapas")
COORDENADAS_DIR = os.path.abspath(os.path.join(MAPAS_DIR, "coordenadas"))
# Pasta para upload de imagens (NPC, etc.)
UPLOADS_DIR = os.path.join(os.path.dirname(__file__), "uploads")
REINOS_INFO_PATH = os.path.join(PROJECT_ROOT, "service", "utils", "reinos-info.json")

app = Flask(__name__)
app.config["SECRET_KEY"] = settings.jwt_secret_key
COOKIE_NAME = "khonum_token"  # legado; preferir Authorization Bearer
TOKEN_MAX_AGE = 24 * 3600  # 24h em segundos

CORS(
    app,
    resources={
        r"/api/*": {
            "origins": settings.cors_origins,
            "allow_headers": ["Content-Type", "Authorization", "X-Campanha-Id"],
            "methods": ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
            "supports_credentials": False,
        }
    },
)


@app.before_request
def _log_request_start():
    g._t0 = time.perf_counter()


@app.after_request
def _log_request_done(response):
    if request.path.startswith("/api"):
        t0 = getattr(g, "_t0", None)
        ms = (time.perf_counter() - t0) * 1000 if t0 is not None else 0.0
        logger.info("%s %s -> %s | %.1f ms", request.method, request.path, response.status_code, ms)
    return response


@app.errorhandler(HTTPException)
def _handle_http_exception(exc):
    return api_error(exc.description or str(exc), exc.code or 500)


@app.errorhandler(Exception)
def _handle_error(exc):
    if isinstance(exc, HTTPException):
        return _handle_http_exception(exc)
    if hasattr(exc, "code") and exc.code is not None and 400 <= exc.code < 600:
        return api_error(str(exc), exc.code)
    logger.exception("Erro não tratado | %s", type(exc).__name__)
    return api_error(str(exc), 500)


@app.route("/api/health", methods=["GET"])
def health():
    """Resposta rápida sem acessar o banco; útil para verificar se o backend está no ar."""
    return jsonify({"ok": True})


def serialize(doc):
    """Converte ObjectId e outros tipos não-JSON para string."""
    if doc is None:
        return None
    if isinstance(doc, list):
        return [serialize(x) for x in doc]
    if isinstance(doc, dict):
        out = {}
        for k, v in doc.items():
            if k == "_id":
                out[k] = str(v) if isinstance(v, ObjectId) else v
            else:
                out[k] = serialize(v)
        return out
    return doc


# ─── Helpers genéricos ─────────────────────────────────────────────────────

def _list_collection(collection_name, query=None, sort_key="nome", limit=500):
    db = get_db()
    col = db[collection_name]
    q = query or {}
    cursor = col.find(q).sort(sort_key, 1).limit(limit)
    return [serialize(d) for d in cursor]


def _get_by_id(collection_name, id_str):
    db = get_db()
    col = db[collection_name]
    try:
        doc = col.find_one({"_id": ObjectId(id_str)})
        return serialize(doc)
    except Exception:
        return None


def _create(collection_name, data):
    db = get_db()
    col = db[collection_name]
    if "_id" in data:
        del data["_id"]
    rid = col.insert_one(data).inserted_id
    return str(rid)


def _update(collection_name, id_str, data):
    db = get_db()
    col = db[collection_name]
    if "_id" in data:
        del data["_id"]
    try:
        oid = ObjectId(id_str)
    except (InvalidId, TypeError):
        return False
    result = col.update_one({"_id": oid}, {"$set": data})
    return result.matched_count > 0


def _delete(collection_name, id_str):
    db = get_db()
    col = db[collection_name]
    try:
        oid = ObjectId(id_str)
    except (InvalidId, TypeError):
        return False
    result = col.delete_one({"_id": oid})
    return result.deleted_count > 0


def _build_query(text_search_fields, exact_filters):
    """Monta query: exact_filters (match exato) + texto em text_search_fields se ?q= for passado."""
    q = {}
    for key, val in (exact_filters or {}).items():
        if val is not None and val != "":
            q[key] = val
    q_param = request.args.get("q", "").strip()
    if q_param and text_search_fields:
        q["$or"] = [{"%s" % f: re.compile(re.escape(q_param), re.I)} for f in text_search_fields]
    return q


def _apply_estabelecimentos_filter(q, observacoes_field="observacoes"):
    """
    Filtro estabelecimentos: ?estabelecimentos=true|false.
    - false (ou ausente): exclui documentos que tenham em observacoes a flag 'estabelecimento:true:'.
    - true: lista apenas os que tenham a flag.
    Se estabelecimentos=true e ?estabelecimento_nome=X, filtra pelo nome do estabelecimento (regex exato).
    """
    estabelecimentos = (request.args.get("estabelecimentos") or "").strip().lower()
    estabelecimento_nome = (request.args.get("estabelecimento_nome") or "").strip()
    if estabelecimentos == "true":
        if estabelecimento_nome:
            pattern = "estabelecimento:true:" + re.escape(estabelecimento_nome)
            q[observacoes_field] = re.compile(pattern)
        else:
            q[observacoes_field] = re.compile("estabelecimento:true:")
    else:
        # default: excluir os que têm a flag (listar só os que não são de estabelecimento)
        q["$nor"] = q.get("$nor", []) + [{observacoes_field: re.compile("estabelecimento:true:")}]
    return q


# ─── Auth (usuários, JWT) ───────────────────────────────────────────────────

def _ensure_admin_user():
    """Cria o usuário admin se não existir nenhum; usuário e senha vêm de ADMIN_USER e ADMIN_PASSWORD no .env."""
    admin_user = (os.environ.get("ADMIN_USER") or "").strip()
    admin_password = os.environ.get("ADMIN_PASSWORD") or ""
    if not admin_user or not admin_password:
        return
    db = get_db()
    col = db["usuarios"]
    if col.count_documents({"perfil": "admin"}) > 0:
        return
    senha_hash = generate_password_hash(admin_password, method="pbkdf2:sha256")
    try:
        col.insert_one({
            "usuario": admin_user,
            "senha_hash": senha_hash,
            "perfil": "admin",
        })
        print("[Auth] Usuário admin criado a partir do .env.")
    except Exception:
        pass


def _token_hash(token_str):
    return hashlib.sha256(token_str.encode()).hexdigest()


def _get_token_from_request():
    """Prioriza Authorization: Bearer; cookie legado como fallback."""
    auth = request.headers.get("Authorization")
    if auth and auth.startswith("Bearer "):
        return auth[7:].strip()
    return request.cookies.get(COOKIE_NAME)


def _decode_token():
    """Valida JWT (Bearer ou cookie) e revogação no DB (current_token_hash)."""
    token = _get_token_from_request()
    if not token:
        return None
    try:
        payload = jwt.decode(token, app.config["SECRET_KEY"], algorithms=["HS256"])
    except jwt.InvalidTokenError:
        return None
    usuario = payload.get("usuario")
    if not usuario:
        return None
    db = get_db()
    col = db["usuarios"]
    doc = col.find_one({"usuario": usuario})
    if not doc:
        return None
    current_hash = doc.get("current_token_hash")
    if current_hash and current_hash != _token_hash(token):
        return None
    return payload


def token_required(f):
    """Decorator: exige JWT válido; expõe payload em g.jwt_payload."""

    @wraps(f)
    def wrapped(*args, **kwargs):
        payload = _decode_token()
        if not payload:
            return api_error("Não autenticado", 401)
        g.jwt_payload = payload
        return f(*args, **kwargs)

    return wrapped


def _roleplaying_ctx(require_write=False):
    return require_roleplaying_context(_decode_token, get_db, require_write=require_write)


def _issue_token_response(doc):
    """Gera JWT e atualiza current_token_hash; retorna corpo JSON para o cliente (Bearer)."""
    payload = {
        "usuario": doc["usuario"],
        "perfil": doc.get("perfil", "user"),
        "exp": datetime.utcnow() + timedelta(seconds=TOKEN_MAX_AGE),
    }
    token = jwt.encode(payload, app.config["SECRET_KEY"], algorithm="HS256")
    if isinstance(token, bytes):
        token = token.decode("utf-8")
    token_hash_val = _token_hash(token)
    try:
        get_db()["usuarios"].update_one({"_id": doc["_id"]}, {"$set": {"current_token_hash": token_hash_val}})
    except Exception:
        pass
    resp = {
        "success": True,
        "access_token": token,
        "token_type": "Bearer",
        "expires_in": TOKEN_MAX_AGE,
        "user": {
            "usuario": doc["usuario"],
            "perfil": doc.get("perfil", "user"),
            "campanhas": doc.get("campanhas") or [],
        },
    }
    return jsonify(resp), 200


@app.route("/api/auth/register", methods=["POST"])
def auth_register():
    """Cadastro: { usuario, senha } -> JWT + user."""
    _ensure_admin_user()
    data = request.get_json() or {}
    usuario = (data.get("usuario") or "").strip()
    senha = data.get("senha") or ""
    if len(usuario) < 3 or len(usuario) > 32:
        return api_error("Usuário deve ter entre 3 e 32 caracteres.", 422)
    if not re.match(r"^[a-zA-Z0-9_]+$", usuario):
        return api_error("Usuário: apenas letras, números e underscore.", 422)
    if len(senha) < 6:
        return api_error("Senha deve ter pelo menos 6 caracteres.", 422)
    db = get_db()
    col = db["usuarios"]
    if col.find_one({"usuario": usuario}):
        return api_error("Usuário já cadastrado.", 409)
    doc = {
        "usuario": usuario,
        "senha_hash": generate_password_hash(senha, method="pbkdf2:sha256"),
        "perfil": "user",
        "campanhas": [],
    }
    try:
        rid = col.insert_one(doc).inserted_id
        doc["_id"] = rid
    except Exception as e:
        return api_error(str(e), 400)
    return _issue_token_response(doc)


@app.route("/api/auth/login", methods=["POST"])
def auth_login():
    """Login: { usuario, senha } -> access_token (Bearer) + user."""
    _ensure_admin_user()
    data = request.get_json() or {}
    usuario = (data.get("usuario") or "").strip()
    senha = data.get("senha") or ""
    if not usuario or not senha:
        return api_error("Usuário e senha obrigatórios", 400)
    db = get_db()
    col = db["usuarios"]
    doc = col.find_one({"usuario": usuario})
    if not doc or not check_password_hash(doc.get("senha_hash", ""), senha):
        return api_error("Usuário ou senha inválidos", 401)
    return _issue_token_response(doc)


@app.route("/api/auth/logout", methods=["POST"])
def auth_logout():
    """Invalida o token atual no DB (stateless: cliente deve apagar o token local)."""
    payload = _decode_token()
    if payload and payload.get("usuario"):
        db = get_db()
        db["usuarios"].update_one({"usuario": payload["usuario"]}, {"$unset": {"current_token_hash": 1}})
    return jsonify({"success": True, "data": {"message": "Logout efetuado"}}), 200


@app.route("/api/auth/me", methods=["GET"])
def auth_me():
    """Retorna o usuário atual a partir do token (cookie ou header). 401 se não autenticado."""
    _ensure_admin_user()
    payload = _decode_token()
    if not payload:
        return jsonify({"error": "Não autenticado"}), 401
    db = get_db()
    doc = db["usuarios"].find_one({"usuario": payload["usuario"]})
    if not doc:
        return jsonify({"error": "Não autenticado"}), 401
    campanhas = doc.get("campanhas") or []
    ch = normalize_uuid(request.headers.get("X-Campanha-Id") or request.args.get("campanha_id") or "")
    pode = pode_editar_roleplaying_response(doc, ch)
    return jsonify({
        "usuario": doc["usuario"],
        "perfil": doc.get("perfil", "user"),
        "campanhas": campanhas,
        "pode_editar_roleplaying": pode,
    })


@app.route("/api/auth/senha", methods=["PATCH"])
def auth_change_password():
    """Altera a senha: { senha_atual, senha_nova }."""
    payload = _decode_token()
    if not payload:
        return jsonify({"error": "Não autenticado"}), 401
    data = request.get_json() or {}
    senha_atual = data.get("senha_atual") or ""
    senha_nova = data.get("senha_nova") or ""
    if len(senha_nova) < 6:
        return jsonify({"error": "A nova senha deve ter pelo menos 6 caracteres."}), 400
    db = get_db()
    col = db["usuarios"]
    doc = col.find_one({"usuario": payload["usuario"]})
    if not doc:
        return jsonify({"error": "Não autenticado"}), 401
    if not check_password_hash(doc.get("senha_hash", ""), senha_atual):
        return jsonify({"error": "Senha atual incorreta."}), 401
    col.update_one(
        {"_id": doc["_id"]},
        {"$set": {"senha_hash": generate_password_hash(senha_nova, method="pbkdf2:sha256")}},
    )
    return jsonify({"ok": True})


# ─── Armas ──────────────────────────────────────────────────────────────────

@app.route("/api/armas", methods=["GET"])
def list_armas():
    q = _build_query(["nome", "tipo"], {"tipo": request.args.get("tipo"), "peso": request.args.get("peso")})
    return jsonify(_list_collection("armas", q))


@app.route("/api/armas/<id>", methods=["GET"])
def get_arma(id):
    doc = _get_by_id("armas", id)
    if not doc:
        return jsonify({"error": "Não encontrado"}), 404
    return jsonify(doc)


@app.route("/api/armas", methods=["POST"])
def create_arma():
    data = request.get_json() or {}
    try:
        rid = _create("armas", data)
        return jsonify({"_id": rid}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 400


@app.route("/api/armas/<id>", methods=["PUT"])
def update_arma(id):
    data = request.get_json() or {}
    if _update("armas", id, data):
        return jsonify({"ok": True})
    return jsonify({"error": "Não encontrado ou sem alteração"}), 404


@app.route("/api/armas/<id>", methods=["DELETE"])
def delete_arma(id):
    if _delete("armas", id):
        return jsonify({"ok": True}), 204
    return jsonify({"error": "Não encontrado"}), 404


# ─── Armaduras ───────────────────────────────────────────────────────────────

@app.route("/api/armaduras", methods=["GET"])
def list_armaduras():
    q = _build_query(["nome", "tipo"], {"tipo": request.args.get("tipo"), "peso": request.args.get("peso")})
    return jsonify(_list_collection("armaduras", q))


@app.route("/api/armaduras/<id>", methods=["GET"])
def get_armadura(id):
    doc = _get_by_id("armaduras", id)
    if not doc:
        return jsonify({"error": "Não encontrado"}), 404
    return jsonify(doc)


@app.route("/api/armaduras", methods=["POST"])
def create_armadura():
    data = request.get_json() or {}
    try:
        rid = _create("armaduras", data)
        return jsonify({"_id": rid}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 400


@app.route("/api/armaduras/<id>", methods=["PUT"])
def update_armadura(id):
    data = request.get_json() or {}
    if _update("armaduras", id, data):
        return jsonify({"ok": True})
    return jsonify({"error": "Não encontrado"}), 404


@app.route("/api/armaduras/<id>", methods=["DELETE"])
def delete_armadura(id):
    if _delete("armaduras", id):
        return jsonify({"ok": True}), 204
    return jsonify({"error": "Não encontrado"}), 404


MULTIPLICADOR_MATERIAL = {"Comum": 1, "Incomum": 5, "Raro": 15, "Épico": 50, "Lendário": 100}
MULTIPLICADOR_RUNA = {"Básico": 5, "Intermediário": 20, "Superior": 50}
DIFICULDADE_RARIDADE = {"Comum": 10, "Incomum": 12, "Raro": 15, "Épico": 17, "Lendário": 20}
CAMPO_REINO_EQUIP = {"melee": "armas", "ranged": "armas", "arcane": "runicos", "Armadura": "armaduras", "Escudo": "escudos"}


@app.route("/api/equipamento-previa", methods=["POST"])
def equipamento_previa():
    """Retorna estatísticas e preço de um equipamento (arma ou armadura) com material e reino."""
    data = request.get_json() or {}
    db = get_db()
    tipo_eq = (data.get("tipo") or "arma").strip().lower()
    reino_id = data.get("reino_id")
    reino = None
    if reino_id:
        reino = _get_by_id("reinos", reino_id)
    if not reino:
        reino = {"nome": "", "armas": "0", "armaduras": "0", "escudos": "0", "runicos": "0"}

    if tipo_eq == "arma":
        item = _get_by_id("armas", data.get("item_id"))
        if not item:
            return jsonify({"error": "Arma não encontrada"}), 404
        campo_reino = CAMPO_REINO_EQUIP.get(item.get("tipo", "melee"), "armas")
    else:
        item = _get_by_id("armaduras", data.get("item_id"))
        if not item:
            return jsonify({"error": "Armadura não encontrada"}), 404
        campo_reino = CAMPO_REINO_EQUIP.get(item.get("tipo", "Armadura"), "armaduras")

    material = _get_by_id("materiais", data.get("material_id"))
    if not material:
        return jsonify({"error": "Material não encontrado"}), 404

    preco_base = float(item.get("preco", 0) or 0)
    mod_reino = float(reino.get(campo_reino, "0") or 0)
    raridade = material.get("raridade", "Comum")
    mult_mat = MULTIPLICADOR_MATERIAL.get(raridade, 1)
    mult_runa = 1
    runa_ids = data.get("runa_ids") or []
    if runa_ids:
        for rid in runa_ids:
            runa_doc = _get_by_id("runas", rid)
            if runa_doc and runa_doc.get("tier"):
                mult_runa *= MULTIPLICADOR_RUNA.get(runa_doc["tier"], 1)
    preco = round(preco_base * (1 + mod_reino) * mult_mat * mult_runa, 2)

    def parse_num(v):
        if v is None:
            return 0.0
        s = str(v).strip().lstrip("+")
        try:
            return float(s)
        except (ValueError, TypeError):
            return 0.0

    mat_bonus = parse_num(material.get("bonus"))
    mat_durab = parse_num(material.get("durabilidade"))
    durabilidade = float(item.get("durabilidade", 0) or 0) + mat_durab
    peso = item.get("peso", "?")
    if material.get("peso") == "Pesado":
        pi = (item.get("peso") or "").lower()
        if pi == "muito leve":
            peso = "Leve"
        elif pi == "leve":
            peso = "Médio"
        elif pi == "médio":
            peso = "Pesado"
        else:
            peso = "Muito Pesado"

    dificuldade = DIFICULDADE_RARIDADE.get(raridade, 10)
    out = {
        "nome": item.get("nome", "?"),
        "tipo": item.get("tipo", "?"),
        "material": material.get("material", "?"),
        "raridade": raridade,
        "peso": peso,
        "durabilidade": durabilidade,
        "preco": preco,
        "reino_nome": reino.get("nome", ""),
        "dificuldade_criacao": dificuldade,
        "dificuldade_extracao_material": dificuldade,
    }
    if runa_ids:
        runas_info = []
        for rid in runa_ids:
            r = _get_by_id("runas", rid)
            if r:
                runas_info.append({"nome": r.get("nome"), "tier": r.get("tier"), "efeito": r.get("efeito")})
        out["runas"] = runas_info
    if item.get("dano") is not None:
        out["dano"] = f"{item['dano']} +{int(mat_bonus)}" if mat_bonus >= 0 else f"{item['dano']} {int(mat_bonus)}"
    if item.get("defesa") is not None:
        try:
            out["defesa"] = float(item["defesa"]) + mat_bonus
        except (ValueError, TypeError):
            out["defesa"] = f"{item['defesa']} +{int(mat_bonus)}" if mat_bonus >= 0 else f"{item['defesa']} {int(mat_bonus)}"
    return jsonify(out)


# ─── Alquimia ────────────────────────────────────────────────────────────────

CUSTO_BASE_ELIXIR = {"Comum": 20, "Incomum": 100, "Raro": 500, "Épico": 2500, "Lendário": 10000}


@app.route("/api/elixir-previa", methods=["POST"])
def elixir_previa():
    """Retorna prévia de preço de um elixir com tipo de matéria-prima e reino."""
    data = request.get_json() or {}
    db = get_db()
    elixir = _get_by_id("alquimia", data.get("elixir_id"))
    if not elixir:
        return jsonify({"error": "Elixir não encontrado"}), 404
    tipo_mat = (data.get("tipo_material") or "vegetal").strip().lower()
    if tipo_mat not in ("vegetal", "animal", "mineral", "demoníaco"):
        tipo_mat = "vegetal"
    reino = None
    if data.get("reino_id"):
        reino = _get_by_id("reinos", data.get("reino_id"))
    if not reino:
        reino = {"nome": "", "alquimia": "0"}
    mod_reino = float(reino.get("alquimia", "0") or 0)
    campo_rar = f"{tipo_mat}_rar"
    campo_pot = f"{tipo_mat}_pot"
    raridade = elixir.get(campo_rar, "Comum")
    potencia = elixir.get(campo_pot, "")
    custo_base = CUSTO_BASE_ELIXIR.get(raridade, 20)
    preco = round(custo_base * (1 + mod_reino), 2)
    dificuldade = DIFICULDADE_RARIDADE.get(raridade, 10)
    return jsonify({
        "nome": elixir.get("nome", "?"),
        "efeito": elixir.get("efeito", "?"),
        "descricao": elixir.get("descrição", ""),
        "material": tipo_mat,
        "raridade": raridade,
        "potencia": potencia,
        "preco": preco,
        "reino_nome": reino.get("nome", ""),
        "dificuldade_criacao": dificuldade,
        "dificuldade_extracao_material": dificuldade,
    })


@app.route("/api/alquimia", methods=["GET"])
def list_alquimia():
    q = _build_query(["nome", "efeito"], {})
    return jsonify(_list_collection("alquimia", q))


@app.route("/api/alquimia/<id>", methods=["GET"])
def get_alquimia(id):
    doc = _get_by_id("alquimia", id)
    if not doc:
        return jsonify({"error": "Não encontrado"}), 404
    return jsonify(doc)


@app.route("/api/alquimia", methods=["POST"])
def create_alquimia():
    data = request.get_json() or {}
    try:
        rid = _create("alquimia", data)
        return jsonify({"_id": rid}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 400


@app.route("/api/alquimia/<id>", methods=["PUT"])
def update_alquimia(id):
    data = request.get_json() or {}
    if _update("alquimia", id, data):
        return jsonify({"ok": True})
    return jsonify({"error": "Não encontrado"}), 404


@app.route("/api/alquimia/<id>", methods=["DELETE"])
def delete_alquimia(id):
    if _delete("alquimia", id):
        return jsonify({"ok": True}), 204
    return jsonify({"error": "Não encontrado"}), 404


# ─── Reinos ──────────────────────────────────────────────────────────────────

@app.route("/api/reinos", methods=["GET"])
def list_reinos():
    q = _build_query(["nome"], {})
    return jsonify(_list_collection("reinos", q))


@app.route("/api/reinos/<id>", methods=["GET"])
def get_reino(id):
    doc = _get_by_id("reinos", id)
    if not doc:
        return jsonify({"error": "Não encontrado"}), 404
    return jsonify(doc)


@app.route("/api/reinos", methods=["POST"])
def create_reino():
    data = request.get_json() or {}
    try:
        rid = _create("reinos", data)
        return jsonify({"_id": rid}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 400


@app.route("/api/reinos/<id>", methods=["PUT"])
def update_reino(id):
    data = request.get_json() or {}
    if _update("reinos", id, data):
        return jsonify({"ok": True})
    return jsonify({"error": "Não encontrado"}), 404


@app.route("/api/reinos/<id>", methods=["DELETE"])
def delete_reino(id):
    if _delete("reinos", id):
        return jsonify({"ok": True}), 204
    return jsonify({"error": "Não encontrado"}), 404


@app.route("/api/reinos-info", methods=["GET"])
def get_reinos_info():
    """Retorna a lista de reinos com raça e sobrenomes (reinos-info.json)."""
    if not os.path.isfile(REINOS_INFO_PATH):
        return jsonify([])
    try:
        with open(REINOS_INFO_PATH, "r", encoding="utf-8") as f:
            data = json.load(f)
        return jsonify(data)
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/api/reinos/<id>/historia", methods=["GET"])
def get_reino_historia(id):
    """Retorna o conteúdo da história do reino (arquivo em front/historias/<nome>.md)."""
    doc = _get_by_id("reinos", id)
    if not doc:
        return jsonify({"error": "Reino não encontrado"}), 404
    nome = (doc.get("nome") or "").strip()
    if not nome:
        return jsonify({"nome": "", "raça": "", "historia": ""})
    # Nome seguro para arquivo: sem caracteres perigosos
    safe = re.sub(r'[^\w\s\-–—]', "", nome)
    safe = re.sub(r'\s+', "_", safe).strip("_") or nome.replace(" ", "_")
    for ext in (".md", ".txt", ""):
        path = os.path.join(HISTORIAS_DIR, safe + ext)
        if os.path.isfile(path):
            try:
                with open(path, "r", encoding="utf-8") as f:
                    texto = f.read()
            except Exception:
                texto = ""
            return jsonify({"nome": nome, "historia": texto})
    # Placeholder: só raça (reinos-info tem raça; reinos no DB podem não ter)
    return jsonify({"nome": nome, "historia": f"# {nome}\n\n*(Arquivo de história não encontrado em historias/.)*"})


# ─── Viagens (coordenadas por categoria) ─────────────────────────────────────

_CATEGORIA_LABEL = {"drovenar": "Drovenar", "vaelthor": "Vaelthor", "sylmari": "Sylmari", "points": "Pontos de Interesse"}


@app.route("/api/viagens/categorias", methods=["GET"])
def list_viagens_categorias():
    """Lista categorias de coordenadas: Drovenar, Vaelthor, Sylmari, Pontos de Interesse."""
    if not os.path.isdir(COORDENADAS_DIR):
        return jsonify([])
    out = []
    for name in sorted(os.listdir(COORDENADAS_DIR)):
        if not name.endswith(".json") or not name.startswith("coordenadas-"):
            continue
        slug = name.replace("coordenadas-", "").replace(".json", "").lower()
        label = _CATEGORIA_LABEL.get(slug) or slug.capitalize()
        out.append({"id": slug, "label": label})
    return jsonify(out)


@app.route("/api/viagens/coordenadas/<categoria>", methods=["GET"])
def get_viagens_coordenadas(categoria):
    """Retorna lista de lugares da categoria: [{ nome, coords: [x, y] }]."""
    slug = (categoria or "").strip().lower()
    if not slug:
        return jsonify([])
    fname = f"coordenadas-{slug}.json"
    path = os.path.join(COORDENADAS_DIR, fname)
    if not os.path.isfile(path):
        return jsonify([])
    try:
        with open(path, "r", encoding="utf-8") as f:
            data = json.load(f)
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    # Normalizar: pode ser lista de { "Nome": [x,y] } ou um único objeto
    if isinstance(data, list):
        items = data
    else:
        items = [data] if isinstance(data, dict) else []
    out = []
    for item in items:
        if isinstance(item, dict):
            for nome, coords in item.items():
                if isinstance(coords, (list, tuple)) and len(coords) >= 2:
                    out.append({"nome": nome, "coords": [float(coords[0]), float(coords[1])]})
    return jsonify(out)


@app.route("/api/mapas/<filename>", methods=["GET"])
def get_mapa_asset(filename):
    """Serve uma imagem da pasta front/historias/mapas pelo nome do arquivo (ex.: camping.jpg)."""
    if not filename or ".." in filename or "/" in filename or "\\" in filename:
        return jsonify({"error": "Nome de arquivo inválido"}), 400
    path = os.path.join(MAPAS_DIR, filename)
    if not os.path.isfile(path):
        return jsonify({"error": "Arquivo não encontrado"}), 404
    ext = os.path.splitext(filename)[1].lower()
    mime = {".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".webp": "image/webp", ".gif": "image/gif"}
    return send_file(path, mimetype=mime.get(ext, "image/jpeg"))


@app.route("/api/reinos/<id>/mapa", methods=["GET"])
def get_reino_mapa(id):
    """Retorna a imagem do mapa do reino (arquivo em front/historias/mapas/<nome>.(png|jpg|...))."""
    doc = _get_by_id("reinos", id)
    if not doc:
        return jsonify({"error": "Reino não encontrado"}), 404
    nome = (doc.get("nome") or "").strip()
    if not nome:
        return jsonify({"error": "Reino sem nome"}), 404
    safe = re.sub(r'[^\w\s\-–—]', "", nome)
    safe = re.sub(r'\s+', "_", safe).strip("_") or nome.replace(" ", "_")
    # Tenta o nome normalizado e a variante em minúsculas (ex.: Khasil no DB ↔ khasil.jpeg no disco)
    bases = []
    for b in (safe, safe.lower()):
        if b and b not in bases:
            bases.append(b)
    # Ordem: jpg/jpeg antes de png (mapas costumam ser fotos/export JPEG; ainda aceita png e demais)
    for base in bases:
        for ext in (".jpg", ".jpeg", ".png", ".webp", ".gif"):
            path = os.path.join(MAPAS_DIR, base + ext)
            if os.path.isfile(path):
                mime = {".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".webp": "image/webp", ".gif": "image/gif"}
                return send_file(path, mimetype=mime.get(ext, "image/png"))
    return jsonify({"error": "Mapa não encontrado para este reino"}), 404


@app.route("/api/historias/world-story-for-players", methods=["GET"])
def get_world_story():
    """Retorna o conteúdo de front/historias/world-story-for-players.md para a aba Início."""
    path = os.path.join(HISTORIAS_DIR, "world-story-for-players.md")
    try:
        if os.path.isfile(path):
            with open(path, "r", encoding="utf-8") as f:
                texto = f.read()
        else:
            texto = "Khonum é um mundo fantasioso fantástico!"
    except Exception:
        texto = "Khonum é um mundo fantasioso fantástico!"
    return jsonify({"historia": texto})


# ─── Materiais ──────────────────────────────────────────────────────────────

@app.route("/api/materiais", methods=["GET"])
def list_materiais():
    q = _build_query(["material", "tipo", "raridade"], {
        "tipo": request.args.get("tipo"),
        "rank": request.args.get("rank"),
        "raridade": request.args.get("raridade"),
    })
    return jsonify(_list_collection("materiais", q, sort_key="material"))


@app.route("/api/materiais/<id>", methods=["GET"])
def get_material(id):
    doc = _get_by_id("materiais", id)
    if not doc:
        return jsonify({"error": "Não encontrado"}), 404
    return jsonify(doc)


@app.route("/api/materiais", methods=["POST"])
def create_material():
    data = request.get_json() or {}
    try:
        rid = _create("materiais", data)
        return jsonify({"_id": rid}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 400


@app.route("/api/materiais/<id>", methods=["PUT"])
def update_material(id):
    data = request.get_json() or {}
    if _update("materiais", id, data):
        return jsonify({"ok": True})
    return jsonify({"error": "Não encontrado"}), 404


@app.route("/api/materiais/<id>", methods=["DELETE"])
def delete_material(id):
    if _delete("materiais", id):
        return jsonify({"ok": True}), 204
    return jsonify({"error": "Não encontrado"}), 404


# ─── Runas ───────────────────────────────────────────────────────────────────

@app.route("/api/runas", methods=["GET"])
def list_runas():
    q = _build_query(["nome", "efeito"], {
        "tier": request.args.get("tier"),
    })
    # elemento pode vir 1 ou mais vezes: ?elemento=Genia ou ?elemento=Genia&elemento=Degila
    elementos = request.args.getlist("elemento")
    if elementos:
        elementos_norm = [e.strip() for e in elementos if e and str(e).strip()]
        if elementos_norm:
            # Runas cujo array "elementos" contém todos os selecionados (match case-insensitive)
            # Para array de strings, $regex no campo matching qualquer elemento
            and_elems = []
            for e in elementos_norm:
                and_elems.append({"elementos": {"$regex": r"^%s$" % re.escape(e), "$options": "i"}})
            if and_elems:
                q["$and"] = q.get("$and", []) + and_elems
    try:
        items = _list_collection("runas", q)
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    tier_order = {"Básico": 0, "Intermediário": 1, "Superior": 2}
    items.sort(key=lambda x: (tier_order.get(x.get("tier") or "", 99), (x.get("nome") or "")))
    return jsonify(items)


@app.route("/api/runas/<id>", methods=["GET"])
def get_runa(id):
    doc = _get_by_id("runas", id)
    if not doc:
        return jsonify({"error": "Não encontrado"}), 404
    return jsonify(doc)


@app.route("/api/runas", methods=["POST"])
def create_runa():
    data = request.get_json() or {}
    try:
        rid = _create("runas", data)
        return jsonify({"_id": rid}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 400


@app.route("/api/runas/<id>", methods=["PUT"])
def update_runa(id):
    data = request.get_json() or {}
    if _update("runas", id, data):
        return jsonify({"ok": True})
    return jsonify({"error": "Não encontrado"}), 404


@app.route("/api/runas/<id>", methods=["DELETE"])
def delete_runa(id):
    if _delete("runas", id):
        return jsonify({"ok": True}), 204
    return jsonify({"error": "Não encontrado"}), 404


# ─── Campanhas ─────────────────────────────────────────────────────────────

@app.route("/api/campanhas", methods=["GET"])
def list_campanhas():
    payload = _decode_token()
    if not payload:
        return jsonify({"error": "Não autenticado"}), 401
    db = get_db()
    user_doc = db["usuarios"].find_one({"usuario": payload["usuario"]})
    if not user_doc:
        return jsonify({"error": "Não autenticado"}), 401
    if user_doc.get("perfil") == "admin":
        items = list(db["campanhas"].find().sort("nome", 1))
        return jsonify([serialize(d) for d in items])
    ids = []
    for c in user_doc.get("campanhas") or []:
        cid = c.get("campanha_id")
        if cid:
            ids.append(str(cid))
    if not ids:
        return jsonify([])
    items = list(db["campanhas"].find({"id": {"$in": ids}}).sort("nome", 1))
    return jsonify([serialize(d) for d in items])


@app.route("/api/campanhas/catalogo", methods=["GET"])
def campanhas_catalogo():
    """Lista campanhas (nome, mestre, id) para ingressar. ?excluir_minhas=1 remove as que o usuário já possui."""
    payload = _decode_token()
    if not payload:
        return jsonify({"error": "Não autenticado"}), 401
    db = get_db()
    user_doc = db["usuarios"].find_one({"usuario": payload["usuario"]})
    if not user_doc:
        return jsonify({"error": "Não autenticado"}), 401
    excluir = (request.args.get("excluir_minhas") or "").strip().lower() in ("1", "true", "yes", "on")
    minhas = set()
    if excluir:
        for c in user_doc.get("campanhas") or []:
            cid = c.get("campanha_id")
            if cid:
                nu = normalize_uuid(str(cid))
                if nu:
                    minhas.add(nu)
    items = list(db["campanhas"].find().sort("nome", 1))
    out = []
    for d in items:
        cid = d.get("id")
        nu = normalize_uuid(str(cid)) if cid else None
        if excluir and nu and nu in minhas:
            continue
        out.append({"id": d["id"], "nome": d.get("nome", ""), "mestre": d.get("mestre", "")})
    return jsonify(out)


@app.route("/api/campanhas/criar", methods=["POST"])
def campanha_criar_usuario():
    """Cria campanha com nome único; mestre = usuário logado; adiciona ao perfil como mestre."""
    payload = _decode_token()
    if not payload:
        return jsonify({"error": "Não autenticado"}), 401
    usuario = payload["usuario"]
    data = request.get_json() or {}
    nome = (data.get("nome") or "").strip()
    if not nome:
        return jsonify({"error": "Nome da campanha é obrigatório."}), 400
    db = get_db()
    if db["campanhas"].find_one({"nome": nome}):
        return jsonify({"error": "Já existe uma campanha com este nome."}), 409
    cid = str(uuid.uuid4())
    try:
        db["campanhas"].insert_one({"id": cid, "nome": nome, "mestre": usuario})
        db["usuarios"].update_one(
            {"usuario": usuario},
            {"$push": {"campanhas": {"function": "mestre", "campanha_id": cid}}},
        )
    except Exception as e:
        return jsonify({"error": str(e)}), 400
    return jsonify({"id": cid, "nome": nome, "mestre": usuario}), 201


@app.route("/api/campanhas/ingressar", methods=["POST"])
def campanha_ingressar():
    """Adiciona campanha existente ao perfil como jogador: { campanha_id }."""
    payload = _decode_token()
    if not payload:
        return jsonify({"error": "Não autenticado"}), 401
    usuario = payload["usuario"]
    data = request.get_json() or {}
    cid = normalize_uuid(data.get("campanha_id") or data.get("campanha") or "")
    if not cid:
        return jsonify({"error": "campanha_id inválido."}), 400
    db = get_db()
    user_doc = db["usuarios"].find_one({"usuario": usuario})
    if not user_doc:
        return jsonify({"error": "Não autenticado"}), 401
    if not db["campanhas"].find_one({"id": cid}):
        return jsonify({"error": "Campanha não encontrada."}), 404
    for c in user_doc.get("campanhas") or []:
        if normalize_uuid(str(c.get("campanha_id") or "")) == cid:
            return jsonify({"error": "Você já participa desta campanha."}), 409
    db["usuarios"].update_one(
        {"usuario": usuario},
        {"$push": {"campanhas": {"function": "jogador", "campanha_id": cid}}},
    )
    return jsonify({"ok": True}), 200


@app.route("/api/campanhas/perfil/<campanha_id>", methods=["DELETE"])
def campanha_sair_perfil(campanha_id):
    """Remove a campanha do perfil (apenas se function for jogador)."""
    payload = _decode_token()
    if not payload:
        return jsonify({"error": "Não autenticado"}), 401
    usuario = payload["usuario"]
    cid = normalize_uuid(campanha_id)
    if not cid:
        return jsonify({"error": "campanha_id inválido."}), 400
    db = get_db()
    user_doc = db["usuarios"].find_one({"usuario": usuario})
    if not user_doc:
        return jsonify({"error": "Não autenticado"}), 401
    entry = None
    for c in user_doc.get("campanhas") or []:
        if normalize_uuid(str(c.get("campanha_id") or "")) == cid:
            entry = c
            break
    if not entry:
        return jsonify({"error": "Campanha não encontrada no seu perfil."}), 404
    fn = (entry.get("function") or "").strip().lower()
    if fn == "mestre":
        return jsonify({"error": "Mestres não podem apenas sair do perfil. Exclua a campanha ou transfira o mestre."}), 403
    db["usuarios"].update_one({"usuario": usuario}, {"$pull": {"campanhas": {"campanha_id": cid}}})
    return jsonify({"ok": True}), 200


@app.route("/api/campanhas/<campanha_id>", methods=["DELETE"])
def campanha_deletar(campanha_id):
    """Mestre da campanha (ou admin global) exclui a campanha, vínculos em usuários e dados de roleplaying."""
    payload = _decode_token()
    if not payload:
        return jsonify({"error": "Não autenticado"}), 401
    usuario = payload["usuario"]
    cid = normalize_uuid(campanha_id)
    if not cid:
        return jsonify({"error": "campanha_id inválido."}), 400
    db = get_db()
    user_doc = db["usuarios"].find_one({"usuario": usuario})
    if not user_doc:
        return jsonify({"error": "Não autenticado"}), 401
    is_global_admin = user_doc.get("perfil") == "admin"
    is_mestre = False
    for c in user_doc.get("campanhas") or []:
        if normalize_uuid(str(c.get("campanha_id") or "")) == cid and (c.get("function") or "").strip().lower() == "mestre":
            is_mestre = True
            break
    if not is_global_admin and not is_mestre:
        return jsonify({"error": "Apenas o mestre da campanha ou um administrador pode excluí-la."}), 403
    res = db["campanhas"].delete_one({"id": cid})
    if res.deleted_count == 0:
        return jsonify({"error": "Campanha não encontrada."}), 404
    db["usuarios"].update_many({}, {"$pull": {"campanhas": {"campanha_id": cid}}})
    for coll in ("NPC", "demon_NPC", "fera_NPC", "equipamentos_NPC", "elixir_NPC", "estabelecimentos"):
        if coll in db.list_collection_names():
            db[coll].delete_many({"campanha": cid})
    return jsonify({"ok": True}), 200


# ─── NPC ────────────────────────────────────────────────────────────────────

@app.route("/api/npcs", methods=["GET"])
def list_npcs():
    err, ctx = _roleplaying_ctx(require_write=False)
    if err:
        return err
    q = _build_query(["nome", "tipo", "raça", "natureza"], {
        "raça": request.args.get("raça"),
        "natureza": request.args.get("natureza"),
    })
    _apply_estabelecimentos_filter(q)
    q = merge_campaign_filter(q, ctx)
    return jsonify(_list_collection("NPC", q))


@app.route("/api/npcs/<id>", methods=["GET"])
def get_npc(id):
    err, ctx = _roleplaying_ctx(require_write=False)
    if err:
        return err
    doc = _get_by_id("NPC", id)
    if not doc:
        return jsonify({"error": "Não encontrado"}), 404
    if not assert_doc_in_campaign(doc, ctx):
        return jsonify({"error": "Não encontrado"}), 404
    return jsonify(serialize(doc))


@app.route("/api/npcs/<id>/completo", methods=["GET"])
def get_npc_completo(id):
    """Retorna NPC com equipamentos e elixires (por personagem_dono = nome do NPC). Enriquece com ataque1, ataque2, armadura_val, defesa_escudo."""
    err, ctx = _roleplaying_ctx(require_write=False)
    if err:
        return err
    doc = _get_by_id("NPC", id)
    if not doc:
        return jsonify({"error": "Não encontrado"}), 404
    if not assert_doc_in_campaign(doc, ctx):
        return jsonify({"error": "Não encontrado"}), 404
    nome = doc.get("nome")
    if nome:
        db = get_db()
        eq_q = {"personagem_dono": nome}
        el_q = {"personagem_dono": nome}
        if doc.get("campanha"):
            eq_q["campanha"] = doc["campanha"]
            el_q["campanha"] = doc["campanha"]
        equipamentos = list(db["equipamentos_NPC"].find(eq_q).sort("tipo", 1))
        elixires = list(db["elixir_NPC"].find(el_q).sort("nome", 1))
        doc["equipamentos"] = [serialize(e) for e in equipamentos]
        doc["elixires"] = [serialize(el) for el in elixires]
        armas = [e for e in equipamentos if (e.get("tipo") or "").lower() in ("melee", "ranged", "arcane")]
        armaduras = [e for e in equipamentos if (e.get("tipo") or "") == "Armadura"]
        escudos = [e for e in equipamentos if (e.get("tipo") or "") == "Escudo"]
        if len(armas) >= 1:
            doc["ataque1"] = armas[0].get("dano") or armas[0].get("bônus") or armas[0].get("bonus") or "—"
        if len(armas) >= 2:
            doc["ataque2"] = armas[1].get("dano") or armas[1].get("bônus") or armas[1].get("bonus") or "—"
        if armaduras:
            doc["armadura_val"] = armaduras[0].get("defesa") or armaduras[0].get("bônus") or armaduras[0].get("bonus") or "—"
        if escudos:
            doc["defesa_escudo"] = escudos[0].get("bônus") or escudos[0].get("bonus") or escudos[0].get("defesa") or "—"
    return jsonify(doc)


@app.route("/api/npcs", methods=["POST"])
def create_npc():
    err, ctx = _roleplaying_ctx(require_write=True)
    if err:
        return err
    data = request.get_json() or {}
    cid, cerr = resolve_campanha_for_insert(ctx, data)
    if cerr:
        return cerr
    data = strip_campanha_from_body_for_player(data, ctx)
    data["campanha"] = cid
    try:
        rid = _create("NPC", data)
        return jsonify({"_id": rid}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 400


@app.route("/api/npcs/gerar", methods=["POST"])
def gerar_npc():
    """Gera e salva um NPC a partir das escolhas (raça, reino, linhagem, tipo, classe, natureza, nível)."""
    err, ctx = _roleplaying_ctx(require_write=True)
    if err:
        return err
    data = request.get_json() or {}
    raca = (data.get("raca") or "").strip()
    reino_nome = (data.get("reino_nome") or "").strip()
    linhagem = (data.get("linhagem") or "comum").strip().lower()
    if linhagem not in ("nobre", "comum"):
        linhagem = "comum"
    tipo_npc = (data.get("tipo_npc") or "").strip()
    classe = (data.get("classe") or "").strip()
    natureza = (data.get("natureza") or "Neutro").strip()
    try:
        nivel = int(data.get("nivel", 1))
        if nivel < 1 or nivel > 5:
            nivel = 1
    except (TypeError, ValueError):
        nivel = 1
    if not raca or not reino_nome or not tipo_npc or not classe:
        return jsonify({"error": "Faltam raça, reino, tipo ou classe."}), 400
    if not os.path.isfile(REINOS_INFO_PATH):
        return jsonify({"error": "Arquivo reinos-info não encontrado."}), 500
    try:
        with open(REINOS_INFO_PATH, "r", encoding="utf-8") as f:
            reinos_lista = json.load(f)
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    try:
        cid, cerr = resolve_campanha_for_insert(ctx, data)
        if cerr:
            return cerr
        logger.info(
            "gerar_npc | início | raca=%s reino=%s tipo=%s classe=%s nivel=%s | campanha=%s",
            raca,
            reino_nome,
            tipo_npc,
            classe,
            nivel,
            cid,
        )
        from service.storytelling.custom.gerar_npc_custom import criar_npc_por_escolhas
        db = get_db()
        result = criar_npc_por_escolhas(
            db, reinos_lista, raca, reino_nome, linhagem, tipo_npc, classe, natureza, nivel,
            campanha_id=cid,
        )
        if result is None:
            logger.warning("gerar_npc | reino não encontrado para raça | raca=%s reino=%s", raca, reino_nome)
            return jsonify({"error": "Reino não encontrado para essa raça."}), 400
        logger.info("gerar_npc | ok | nome=%s", (result or {}).get("nome"))
        return jsonify(result), 201
    except Exception as e:
        traceback.print_exc(file=sys.stderr)
        logger.exception("gerar_npc | falha: %s", e)
        return jsonify({"error": str(e)}), 500


@app.route("/api/npcs/<id>", methods=["PUT"])
def update_npc(id):
    try:
        err, ctx = _roleplaying_ctx(require_write=True)
        if err:
            return err
        doc = _get_by_id("NPC", id)
        if not doc:
            return jsonify({"error": "Não encontrado"}), 404
        if not assert_doc_in_campaign(doc, ctx):
            return jsonify({"error": "Não encontrado"}), 404
        data = strip_campanha_from_body_for_player(request.get_json() or {}, ctx)
        if _update("NPC", id, data):
            return jsonify({"ok": True})
        return jsonify({"error": "Não encontrado"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/api/npcs/<id>", methods=["DELETE"])
def delete_npc(id):
    try:
        err, ctx = _roleplaying_ctx(require_write=True)
        if err:
            return err
        doc = _get_by_id("NPC", id)
        if not doc:
            return jsonify({"error": "Não encontrado"}), 404
        if not assert_doc_in_campaign(doc, ctx):
            return jsonify({"error": "Não encontrado"}), 404
        if _delete("NPC", id):
            return jsonify({"ok": True}), 204
        return jsonify({"error": "Não encontrado"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ─── Demônios (demon_NPC) ───────────────────────────────────────────────────

@app.route("/api/demonios", methods=["GET"])
def list_demonios():
    err, ctx = _roleplaying_ctx(require_write=False)
    if err:
        return err
    q = _build_query(["nome", "tipo", "raça"], {"nível": request.args.get("nível")})
    _apply_estabelecimentos_filter(q)
    q = merge_campaign_filter(q, ctx)
    return jsonify(_list_collection("demon_NPC", q, sort_key="nome"))


@app.route("/api/demonios/<id>", methods=["GET"])
def get_demonio(id):
    err, ctx = _roleplaying_ctx(require_write=False)
    if err:
        return err
    doc = _get_by_id("demon_NPC", id)
    if not doc:
        return jsonify({"error": "Não encontrado"}), 404
    if not assert_doc_in_campaign(doc, ctx):
        return jsonify({"error": "Não encontrado"}), 404
    return jsonify(serialize(doc))


@app.route("/api/demonios/gerar", methods=["POST"])
def gerar_demonio():
    """Gera um demônio semi-aleatório (tier + nome opcional + elemento opcional) e salva em demon_NPC."""
    err, ctx = _roleplaying_ctx(require_write=True)
    if err:
        return err
    data = request.get_json() or {}
    tier = (data.get("tier") or "normal").strip().lower()
    if tier not in ("inferior", "normal", "superior"):
        tier = "normal"
    nome = (data.get("nome") or "").strip() or None
    elemento = (data.get("elemento") or "").strip() or None
    if elemento and elemento not in ("Genia", "Degila", "Reetear", "Arunalt", "Saltrat", "Pascalia"):
        elemento = None
    try:
        cid, cerr = resolve_campanha_for_insert(ctx, data)
        if cerr:
            return cerr
        logger.info("gerar_demonio | tier=%s nome=%s elemento=%s | campanha=%s", tier, nome, elemento, cid)
        from gerar_demon import gerar_demon_npc
        db = get_db()
        doc = gerar_demon_npc(tier, db, nome=nome, elemento=elemento)
        doc["campanha"] = cid
        rid = _create("demon_NPC", doc)
        logger.info("gerar_demonio | ok | id=%s nome=%s", rid, doc.get("nome"))
        return jsonify({"_id": rid, "nome": doc.get("nome")}), 201
    except Exception as e:
        logger.exception("gerar_demonio | falha")
        return jsonify({"error": str(e)}), 400


@app.route("/api/demonios", methods=["POST"])
def create_demonio():
    err, ctx = _roleplaying_ctx(require_write=True)
    if err:
        return err
    data = request.get_json() or {}
    cid, cerr = resolve_campanha_for_insert(ctx, data)
    if cerr:
        return cerr
    data = strip_campanha_from_body_for_player(data, ctx)
    data["campanha"] = cid
    try:
        rid = _create("demon_NPC", data)
        return jsonify({"_id": rid}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 400


@app.route("/api/demonios/<id>", methods=["PUT"])
def update_demonio(id):
    try:
        err, ctx = _roleplaying_ctx(require_write=True)
        if err:
            return err
        doc = _get_by_id("demon_NPC", id)
        if not doc:
            return jsonify({"error": "Não encontrado"}), 404
        if not assert_doc_in_campaign(doc, ctx):
            return jsonify({"error": "Não encontrado"}), 404
        data = strip_campanha_from_body_for_player(request.get_json() or {}, ctx)
        if _update("demon_NPC", id, data):
            return jsonify({"ok": True})
        return jsonify({"error": "Não encontrado"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/api/demonios/<id>", methods=["DELETE"])
def delete_demonio(id):
    try:
        err, ctx = _roleplaying_ctx(require_write=True)
        if err:
            return err
        doc = _get_by_id("demon_NPC", id)
        if not doc:
            return jsonify({"error": "Não encontrado"}), 404
        if not assert_doc_in_campaign(doc, ctx):
            return jsonify({"error": "Não encontrado"}), 404
        if _delete("demon_NPC", id):
            return jsonify({"ok": True}), 204
        return jsonify({"error": "Não encontrado"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ─── Animais / Feras (fera_NPC) ──────────────────────────────────────────────

@app.route("/api/animais", methods=["GET"])
def list_animais():
    err, ctx = _roleplaying_ctx(require_write=False)
    if err:
        return err
    q = _build_query(["nome", "tipo", "raça"], {"nível": request.args.get("nível")})
    _apply_estabelecimentos_filter(q)
    q = merge_campaign_filter(q, ctx)
    return jsonify(_list_collection("fera_NPC", q, sort_key="nome"))


@app.route("/api/animais/<id>", methods=["GET"])
def get_animal(id):
    err, ctx = _roleplaying_ctx(require_write=False)
    if err:
        return err
    doc = _get_by_id("fera_NPC", id)
    if not doc:
        return jsonify({"error": "Não encontrado"}), 404
    if not assert_doc_in_campaign(doc, ctx):
        return jsonify({"error": "Não encontrado"}), 404
    return jsonify(serialize(doc))


@app.route("/api/animais/gerar", methods=["POST"])
def gerar_animal():
    """Gera um animal semi-aleatório (tier + tipo + nome opcional) e salva em fera_NPC."""
    err, ctx = _roleplaying_ctx(require_write=True)
    if err:
        return err
    data = request.get_json() or {}
    tier = (data.get("tier") or "comum").strip().lower()
    if tier not in ("comum", "grande", "arcano"):
        tier = "comum"
    tipo = (data.get("tipo") or "Terrestre").strip()
    if tipo not in ("Terrestre", "Aquático", "Voador"):
        tipo = "Terrestre"
    nome = (data.get("nome") or "").strip() or None
    try:
        cid, cerr = resolve_campanha_for_insert(ctx, data)
        if cerr:
            return cerr
        logger.info("gerar_animal | tier=%s tipo=%s nome=%s | campanha=%s", tier, tipo, nome, cid)
        from gerar_fera import gerar_fera_npc
        db = get_db()
        doc = gerar_fera_npc(tier, tipo, db, nome=nome)
        doc["campanha"] = cid
        rid = _create("fera_NPC", doc)
        logger.info("gerar_animal | ok | id=%s nome=%s", rid, doc.get("nome"))
        return jsonify({"_id": rid, "nome": doc.get("nome")}), 201
    except Exception as e:
        logger.exception("gerar_animal | falha")
        return jsonify({"error": str(e)}), 400


@app.route("/api/animais", methods=["POST"])
def create_animal():
    err, ctx = _roleplaying_ctx(require_write=True)
    if err:
        return err
    data = request.get_json() or {}
    cid, cerr = resolve_campanha_for_insert(ctx, data)
    if cerr:
        return cerr
    data = strip_campanha_from_body_for_player(data, ctx)
    data["campanha"] = cid
    try:
        rid = _create("fera_NPC", data)
        return jsonify({"_id": rid}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 400


@app.route("/api/animais/<id>", methods=["PUT"])
def update_animal(id):
    try:
        err, ctx = _roleplaying_ctx(require_write=True)
        if err:
            return err
        doc = _get_by_id("fera_NPC", id)
        if not doc:
            return jsonify({"error": "Não encontrado"}), 404
        if not assert_doc_in_campaign(doc, ctx):
            return jsonify({"error": "Não encontrado"}), 404
        data = strip_campanha_from_body_for_player(request.get_json() or {}, ctx)
        if _update("fera_NPC", id, data):
            return jsonify({"ok": True})
        return jsonify({"error": "Não encontrado"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/api/animais/<id>", methods=["DELETE"])
def delete_animal(id):
    try:
        err, ctx = _roleplaying_ctx(require_write=True)
        if err:
            return err
        doc = _get_by_id("fera_NPC", id)
        if not doc:
            return jsonify({"error": "Não encontrado"}), 404
        if not assert_doc_in_campaign(doc, ctx):
            return jsonify({"error": "Não encontrado"}), 404
        if _delete("fera_NPC", id):
            return jsonify({"ok": True}), 204
        return jsonify({"error": "Não encontrado"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ─── Equipamentos NPC ───────────────────────────────────────────────────────

@app.route("/api/equipamentos-npc", methods=["GET"])
def list_equipamentos_npc():
    err, ctx = _roleplaying_ctx(require_write=False)
    if err:
        return err
    q = {}
    dono = request.args.get("personagem_dono")
    if dono:
        q["personagem_dono"] = dono
    tipo = request.args.get("tipo")
    if tipo:
        q["tipo"] = tipo
    q = merge_campaign_filter(q, ctx)
    return jsonify(_list_collection("equipamentos_NPC", q if q else None, sort_key="nome"))


@app.route("/api/equipamentos-npc/<id>", methods=["GET"])
def get_equipamento_npc(id):
    err, ctx = _roleplaying_ctx(require_write=False)
    if err:
        return err
    doc = _get_by_id("equipamentos_NPC", id)
    if not doc:
        return jsonify({"error": "Não encontrado"}), 404
    if not assert_doc_in_campaign(doc, ctx):
        return jsonify({"error": "Não encontrado"}), 404
    return jsonify(doc)


@app.route("/api/equipamentos-npc", methods=["POST"])
def create_equipamento_npc():
    err, ctx = _roleplaying_ctx(require_write=True)
    if err:
        return err
    data = request.get_json() or {}
    cid, cerr = resolve_campanha_for_insert(ctx, data)
    if cerr:
        return cerr
    data = strip_campanha_from_body_for_player(data, ctx)
    data["campanha"] = cid
    try:
        rid = _create("equipamentos_NPC", data)
        logger.info("equipamentos_NPC | criado | id=%s personagem=%s", rid, data.get("personagem_dono"))
        return jsonify({"_id": rid}), 201
    except Exception as e:
        logger.exception("equipamentos_NPC | falha ao criar")
        return jsonify({"error": str(e)}), 400


@app.route("/api/equipamentos-npc/<id>", methods=["PUT"])
def update_equipamento_npc(id):
    err, ctx = _roleplaying_ctx(require_write=True)
    if err:
        return err
    doc = _get_by_id("equipamentos_NPC", id)
    if not doc:
        return jsonify({"error": "Não encontrado"}), 404
    if not assert_doc_in_campaign(doc, ctx):
        return jsonify({"error": "Não encontrado"}), 404
    data = strip_campanha_from_body_for_player(request.get_json() or {}, ctx)
    if _update("equipamentos_NPC", id, data):
        return jsonify({"ok": True})
    return jsonify({"error": "Não encontrado"}), 404


@app.route("/api/equipamentos-npc/<id>", methods=["DELETE"])
def delete_equipamento_npc(id):
    err, ctx = _roleplaying_ctx(require_write=True)
    if err:
        return err
    doc = _get_by_id("equipamentos_NPC", id)
    if not doc:
        return jsonify({"error": "Não encontrado"}), 404
    if not assert_doc_in_campaign(doc, ctx):
        return jsonify({"error": "Não encontrado"}), 404
    if _delete("equipamentos_NPC", id):
        return jsonify({"ok": True}), 204
    return jsonify({"error": "Não encontrado"}), 404


# ─── Elixir NPC ─────────────────────────────────────────────────────────────

@app.route("/api/elixir-npc", methods=["GET"])
def list_elixir_npc():
    err, ctx = _roleplaying_ctx(require_write=False)
    if err:
        return err
    q = {}
    dono = request.args.get("personagem_dono")
    if dono:
        q["personagem_dono"] = dono
    q = merge_campaign_filter(q, ctx)
    return jsonify(_list_collection("elixir_NPC", q if q else None, sort_key="nome"))


@app.route("/api/elixir-npc/<id>", methods=["GET"])
def get_elixir_npc(id):
    err, ctx = _roleplaying_ctx(require_write=False)
    if err:
        return err
    doc = _get_by_id("elixir_NPC", id)
    if not doc:
        return jsonify({"error": "Não encontrado"}), 404
    if not assert_doc_in_campaign(doc, ctx):
        return jsonify({"error": "Não encontrado"}), 404
    return jsonify(doc)


@app.route("/api/elixir-npc", methods=["POST"])
def create_elixir_npc():
    err, ctx = _roleplaying_ctx(require_write=True)
    if err:
        return err
    data = request.get_json() or {}
    cid, cerr = resolve_campanha_for_insert(ctx, data)
    if cerr:
        return cerr
    data = strip_campanha_from_body_for_player(data, ctx)
    data["campanha"] = cid
    try:
        rid = _create("elixir_NPC", data)
        return jsonify({"_id": rid}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 400


@app.route("/api/elixir-npc/<id>", methods=["PUT"])
def update_elixir_npc(id):
    err, ctx = _roleplaying_ctx(require_write=True)
    if err:
        return err
    doc = _get_by_id("elixir_NPC", id)
    if not doc:
        return jsonify({"error": "Não encontrado"}), 404
    if not assert_doc_in_campaign(doc, ctx):
        return jsonify({"error": "Não encontrado"}), 404
    data = strip_campanha_from_body_for_player(request.get_json() or {}, ctx)
    if _update("elixir_NPC", id, data):
        return jsonify({"ok": True})
    return jsonify({"error": "Não encontrado"}), 404


@app.route("/api/elixir-npc/<id>", methods=["DELETE"])
def delete_elixir_npc(id):
    err, ctx = _roleplaying_ctx(require_write=True)
    if err:
        return err
    doc = _get_by_id("elixir_NPC", id)
    if not doc:
        return jsonify({"error": "Não encontrado"}), 404
    if not assert_doc_in_campaign(doc, ctx):
        return jsonify({"error": "Não encontrado"}), 404
    if _delete("elixir_NPC", id):
        return jsonify({"ok": True}), 204
    return jsonify({"error": "Não encontrado"}), 404


# ─── Estabelecimentos ────────────────────────────────────────────────────────

@app.route("/api/estabelecimentos", methods=["GET"])
def list_estabelecimentos():
    err, ctx = _roleplaying_ctx(require_write=False)
    if err:
        return err
    q = {}
    if request.args.get("reino_nome"):
        q["reino_nome"] = request.args.get("reino_nome")
    if request.args.get("nivel") is not None and request.args.get("nivel") != "":
        try:
            q["nivel"] = int(request.args.get("nivel"))
        except (TypeError, ValueError):
            pass
    if request.args.get("tipo") is not None and request.args.get("tipo") != "":
        try:
            q["tipo"] = int(request.args.get("tipo"))
        except (TypeError, ValueError):
            pass
    q = merge_campaign_filter(q, ctx)
    return jsonify(_list_collection("estabelecimentos", q if q else None, sort_key="nome"))


@app.route("/api/estabelecimentos/<id>/noite", methods=["GET"])
def get_estabelecimento_noite(id):
    """Retorna o estabelecimento e as entidades (ladinos, animais, demônios) resolvidas por nome para a página Passar a Noite."""
    try:
        err, ctx = _roleplaying_ctx(require_write=False)
        if err:
            return err
        doc = _get_by_id("estabelecimentos", id)
        if not doc:
            return jsonify({"error": "Não encontrado"}), 404
        if not assert_doc_in_campaign(doc, ctx):
            return jsonify({"error": "Não encontrado"}), 404
        lista_ladinos = doc.get("lista_ladinos") or []
        lista_animais = doc.get("lista_animais") or []
        lista_demonios = doc.get("lista_demonios") or []
        camp = doc.get("campanha")
        db = get_db()
        ladinos = []
        if lista_ladinos:
            qn = {"nome": {"$in": list(lista_ladinos)}}
            if camp:
                qn["campanha"] = camp
            cursor = db["NPC"].find(qn)
            ladinos = [serialize(d) for d in cursor]
        animais = []
        if lista_animais:
            qa = {"nome": {"$in": list(lista_animais)}}
            if camp:
                qa["campanha"] = camp
            cursor = db["fera_NPC"].find(qa)
            animais = [serialize(d) for d in cursor]
        demonios = []
        if lista_demonios:
            qd = {"nome": {"$in": list(lista_demonios)}}
            if camp:
                qd["campanha"] = camp
            cursor = db["demon_NPC"].find(qd)
            demonios = [serialize(d) for d in cursor]
        return jsonify({
            "estabelecimento": doc,
            "ladinos": ladinos,
            "animais": animais,
            "demonios": demonios,
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/api/estabelecimentos/<id>", methods=["GET"])
def get_estabelecimento(id):
    try:
        err, ctx = _roleplaying_ctx(require_write=False)
        if err:
            return err
        doc = _get_by_id("estabelecimentos", id)
        if not doc:
            return jsonify({"error": "Não encontrado"}), 404
        if not assert_doc_in_campaign(doc, ctx):
            return jsonify({"error": "Não encontrado"}), 404
        return jsonify(doc)
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/api/estabelecimentos", methods=["POST"])
def create_estabelecimento():
    err, ctx = _roleplaying_ctx(require_write=True)
    if err:
        return err
    data = request.get_json() or {}
    cid, cerr = resolve_campanha_for_insert(ctx, data)
    if cerr:
        return cerr
    data = strip_campanha_from_body_for_player(data, ctx)
    data["campanha"] = cid
    try:
        rid = _create("estabelecimentos", data)
        return jsonify({"_id": rid}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 400


@app.route("/api/estabelecimentos/<id>", methods=["PUT"])
def update_estabelecimento(id):
    try:
        err, ctx = _roleplaying_ctx(require_write=True)
        if err:
            return err
        doc = _get_by_id("estabelecimentos", id)
        if not doc:
            return jsonify({"error": "Não encontrado"}), 404
        if not assert_doc_in_campaign(doc, ctx):
            return jsonify({"error": "Não encontrado"}), 404
        data = strip_campanha_from_body_for_player(request.get_json() or {}, ctx)
        if _update("estabelecimentos", id, data):
            return jsonify({"ok": True})
        return jsonify({"error": "Não encontrado"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/api/estabelecimentos/<id>", methods=["DELETE"])
def delete_estabelecimento(id):
    try:
        err, ctx = _roleplaying_ctx(require_write=True)
        if err:
            return err
        doc = _get_by_id("estabelecimentos", id)
        if not doc:
            return jsonify({"error": "Não encontrado"}), 404
        if not assert_doc_in_campaign(doc, ctx):
            return jsonify({"error": "Não encontrado"}), 404
        if _delete("estabelecimentos", id):
            return make_response("", 204)
        return jsonify({"error": "Não encontrado"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/api/estabelecimentos/gerar", methods=["POST"])
def gerar_estabelecimento_api():
    """Gera um estabelecimento (como cria_estabelecimento.py), cria NPC associado e salva."""
    import random
    err, ctx = _roleplaying_ctx(require_write=True)
    if err:
        return err
    data = request.get_json() or {}
    cid, cerr = resolve_campanha_for_insert(ctx, data)
    if cerr:
        return cerr
    try:
        nivel = int(data.get("nivel", 1))
        # Permitimos nível 0 apenas para acampamento; demais casos caem no padrão
        if nivel < 0 or nivel > 5:
            nivel = 1
    except (TypeError, ValueError):
        nivel = 1
    try:
        tipo = int(data.get("tipo", 0))
        if tipo < 0 or tipo > 5:
            tipo = 0
    except (TypeError, ValueError):
        tipo = 0
    reino_id = data.get("reino_id")
    if not reino_id:
        return jsonify({"error": "reino_id obrigatório"}), 400
    db = get_db()
    reino = _get_by_id("reinos", reino_id)
    if not reino:
        return jsonify({"error": "Reino não encontrado"}), 404
    logger.info(
        "gerar_estabelecimento | início | reino=%s nivel=%s tipo=%s | campanha=%s",
        reino.get("nome"),
        nivel,
        tipo,
        cid,
    )
    try:
        from service.storytelling.cria_estabelecimento import gerar_estabelecimento as gerar
        result = gerar(db, nivel, reino, tipo)
    except Exception as e:
        logger.exception("gerar_estabelecimento | falha em gerar()")
        return jsonify({"error": str(e)}), 500
    reino_nome = reino.get("nome", "")
    nome_estab = result.get("nome", "estabelecimento")

    # Para Hospedagem (3), Taverna (4) e Acampamento (5): criar pools de ladinos, animais e demônios e preencher listas
    if tipo in (3, 4, 5):
        reinos_info = []
        reino_info = None
        raca = "Vaelthor"
        if os.path.isfile(REINOS_INFO_PATH):
            try:
                with open(REINOS_INFO_PATH, "r", encoding="utf-8") as f:
                    reinos_info = json.load(f)
                reino_info = next((r for r in reinos_info if r.get("nome") == reino_nome), None)
                raca = reino_info.get("raça", "Vaelthor") if reino_info else "Vaelthor"
            except Exception:
                pass

        # Ladinos: quantidade 5–7 − nível (mín. 1); tipo Ladinos, classe Assassino, natureza Mal. Acampamento: nível do NPC = 1.
        if reinos_info and reino_info:
            from service.storytelling.custom.gerar_npc_custom import criar_npc_por_escolhas
            nivel_npc = 1 if tipo == 5 else nivel
            qtd_ladinos = max(random.randint(5, 7) - nivel, 1)
            for _ in range(qtd_ladinos):
                npc_doc = criar_npc_por_escolhas(
                    db, reinos_info, raca, reino_nome, "comum", "Ladinos", "Assassino", "Mal", nivel_npc,
                    campanha_id=cid,
                )
                if npc_doc and npc_doc.get("nome"):
                    result["lista_ladinos"].append(npc_doc["nome"])
                    obs = [f"Ladrão de {nome_estab}.", f"estabelecimento:true:{nome_estab}"]
                    _update("NPC", npc_doc.get("_id"), {"observacoes": obs})

        # Demônios: quantidade 1–4 − nível (mín. 1); tier 10% superior, 30% normal, 60% inferior
        from gerar_demon import gerar_demon_npc
        qtd_demonios = max(random.randint(1, 4) - nivel, 1)
        for _ in range(qtd_demonios):
            r = random.random()
            tier = "superior" if r < 0.1 else "normal" if r < 0.4 else "inferior"
            doc = gerar_demon_npc(tier, db, nome=None, elemento=None)
            doc["observacoes"] = [f"Demônio de {nome_estab}.", f"estabelecimento:true:{nome_estab}"]
            doc["campanha"] = cid
            _create("demon_NPC", doc)
            result["lista_demonios"].append(doc["nome"])

        # Animais: quantidade 4–6 − nível (mín. 1); nunca arcano; acampamento 70% comum/30% grande, senão 90%/10%; tipo Terrestre/Voador conforme regra
        from gerar_fera import gerar_fera_npc
        is_acamp = tipo == 5
        qtd_animais = max(random.randint(4, 6) - nivel, 1)
        for _ in range(qtd_animais):
            chance_pequeno = 0.7 if is_acamp else 0.9
            tier_fera = "comum" if random.random() < chance_pequeno else "grande"
            chance_terrestre = 0.6 if is_acamp else 0.3
            tipo_animal = "Terrestre" if random.random() < chance_terrestre else "Voador"
            doc = gerar_fera_npc(tier_fera, tipo_animal, db, nome=None)
            doc["observacoes"] = [f"Animal de {nome_estab}.", f"estabelecimento:true:{nome_estab}"]
            doc["campanha"] = cid
            _create("fera_NPC", doc)
            result["lista_animais"].append(doc["nome"])

    npc_nome = None
    npc_id = None
    # Estabelecimentos do tipo Acampamento (5) não possuem NPC associado
    if tipo != 5 and os.path.isfile(REINOS_INFO_PATH):
        try:
            with open(REINOS_INFO_PATH, "r", encoding="utf-8") as f:
                reinos_info = json.load(f)
            reino_info = next((r for r in reinos_info if r.get("nome") == reino_nome), None)
            if reino_info:
                raca = reino_info.get("raça", "Vaelthor")
                linhagem = "nobre" if nivel == 5 else "comum"
                tipo_npc = "Mercadores"
                classes = ["Arcanista", "Clérigo", "Assassino", "Paladino", "Shaman", "Druida", "Eremita", "Ocultista"]
                naturezas = ["Neutro", "Bom", "Mal"]
                classe = random.choice(classes)
                natureza = random.choice(naturezas)
                from service.storytelling.custom.gerar_npc_custom import criar_npc_por_escolhas
                npc_doc = criar_npc_por_escolhas(
                    db, reinos_info, raca, reino_nome, linhagem, tipo_npc, classe, natureza, nivel,
                    campanha_id=cid,
                )
                if npc_doc:
                    npc_nome = npc_doc.get("nome")
                    npc_id = npc_doc.get("_id")
        except Exception:
            pass
    result["npc_nome"] = npc_nome or ""
    result["npc_id"] = npc_id or ""
    result["campanha"] = cid
    result_serialized = serialize(result)
    try:
        rid = _create("estabelecimentos", result_serialized)
        result_serialized["_id"] = rid
    except Exception as e:
        logger.exception("gerar_estabelecimento | falha ao persistir")
        return jsonify({"error": str(e)}), 400
    logger.info("gerar_estabelecimento | ok | id=%s nome=%s", rid, result_serialized.get("nome"))
    return jsonify(result_serialized), 201


# ─── Imagens (tabela + identificador → imagem) ───────────────────────────────

@app.route("/api/imagens", methods=["GET"])
def list_imagens():
    tabela = request.args.get("tabela")
    identificador = request.args.get("identificador")
    q = {}
    if tabela:
        q["tabela"] = tabela
    if identificador:
        q["identificador"] = identificador
    return jsonify(_list_collection("imagens", q if q else None, sort_key="identificador"))


@app.route("/api/imagens/buscar", methods=["GET"])
def buscar_imagem():
    """Retorna um documento de imagem por tabela e identificador."""
    tabela = request.args.get("tabela")
    identificador = request.args.get("identificador")
    if not tabela or not identificador:
        return jsonify({"error": "tabela e identificador obrigatórios"}), 400
    db = get_db()
    doc = db["imagens"].find_one({"tabela": tabela, "identificador": identificador})
    return jsonify(serialize(doc)) if doc else jsonify(None)


@app.route("/api/imagens/<id>", methods=["GET"])
def get_imagem(id):
    doc = _get_by_id("imagens", id)
    if not doc:
        return jsonify({"error": "Não encontrado"}), 404
    return jsonify(doc)


@app.route("/api/imagens", methods=["POST"])
def create_imagem():
    data = request.get_json() or {}
    if not data.get("tabela") or not data.get("identificador"):
        return jsonify({"error": "tabela e identificador obrigatórios"}), 400
    try:
        rid = _create("imagens", data)
        return jsonify({"_id": rid}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 400


@app.route("/api/imagens/<id>", methods=["PUT"])
def update_imagem(id):
    data = request.get_json() or {}
    if _update("imagens", id, data):
        return jsonify({"ok": True})
    return jsonify({"error": "Não encontrado"}), 404


@app.route("/api/imagens/<id>", methods=["DELETE"])
def delete_imagem(id):
    if _delete("imagens", id):
        return jsonify({"ok": True}), 204
    return jsonify({"error": "Não encontrado"}), 404


@app.route("/api/imagens/upload", methods=["POST"])
def upload_imagem():
    """Recebe multipart: tabela, identificador e arquivo de imagem. Salva em pasta local e cria/atualiza documento em imagens."""
    tabela = (request.form.get("tabela") or "").strip()
    identificador = (request.form.get("identificador") or "").strip()
    if not tabela or not identificador:
        return jsonify({"error": "tabela e identificador obrigatórios"}), 400
    file = request.files.get("file")
    if not file or not file.filename:
        return jsonify({"error": "arquivo de imagem obrigatório"}), 400
    ext = os.path.splitext(file.filename)[1].lower() or ".png"
    if ext not in (".png", ".jpg", ".jpeg", ".gif", ".webp"):
        return jsonify({"error": "formato não permitido (use png, jpg, gif ou webp)"}), 400
    os.makedirs(UPLOADS_DIR, exist_ok=True)
    safe_name = f"{uuid.uuid4().hex}{ext}"
    filepath = os.path.join(UPLOADS_DIR, safe_name)
    try:
        file.save(filepath)
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    url = f"/api/uploads/{safe_name}"
    db = get_db()
    existing = db["imagens"].find_one({"tabela": tabela, "identificador": identificador})
    doc = {"tabela": tabela, "identificador": identificador, "url": url}
    if existing:
        db["imagens"].update_one({"_id": existing["_id"]}, {"$set": {"url": url}})
        return jsonify(serialize({**existing, **doc})), 200
    rid = _create("imagens", doc)
    return jsonify({"_id": str(rid), "url": url}), 201


@app.route("/api/uploads/<path:filename>", methods=["GET"])
def serve_upload(filename):
    """Serve arquivo enviado por upload (imagens de NPC, etc.)."""
    path = os.path.join(UPLOADS_DIR, filename)
    if not os.path.isfile(path) or not os.path.abspath(path).startswith(os.path.abspath(UPLOADS_DIR)):
        return jsonify({"error": "Não encontrado"}), 404
    return send_file(path, mimetype=None, as_attachment=False)


# ─── Health / info ──────────────────────────────────────────────────────────

@app.route("/api")
def api_info():
    return jsonify({
        "name": "RPG API",
        "version": "1.0",
        "endpoints": [
            "/api/armas", "/api/armaduras", "/api/alquimia", "/api/reinos",
            "/api/materiais", "/api/runas", "/api/npcs", "/api/npcs/<id>/completo",
            "/api/equipamentos-npc", "/api/elixir-npc",
            "/api/reinos/<id>/historia", "/api/imagens",
        ],
    })


if __name__ == "__main__":
    host = (os.environ.get("FLASK_HOST") or "0.0.0.0").strip()
    logger.info(
        "Servidor | bind=%s:%s | debug=%s | LOG_LEVEL=%s",
        host,
        settings.port,
        not settings.is_production,
        os.getenv("LOG_LEVEL") or "INFO",
    )
    try:
        from seed import run_seed_if_needed
        run_seed_if_needed()
    except Exception as e:
        logger.warning("Seed | não aplicado: %s", e)
    use_reloader = os.environ.get("RUN_IN_BACKGROUND", "").strip() != "1"
    app.run(host=host, port=settings.port, debug=not settings.is_production, use_reloader=use_reloader)
