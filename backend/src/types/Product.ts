export interface Product {
  id: number;
  name: string;
  quantity: number;
  unitPrice: number;
}

import { z } from 'zod';

export const ProductCreateSchema = z
  .object({
    description: z.string().max(200),
    imageUrl: z.string().url().optional(),
    name: z.string().min(1),
    quantity: z.number().int().min(1),
    unitPrice: z.number().min(1),
  })
  .strict();

export type ProductCreateInput = z.infer<typeof ProductCreateSchema>;

export const IdParamSchema = z.object({
  id: z
    .string()
    .regex(/^\d+$/)
    .transform(Number)
    .refine((val) => val > 0, { message: 'id must be a positive integer' }),
});

export type IdParamInput = z.infer<typeof IdParamSchema>;

export const ProductUpdateSchema = z
  .object({
    description: z.string().max(200).optional(),
    imageUrl: z.string().url().optional(),
    name: z.string().min(1).optional(),
    quantity: z.number().int().min(1).optional(),
    unitPrice: z.number().min(1).optional(),
  })
  .strict();

export type ProductUpdateInput = z.infer<typeof ProductUpdateSchema>;
