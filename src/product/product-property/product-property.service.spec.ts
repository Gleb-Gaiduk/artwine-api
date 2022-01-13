import { Test, TestingModule } from '@nestjs/testing';
import { ProductPropertyService } from './product-property.service';

describe('ProductPropertyService', () => {
  let service: ProductPropertyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductPropertyService],
    }).compile();

    service = module.get<ProductPropertyService>(ProductPropertyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
