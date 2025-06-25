DB_NAME ?= mydatabase
DB_USER ?= myuser
DB_PASSWORD ?= mypassword
DB_ROOT_PASSWORD ?= rootpass

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
	cp backend/.env.example backend/.env
	docker compose up -d
	@echo "Starting frontend development server..."
	cd frontend && ng serve --host 0.0.0.0 --port 4200

down:
	docker compose down --rmi all --volumes --remove-orphans

build:
	docker-compose build

logs:
	docker-compose logs -f

frontend:
	@echo "Starting frontend development server..."
	cd frontend && ng serve --host 0.0.0.0 --port 4200 
