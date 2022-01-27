import { Test, TestingModule } from '@nestjs/testing';
import { DeliveryResolver } from './delivery.resolver';
import { DeliveryService } from './delivery.service';

describe('DeliveryResolver', () => {
  let resolver: DeliveryResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DeliveryResolver, DeliveryService],
    }).compile();

    resolver = module.get<DeliveryResolver>(DeliveryResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
