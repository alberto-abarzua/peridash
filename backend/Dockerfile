# ./backend/Dockerfile
FROM python:3.11.3-slim-bullseye

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

WORKDIR /app

RUN python -m pip install pdm==2.5.5

COPY pyproject.toml /app/.
COPY pdm.lock /app/.
COPY .flake8 /app/.

RUN pdm install -v

COPY . .
