"""Contexto de campanha (UUID) para NPCs, demônios, animais, equipamentos, elixires e estabelecimentos."""
import uuid
from flask import request, jsonify


def normalize_uuid(s):
    if s is None or s == "":
        return None
    try:
        return str(uuid.UUID(str(s).strip()))
    except (ValueError, TypeError):
        return None


def get_campaign_id_from_request():
    h = request.headers.get("X-Campanha-Id") or request.headers.get("X-Campanha-ID")
    if h:
        return normalize_uuid(h)
    q = request.args.get("campanha_id") or request.args.get("campanha")
    if q:
        return normalize_uuid(q)
    return None


def user_campaign_entries(user_doc):
    return user_doc.get("campanhas") or []


def user_has_campaign(user_doc, campanha_id):
    if not campanha_id:
        return False
    for c in user_campaign_entries(user_doc):
        cid = c.get("campanha_id")
        if cid and normalize_uuid(str(cid)) == campanha_id:
            return True
    return False


def user_can_write_campaign(user_doc, campanha_id):
    if user_doc.get("perfil") == "admin":
        return True
    if not campanha_id:
        return False
    for c in user_campaign_entries(user_doc):
        cid = c.get("campanha_id")
        if cid and normalize_uuid(str(cid)) == campanha_id:
            fn = (c.get("function") or "").strip().lower()
            if fn in ("mestre", "admin"):
                return True
            break
    return False


def pode_editar_roleplaying_response(user_doc, campanha_id):
    """Usado em GET /api/auth/me (com cabeçalho opcional)."""
    if user_doc.get("perfil") == "admin":
        return True
    if not campanha_id:
        return False
    return user_can_write_campaign(user_doc, campanha_id)


def require_roleplaying_context(decode_token_fn, get_db_fn, require_write=False):
    """
    Retorna (resposta_de_erro_ou_None, ctx_ou_None).
    resposta_de_erro é tupla (jsonify(...), status) para retornar na rota.
    """
    payload = decode_token_fn()
    if not payload:
        return (jsonify({"error": "Não autenticado"}), 401), None
    db = get_db_fn()
    user_doc = db["usuarios"].find_one({"usuario": payload["usuario"]})
    if not user_doc:
        return (jsonify({"error": "Não autenticado"}), 401), None

    is_global_admin = user_doc.get("perfil") == "admin"
    cid = get_campaign_id_from_request()

    if is_global_admin:
        ctx = {
            "user_doc": user_doc,
            "payload": payload,
            "is_global_admin": True,
            "campanha_id": cid,
            "filter_campanha": cid if cid else None,
            "can_write": True,
        }
        return None, ctx

    if not cid:
        return (jsonify({"error": "Informe a campanha (cabeçalho X-Campanha-Id)."}), 400), None
    if not user_has_campaign(user_doc, cid):
        return (jsonify({"error": "Você não participa desta campanha."}), 403), None

    can_write = user_can_write_campaign(user_doc, cid)
    if require_write and not can_write:
        return (jsonify({"error": "Sem permissão para alterar dados nesta campanha."}), 403), None

    ctx = {
        "user_doc": user_doc,
        "payload": payload,
        "is_global_admin": False,
        "campanha_id": cid,
        "filter_campanha": cid,
        "can_write": can_write,
    }
    return None, ctx


def merge_campaign_filter(q, ctx):
    fc = ctx.get("filter_campanha")
    if fc:
        q = dict(q)
        q["campanha"] = fc
    return q


def assert_doc_in_campaign(doc, ctx):
    if ctx.get("is_global_admin"):
        return True
    if not doc:
        return False
    cid = ctx.get("campanha_id")
    doc_c = doc.get("campanha")
    if doc_c is None:
        return False
    return normalize_uuid(str(doc_c)) == cid


def resolve_campanha_for_insert(ctx, data):
    """
    Retorna (campanha_uuid_str_ou_None, erro_resposta_ou_None).
    Admin deve informar campanha no JSON ou no cabeçalho.
    """
    if ctx["is_global_admin"]:
        raw = (data or {}).get("campanha") or get_campaign_id_from_request()
        nu = normalize_uuid(raw) if raw else None
        if not nu:
            return None, (jsonify({"error": "Informe campanha no corpo (campanha) ou cabeçalho X-Campanha-Id."}), 400)
        return nu, None
    return ctx["campanha_id"], None


def strip_campanha_from_body_for_player(data, ctx):
    """Impede que jogador altere o vínculo de campanha via JSON."""
    if ctx.get("is_global_admin"):
        return data
    out = dict(data or {})
    out.pop("campanha", None)
    return out
