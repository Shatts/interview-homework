import { Entity, PrimaryKey, Property } from '@mikro-orm/core';

@Entity()
export class Product {
  @PrimaryKey({ name: 'id', type: 'integer' })
  id!: number;

  @Property({ type: 'string' })
  name!: string;

  @Property({ type: 'string' })
  description: string;

  @Property({ nullable: true, type: 'string' })
  imageUrl?: string;

  @Property({ type: 'integer' })
  quantity!: number;

  @Property({ type: 'integer' })
  unitPrice!: number;
}
