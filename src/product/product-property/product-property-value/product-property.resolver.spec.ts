import { Test, TestingModule } from '@nestjs/testing';
import { ProductPropertyResolver } from './product-property.resolver';
import { ProductPropertyValueService } from './product-property.service';

describe('ProductPropertyResolver', () => {
  let resolver: ProductPropertyResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductPropertyResolver, ProductPropertyValueService],
    }).compile();

    resolver = module.get<ProductPropertyResolver>(ProductPropertyResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
