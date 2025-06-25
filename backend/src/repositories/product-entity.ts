import { Entity, PrimaryKey, Property } from '@mikro-orm/core';

@Entity()
export class Product {
  @Property({ type: 'string' })
  description!: string;

  @PrimaryKey({ name: 'id', type: 'integer' })
  id!: number;

  @Property({ nullable: true, type: 'string' })
  imageUrl?: string;

  @Property({ type: 'string' })
  name!: string;

  @Property({ type: 'integer' })
  quantity!: number;

  @Property({ type: 'integer' })
  unitPrice!: number;
}
