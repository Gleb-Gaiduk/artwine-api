import { Test, TestingModule } from '@nestjs/testing';
import { ProductPropertyTypeService } from './product-property-type.service';

describe('ProductPropertyTypeService', () => {
  let service: ProductPropertyTypeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductPropertyTypeService],
    }).compile();

    service = module.get<ProductPropertyTypeService>(ProductPropertyTypeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
