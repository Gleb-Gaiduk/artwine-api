import { Test, TestingModule } from '@nestjs/testing';
import { ProductPropertyValueService } from './product-property.service';

describe('ProductPropertyService', () => {
  let service: ProductPropertyValueService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductPropertyValueService],
    }).compile();

    service = module.get<ProductPropertyValueService>(
      ProductPropertyValueService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
