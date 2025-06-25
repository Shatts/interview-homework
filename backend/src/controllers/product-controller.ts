import { inject } from 'inversify';
import {
  controller,
  httpDelete,
  httpGet,
  httpPatch,
  httpPost,
  httpPut,
  request,
  requestParam,
  response,
} from 'inversify-express-utils';

import {
  zodValidateBody,
  zodValidateParams,
} from '../middlewares/zod-validator.js';
import { ProductService } from '../services/product-service.js';
import { TypedRequestBody, TypedResponse } from '../types/express-type.js';
import {
  IdParamSchema,
  Product,
  ProductCreateInput,
  ProductCreateSchema,
  ProductUpdateInput,
  ProductUpdateSchema,
} from '../types/product-type.js';
import { TYPES } from '../types/container-dependencies.js';

@controller('/products')
export class ProductController {
  constructor(
    @inject(TYPES.ProductService) private productService: ProductService,
  ) {}

  @httpPost('/', zodValidateBody(ProductCreateSchema))
  async create(
    @request() req: TypedRequestBody<ProductCreateInput>,
    @response() res: TypedResponse<Product>,
  ): Promise<void> {
    const product = await this.productService.create(req.body);
    res.status(201).json(product);
  }

  @httpDelete('/:id', zodValidateParams(IdParamSchema))
  async delete(
    @requestParam('id') id: number,
    @response() res: TypedResponse<{ message: string }>,
  ): Promise<void> {
    await this.productService.delete(id);
    res.status(204).json({ message: 'Deleted' });
  }

  @httpGet('/')
  async getAll(@response() res: TypedResponse<Product[]>): Promise<void> {
    const products = await this.productService.getAll();
    console.log(products, 'products');
    res.json(products);
  }

  @httpGet('/:id', zodValidateParams(IdParamSchema))
  async getById(
    @requestParam('id') id: number,
    @response() res: TypedResponse<Product>,
  ): Promise<void> {
    const product = await this.productService.getById(id);
    res.json(product);
  }

  @httpPatch(
    '/:id',
    zodValidateParams(IdParamSchema),
    zodValidateBody(ProductUpdateSchema),
  )
  async patch(
    @requestParam('id') id: number,
    @request() req: TypedRequestBody<ProductUpdateInput>,
    @response() res: TypedResponse<Product>,
  ): Promise<void> {
    const updated = await this.productService.update(id, req.body);
    res.json(updated);
  }

  @httpPut(
    '/:id',
    zodValidateParams(IdParamSchema),
    zodValidateBody(ProductUpdateSchema),
  )
  async update(
    @requestParam('id') id: number,
    @request() req: TypedRequestBody<ProductUpdateInput>,
    @response() res: TypedResponse<Product>,
  ): Promise<void> {
    const product = await this.productService.update(id, req.body);
    res.json(product);
  }
}
