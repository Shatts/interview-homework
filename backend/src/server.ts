import 'reflect-metadata';
import morgan from 'morgan';
import { errorHandler } from './middleware/errorHandler.js';
import express from 'express';
import { InversifyExpressServer } from 'inversify-express-utils';
import { RequestContext } from '@mikro-orm/core';
import { initORM, orm } from './orm.js';
import { container } from './container.js';
import cors from 'cors';
// Import all controllers to ensure they are registered
import './controllers/ProductController.js';

const PORT = process.env.PORT ?? '3000';

(async () => {
  try {
    await initORM();

    const server = new InversifyExpressServer(container);
    server.setConfig((app) => {
      app.use((req, res, next) => {
        RequestContext.create(orm.em, next);
      });
      app.use(morgan('dev'));
      app.use(express.json());
      app.use(errorHandler);
      app.use(
        cors({
          origin: 'http://localhost:4200',
        }),
      );
    });

    const app = server.build();
    await new Promise<void>((resolve) => {
      app.listen(PORT, () => {
        // Server started successfully
        resolve();
      });
    });
  } catch {
    process.exit(1);
  }
})();

process.on('unhandledRejection', (reason) => {
  // Log unhandled rejections in production environment
  if (process.env.NODE_ENV === 'production') {
    // In production, you might want to send this to a logging service
    process.stderr.write(`Unhandled Rejection: ${String(reason)}\n`);
  }
  process.exit(1);
});
