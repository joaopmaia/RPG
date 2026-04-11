"""
Logging centralizado: saída em stdout, formato legível, nível via LOG_LEVEL (default INFO).
"""
from __future__ import annotations

import logging
import os
import sys
from typing import Optional

_LOG: Optional[logging.Logger] = None


def setup_logging(name: str = "rpg.api") -> logging.Logger:
    global _LOG
    if _LOG is not None:
        return _LOG

    level_name = (os.getenv("LOG_LEVEL") or "INFO").upper()
    level = getattr(logging, level_name, logging.INFO)

    fmt = "%(asctime)s | %(levelname)-8s | %(name)s | %(message)s"
    datefmt = "%Y-%m-%d %H:%M:%S"
    formatter = logging.Formatter(fmt, datefmt)
    # stderr: Docker e `docker compose logs` mostram bem; evita misturar só com access log do Werkzeug no stdout.
    err_handler = logging.StreamHandler(sys.stderr)
    err_handler.setFormatter(formatter)

    root = logging.getLogger()
    root.handlers.clear()
    root.addHandler(err_handler)
    root.setLevel(level)

    # Silencia o access log padrão do servidor de desenvolvimento (linha "POST ... 500");
    # o tráfego útil fica em rpg.api (before/after_request) e nos loggers de rota.
    for _name in ("werkzeug", "werkzeug.serving", "werkzeug._internal"):
        wl = logging.getLogger(_name)
        wl.setLevel(logging.WARNING)
        wl.propagate = True
    logging.getLogger("pymongo").setLevel(logging.WARNING)
    logging.getLogger("pymongo.topology").setLevel(logging.WARNING)

    _LOG = logging.getLogger(name)
    _LOG.setLevel(level)
    return _LOG


def get_logger(name: str = "rpg.api") -> logging.Logger:
    return logging.getLogger(name)
