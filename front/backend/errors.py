"""Respostas de erro padronizadas (API REST)."""
from typing import Optional

from flask import jsonify

_HTTP_CODES = {
    400: "BAD_REQUEST",
    401: "UNAUTHORIZED",
    403: "FORBIDDEN",
    404: "NOT_FOUND",
    409: "CONFLICT",
    422: "UNPROCESSABLE_ENTITY",
    500: "INTERNAL_ERROR",
}


def api_error(message: str, status: int = 400, code: Optional[str] = None):
    """Envelope de erro: { success, error: { message, code } }."""
    c = code or _HTTP_CODES.get(status, "ERROR")
    return jsonify({"success": False, "error": {"message": message, "code": c}}), status


def api_success(data=None, status: int = 200, extra: Optional[dict] = None):
    """Envelope de sucesso: { success, data? }."""
    body: dict = {"success": True}
    if data is not None:
        body["data"] = data
    if extra:
        body.update(extra)
    return jsonify(body), status
