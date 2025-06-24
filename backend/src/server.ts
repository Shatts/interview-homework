import 'reflect-metadata';
import morgan from 'morgan';
import { errorHandler } from '#middleware/errorHandler.js';
import express from 'express';
import { InversifyExpressServer } from 'inversify-express-utils';
import { RequestContext } from '@mikro-orm/core';
import { initORM, orm } from './orm.js';
import { container } from './container.js';
// Import all controllers to ensure they are registered
import './controllers/ProductController.js';

const PORT = process.env.PORT ?? '3000';

(async () => {
  await initORM();

  const server = new InversifyExpressServer(container);
  server.setConfig((app) => {
    app.use((req, res, next) => { RequestContext.create(orm.em, next); });
    app.use(morgan('dev'));
    app.use(express.json());
    app.use(errorHandler);
  });

  const app = server.build();
  app.listen(PORT, () => {
    console.log(`Warehouse API server running on port ${PORT}`);
  });
})();

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});
