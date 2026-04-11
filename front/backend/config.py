"""
Configuração centralizada (variáveis de ambiente / .env).
Use: from config import settings
"""
from __future__ import annotations

import os
from pathlib import Path

from dotenv import load_dotenv

_backend_dir = Path(__file__).resolve().parent
_repo_root = _backend_dir.parent.parent
# Preferência: .env na raiz do repositório (um único arquivo para Docker e Flask local).
load_dotenv(_backend_dir / ".env")
load_dotenv(_repo_root / ".env", override=True)


def _split_origins(s: str) -> list[str]:
    return [x.strip() for x in (s or "").split(",") if x.strip()]


class Settings:
    """Carrega uma vez no import; valores vêm do ambiente."""

    def __init__(self) -> None:
        self.flask_env = (os.getenv("FLASK_ENV") or os.getenv("ENV") or "development").strip().lower()
        self.is_production = self.flask_env == "production"

        # JWT assina com o mesmo segredo (JWT_SECRET_KEY tem prioridade sobre legado FLASK_SECRET_KEY)
        self.jwt_secret_key = (
            (os.getenv("JWT_SECRET_KEY") or os.getenv("FLASK_SECRET_KEY") or "").strip()
            or "change-me-in-development-only"
        )

        self.mongo_uri = (os.getenv("MONGO_URI") or "mongodb://localhost:27017").strip()
        self.rpg_database = (os.getenv("RPG_DATABASE") or "rpg").strip()

        # PORT (PaaS) ou FLASK_PORT (legado)
        self.port = int(os.getenv("PORT") or os.getenv("FLASK_PORT") or "5000")

        raw_cors = (os.getenv("CORS_ALLOWED_ORIGINS") or os.getenv("CORS_ORIGINS") or "").strip()
        if not raw_cors and not self.is_production:
            raw_cors = (
                "http://localhost:5173,http://127.0.0.1:5173,"
                "http://localhost:3000,http://127.0.0.1:3000"
            )
        self.cors_origins = _split_origins(raw_cors)
        if self.is_production and not self.cors_origins:
            raise ValueError(
                "CORS_ALLOWED_ORIGINS (ou CORS_ORIGINS) é obrigatório em produção (lista separada por vírgulas)."
            )


settings = Settings()
