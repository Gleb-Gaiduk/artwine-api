import { Test, TestingModule } from '@nestjs/testing';
import { ProductPropertyResolver } from './product-property.resolver';
import { ProductPropertyService } from './product-property.service';

describe('ProductPropertyResolver', () => {
  let resolver: ProductPropertyResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductPropertyResolver, ProductPropertyService],
    }).compile();

    resolver = module.get<ProductPropertyResolver>(ProductPropertyResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
