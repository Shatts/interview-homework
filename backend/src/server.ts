import 'reflect-metadata';
import { errorHandler } from '#middlewares/error-handler.js';
import { RequestContext } from '@mikro-orm/core';
import express from 'express';
import { InversifyExpressServer } from 'inversify-express-utils';
import morgan from 'morgan';

import { container } from './container.js';
import { initORM } from './orm.js';
import './controllers/product-controller.js';

const PORT = process.env.PORT ?? '3000';

async function startServer(): Promise<void> {
  try {
    const orm = await initORM();

    const server = new InversifyExpressServer(container);

    server.setConfig((app) => {
      app.use((req, res, next) => {
        RequestContext.create(orm.em, next);
      });
      app.use(morgan('dev'));
      app.use(express.json());
    });

    server.setErrorConfig((app) => {
      app.use(errorHandler);
    });

    const app = server.build();

    app.listen(PORT, () => {
      console.log(`Warehouse API server is running on port ${PORT}`);
    });
  } catch (error: unknown) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer().catch((err: unknown) => {
  console.error('Error starting server:', err);
});

process.once('unhandledRejection', (reason: unknown) => {
  console.error('Unhandled Rejection:', reason);
  process.exit(1);
});

process.once('uncaughtException', (err: unknown) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});
