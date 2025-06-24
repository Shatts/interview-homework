DB_NAME ?= mydatabase
DB_USER ?= myuser
DB_PASSWORD ?= mypassword

.PHONY: help up down build logs

help:
	@echo "Available targets:"
	@echo "  up     - Start all services with docker-compose up -d"
	@echo "  down   - Stop all services with docker-compose down"
	@echo "  build  - Build all services with docker-compose build"
	@echo "  logs   - Show logs with docker-compose logs -f"
	@echo ""
	@echo "Environment variables:"
	@echo "  DB_NAME, DB_USER, DB_PASSWORD (can be set in .env or overridden here)"

up:
	DB_NAME=$(DB_NAME) DB_USER=$(DB_USER) DB_PASSWORD=$(DB_PASSWORD) docker-compose up -d

down:
	DB_NAME=$(DB_NAME) DB_USER=$(DB_USER) DB_PASSWORD=$(DB_PASSWORD) docker-compose down -v

build:
	DB_NAME=$(DB_NAME) DB_USER=$(DB_USER) DB_PASSWORD=$(DB_PASSWORD) docker-compose build

logs:
	DB_NAME=$(DB_NAME) DB_USER=$(DB_USER) DB_PASSWORD=$(DB_PASSWORD) docker-compose logs -f 