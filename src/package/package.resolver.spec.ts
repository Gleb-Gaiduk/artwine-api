import { Test, TestingModule } from '@nestjs/testing';
import { PackageResolver } from './package.resolver';
import { PackageService } from './package.service';

describe('PackageResolver', () => {
  let resolver: PackageResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PackageResolver, PackageService],
    }).compile();

    resolver = module.get<PackageResolver>(PackageResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
