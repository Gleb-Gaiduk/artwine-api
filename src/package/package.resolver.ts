import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Public } from '../auth/decorators/public.decorator';
import { CreatePackageInput } from './dto/create-package.input';
import { UpdatePackageInput } from './dto/update-package.input';
import { Package } from './entities/package.entity';
import { PackageService } from './package.service';

@Resolver(() => Package)
export class PackageResolver {
  constructor(private readonly packageService: PackageService) {}

  @Mutation(() => Package)
  createPackage(
    @Args('createPackageInput') createPackageInput: CreatePackageInput,
  ): Promise<Package> {
    return this.packageService.create(createPackageInput);
  }

  @Public()
  @Query(() => [Package], { name: 'package' })
  findAll(): Promise<Package[]> {
    return this.packageService.findAll();
  }

  @Public()
  @Query(() => Package, { name: 'package' })
  findOne(@Args('id', { type: () => Int }) id: number): Promise<Package> {
    return this.packageService.findOne(id);
  }

  @Mutation(() => Package)
  updatePackage(
    @Args('updatePackageInput') updatePackageInput: UpdatePackageInput,
  ): Promise<Package> {
    return this.packageService.update(
      updatePackageInput.id,
      updatePackageInput,
    );
  }

  @Mutation(() => Package)
  removePackage(@Args('id', { type: () => Int }) id: number): Promise<boolean> {
    return this.packageService.remove(id);
  }
}
