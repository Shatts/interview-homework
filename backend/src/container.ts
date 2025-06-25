import 'reflect-metadata';
import { EntityManager } from '@mikro-orm/core';
import { Container } from 'inversify';

import { orm } from './orm.js';
import { ProductRepository } from './repositories/product-repository.js';
import { ProductService } from './services/product-service.js';
import { TYPES } from './types/container-dependencies.js';

export const container = new Container();

container
  .bind<EntityManager>(EntityManager)
  .toDynamicValue(() => {
    if (orm) {
      return orm.em.fork();
    } else {
      throw new Error('ORM not initialized');
    }
  })
  .inRequestScope();
container
  .bind<ProductService>(TYPES.ProductService)
  .to(ProductService)
  .inSingletonScope();
container
  .bind<ProductRepository>(TYPES.ProductRepository)
  .to(ProductRepository)
  .inSingletonScope();

