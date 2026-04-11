# syntax=docker/dockerfile:1
# Dev server (Vite) com hot reload; em compose use volume para o código fonte.
# Contexto de build: raiz do repositório.
FROM node:20-alpine
WORKDIR /app
COPY front/frontend/package.json front/frontend/package-lock.json ./
RUN npm ci
COPY front/frontend .
EXPOSE 5173
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "5173"]
