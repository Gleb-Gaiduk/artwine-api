import { Test, TestingModule } from '@nestjs/testing';
import { OrderStatusResolver } from './order-status.resolver';
import { OrderStatusService } from './order-status.service';

describe('OrderStatusResolver', () => {
  let resolver: OrderStatusResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OrderStatusResolver, OrderStatusService],
    }).compile();

    resolver = module.get<OrderStatusResolver>(OrderStatusResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
