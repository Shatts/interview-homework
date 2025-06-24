import 'reflect-metadata';
import { TYPES } from '#types/ContainerDependencies.js';
import { Container } from 'inversify';
import { EntityManager } from '@mikro-orm/core';
import { orm } from './orm.js';
import { ProductService } from './services/ProductService.js';
import { ProductRepository } from './repositories/ProductRepository.js';

const container = new Container();

container
  .bind<EntityManager>(EntityManager)
  .toDynamicValue(() => orm.em.fork())
  .inRequestScope();
container
  .bind<ProductService>(TYPES.ProductService)
  .to(ProductService)
  .inSingletonScope();
container
  .bind<ProductRepository>(TYPES.ProductRepository)
  .to(ProductRepository)
  .inSingletonScope();

export { container, TYPES };
