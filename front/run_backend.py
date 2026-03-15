#!/usr/bin/env python3
"""
Sobe o backend da API (Flask) do front.
Execute a partir da raiz do projeto ou de front/ com PYTHONPATH incluindo front/backend.
"""
import sys
import os

# Garantir que front/backend esteja no path
_front_dir = os.path.dirname(os.path.abspath(__file__))
_backend_dir = os.path.join(_front_dir, "backend")
if _backend_dir not in sys.path:
    sys.path.insert(0, _backend_dir)
os.chdir(_backend_dir)

from app import app

if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5000, debug=True)
