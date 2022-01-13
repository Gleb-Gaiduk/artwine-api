import { Test, TestingModule } from '@nestjs/testing';
import { ProductPropertyTypeResolver } from './product-property-type.resolver';
import { ProductPropertyTypeService } from './product-property-type.service';

describe('ProductPropertyTypeResolver', () => {
  let resolver: ProductPropertyTypeResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductPropertyTypeResolver, ProductPropertyTypeService],
    }).compile();

    resolver = module.get<ProductPropertyTypeResolver>(ProductPropertyTypeResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
