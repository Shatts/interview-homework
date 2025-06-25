# Interview Homework

Congratulations on making it through our awesome Talent Acquisition Team! You seem like a great candidate to join our team. Before the next round of interviews, we’d like to see some of your coding skills in action.

## Backend

The `backend/` folder contains the generated structure of an Express application, along with instructions for the functional requirements inside its [README](./backend/README.md). Please showcase your skills by developing a REST API for a Warehouse application.

## Frontend

The `frontend/` folder contains the generated structure of an Angular application, along with instructions for the functional requirements inside its [README](./frontend/README.md). Please showcase your skills by developing a client-facing application for the Warehouse.

## Fullstack

If you applied for a fullstack position, complete the assessment tasks for listing, adding, editing, and removing products in both the backend and frontend.

In the end, we should be able to test the implemented functionality of the backend through the frontend. This means you should start both the backend and frontend locally and use the Warehouse application to ensure everything works seamlessly.

## Criteria

To be clear about what we’re looking for, , by sharing criterias, we are trying to help you prioritize your focus on what matters most for us.

We will evaluate your work based on the following criteria:

- **Code design and architecture** - Is the architecture of application clear? Does it use patterns that helps with maintainability and scalability?
- **Code quality**: Is the code clean, well-structured, and easy to understand?
- **Functionality**: Does the application work as expected?
- **Performance**: Does the application run effiecently?
- **Testing**: Are there unit and integration tests? Do they test the functionality?
- **Documentation**: Are we able to run project following instructions in README? Is the code documented?

If time prioritization is necessary, criteria should not be sacrificed; rather, completeness should be.

Good luck, and we look forward to seeing your work!

## Quick Start

### What Was Done

#### Backend
- **Language & Tooling**
    - Migrated codebase to **TypeScript**
    - Set up **ESLint** for linting and **Prettier** for code formatting
- **Containers & Orchestration**
    - Added a `Dockerfile` for the backend service
    - Added **TypeORM** and a PostgreSQL database in `docker-compose.yml`
- **Testing**
    - Configured **Vitest** for unit and integration tests
- **Architecture & Quality**
    - Introduced **Inversify** for dependency injection
    - Used **class-validator** decorators for request/response validation

#### Frontend
- **Framework Upgrade**
    - Upgraded to **Angular 20**
    - Removed all deprecated APIs and patterns
- **Best Practices**
    - Refactored code to use the latest Angular syntax and style guide recommendations
    - Improved folder/module structure for clarity

#### Orchestration
- **Makefile**
    - Single-entry point to build, start, and test both backend and frontend
---

### Prerequisites

- **Docker & Docker Compose** - For running the full stack
- **Make** - For simplified command execution
- **Angular CLI** - For frontend development (if not already installed)

### Installation & Setup

1. **Start the full stack**

   ```bash
   make up
   ```

2. **Access the applications**
   - **Frontend**: http://localhost:4200
   - **Backend API**: http://localhost:3000
   - **Database**: MariaDB (configured via Docker)

### Available Commands

| Command      | Description                                      |
| ------------ | ------------------------------------------------ |
| `make up`    | Start all services (backend, frontend, database) |
| `make down`  | Stop all services and remove containers          |
| `make build` | Build all Docker images                          |
| `make logs`  | View service logs                                |
| `make help`  | Show available commands                          |

## 🏗️ Architecture

### Backend (Express.js + TypeScript)

- **Framework**: Express.js with TypeScript
- **Database**: MariaDB with MikroORM
- **Validation**: Zod schema validation
- **Testing**: Vitest for unit and integration tests
- **Dependency Injection**: InversifyJS

### Frontend (Angular)

- **Framework**: Angular 20 with TypeScript
- **UI Library**: Angular Material
- **State Management**: Reactive forms and services
- **Testing**: Jasmine/Karma for unit tests
- **Styling**: SCSS with Material Design

## 🔧 Development

### API Endpoints

| Method   | Endpoint            | Description              |
| -------- | ------------------- | ------------------------ |
| `GET`    | `/api/products`     | Get all products         |
| `GET`    | `/api/products/:id` | Get product by ID        |
| `POST`   | `/api/products`     | Create new product       |
| `PUT`    | `/api/products/:id` | Update product           |
| `PATCH`  | `/api/products/:id` | Partially update product |
| `DELETE` | `/api/products/:id` | Delete product           |
