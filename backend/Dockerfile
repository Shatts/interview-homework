# Stage 1: Install dependencies and build
FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Stage 2: Production image
FROM node:20-alpine AS prod

WORKDIR /app

COPY package*.json ./
RUN npm install --production

# Only copy the built output and necessary files
COPY --from=build /app/dist ./dist
COPY --from=build /app/.env ./
# (copy any other needed files, e.g., migrations, public, etc.)

EXPOSE 3000

CMD ["node", "dist/server.js"]