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

import { TYPES } from '../container.js';
import {
  zodValidateBody,
  zodValidateParams,
} from '../middleware/zodValidate.js';
import { ProductService } from '../services/ProductService.js';
import { TypedRequestBody, TypedResponse } from '../types/Express.js';
import {
  IdParamSchema,
  Product,
  ProductCreateInput,
  ProductCreateSchema,
  ProductUpdateInput,
  ProductUpdateSchema,
} from '../types/Product.js';

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
    //if (!success) return res.status(404).json({ message: 'Product not found' });
    res.status(204).json({ message: 'Deleted' });
  }

  @httpGet('/')
  async getAll(@response() res: TypedResponse<Product[]>): Promise<void> {
    const products = await new Promise((resolve) => {
      setTimeout(() => {
        resolve(this.productService.getAll());
      }, 2000)
    });
    res.json(products);
  }

  @httpGet('/:id', zodValidateParams(IdParamSchema))
  async getById(
    @requestParam('id') id: number,
    @response() res: TypedResponse<Product>,
  ): Promise<void> {
    const product = await this.productService.getById(id);
    if (!product) {
      res.status(404).json({ message: 'Product not found' });
    } else {
      res.json(product);
    }
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
    if (!updated) {
      res.status(404).json({ message: 'Product not found' });
    } else {
      res.json(updated);
    }
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
    if (!product) {
       res.status(404).json({ message: 'Product not found' });
    } else {
      res.json(product);
    }
  }
}
