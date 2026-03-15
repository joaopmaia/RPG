"""
API REST local para o projeto RPG.
Expõe CRUD para: armas, armaduras, alquimia, reinos, materiais, runas, NPC, equipamentos_NPC, elixir_NPC.
"""
import json
import re
from bson import ObjectId
from flask import Flask, request, jsonify
from flask_cors import CORS

from db import get_db

app = Flask(__name__)
CORS(app, origins=["http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:3000", "http://127.0.0.1:3000"])


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
        result = col.update_one({"_id": ObjectId(id_str)}, {"$set": data})
        return result.modified_count > 0
    except Exception:
        return False


def _delete(collection_name, id_str):
    db = get_db()
    col = db[collection_name]
    try:
        result = col.delete_one({"_id": ObjectId(id_str)})
        return result.deleted_count > 0
    except Exception:
        return False


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


# ─── Armas ──────────────────────────────────────────────────────────────────

@app.route("/api/armas", methods=["GET"])
def list_armas():
    q = _build_query(["nome", "tipo"], {"tipo": request.args.get("tipo")})
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
    q = _build_query(["nome", "tipo"], {"tipo": request.args.get("tipo")})
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


# ─── Alquimia ────────────────────────────────────────────────────────────────

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
    elem = request.args.get("elemento")
    if elem:
        q["elementos"] = elem
    return jsonify(_list_collection("runas", q))


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


# ─── NPC ────────────────────────────────────────────────────────────────────

@app.route("/api/npcs", methods=["GET"])
def list_npcs():
    q = _build_query(["nome", "tipo", "raça", "natureza"], {
        "raça": request.args.get("raça"),
        "natureza": request.args.get("natureza"),
    })
    return jsonify(_list_collection("NPC", q))


@app.route("/api/npcs/<id>", methods=["GET"])
def get_npc(id):
    doc = _get_by_id("NPC", id)
    if not doc:
        return jsonify({"error": "Não encontrado"}), 404
    return jsonify(doc)


@app.route("/api/npcs", methods=["POST"])
def create_npc():
    data = request.get_json() or {}
    try:
        rid = _create("NPC", data)
        return jsonify({"_id": rid}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 400


@app.route("/api/npcs/<id>", methods=["PUT"])
def update_npc(id):
    data = request.get_json() or {}
    if _update("NPC", id, data):
        return jsonify({"ok": True})
    return jsonify({"error": "Não encontrado"}), 404


@app.route("/api/npcs/<id>", methods=["DELETE"])
def delete_npc(id):
    if _delete("NPC", id):
        return jsonify({"ok": True}), 204
    return jsonify({"error": "Não encontrado"}), 404


# ─── Equipamentos NPC ───────────────────────────────────────────────────────

@app.route("/api/equipamentos-npc", methods=["GET"])
def list_equipamentos_npc():
    q = {}
    dono = request.args.get("personagem_dono")
    if dono:
        q["personagem_dono"] = dono
    tipo = request.args.get("tipo")
    if tipo:
        q["tipo"] = tipo
    return jsonify(_list_collection("equipamentos_NPC", q if q else None, sort_key="nome"))


@app.route("/api/equipamentos-npc/<id>", methods=["GET"])
def get_equipamento_npc(id):
    doc = _get_by_id("equipamentos_NPC", id)
    if not doc:
        return jsonify({"error": "Não encontrado"}), 404
    return jsonify(doc)


@app.route("/api/equipamentos-npc", methods=["POST"])
def create_equipamento_npc():
    data = request.get_json() or {}
    try:
        rid = _create("equipamentos_NPC", data)
        return jsonify({"_id": rid}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 400


@app.route("/api/equipamentos-npc/<id>", methods=["PUT"])
def update_equipamento_npc(id):
    data = request.get_json() or {}
    if _update("equipamentos_NPC", id, data):
        return jsonify({"ok": True})
    return jsonify({"error": "Não encontrado"}), 404


@app.route("/api/equipamentos-npc/<id>", methods=["DELETE"])
def delete_equipamento_npc(id):
    if _delete("equipamentos_NPC", id):
        return jsonify({"ok": True}), 204
    return jsonify({"error": "Não encontrado"}), 404


# ─── Elixir NPC ─────────────────────────────────────────────────────────────

@app.route("/api/elixir-npc", methods=["GET"])
def list_elixir_npc():
    q = {}
    dono = request.args.get("personagem_dono")
    if dono:
        q["personagem_dono"] = dono
    return jsonify(_list_collection("elixir_NPC", q if q else None, sort_key="nome"))


@app.route("/api/elixir-npc/<id>", methods=["GET"])
def get_elixir_npc(id):
    doc = _get_by_id("elixir_NPC", id)
    if not doc:
        return jsonify({"error": "Não encontrado"}), 404
    return jsonify(doc)


@app.route("/api/elixir-npc", methods=["POST"])
def create_elixir_npc():
    data = request.get_json() or {}
    try:
        rid = _create("elixir_NPC", data)
        return jsonify({"_id": rid}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 400


@app.route("/api/elixir-npc/<id>", methods=["PUT"])
def update_elixir_npc(id):
    data = request.get_json() or {}
    if _update("elixir_NPC", id, data):
        return jsonify({"ok": True})
    return jsonify({"error": "Não encontrado"}), 404


@app.route("/api/elixir-npc/<id>", methods=["DELETE"])
def delete_elixir_npc(id):
    if _delete("elixir_NPC", id):
        return jsonify({"ok": True}), 204
    return jsonify({"error": "Não encontrado"}), 404


# ─── Health / info ──────────────────────────────────────────────────────────

@app.route("/api")
def api_info():
    return jsonify({
        "name": "RPG API",
        "version": "1.0",
        "endpoints": [
            "/api/armas", "/api/armaduras", "/api/alquimia", "/api/reinos",
            "/api/materiais", "/api/runas", "/api/npcs",
            "/api/equipamentos-npc", "/api/elixir-npc",
        ],
    })


if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5000, debug=True)
