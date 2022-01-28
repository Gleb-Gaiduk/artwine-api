import { Test, TestingModule } from '@nestjs/testing';
import { OrderProductResolver } from './order-product.resolver';
import { OrderProductService } from './order-product.service';

describe('OrderProductResolver', () => {
  let resolver: OrderProductResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OrderProductResolver, OrderProductService],
    }).compile();

    resolver = module.get<OrderProductResolver>(OrderProductResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
