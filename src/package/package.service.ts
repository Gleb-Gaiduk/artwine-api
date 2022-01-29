import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { mapPropsToEntity } from '../utils/utils-functions';
import { CreatePackageInput } from './dto/create-package.input';
import { UpdatePackageInput } from './dto/update-package.input';
import { Package } from './entities/package.entity';

@Injectable()
export class PackageService {
  constructor(
    @InjectRepository(Package)
    private readonly packageRepo: Repository<Package>,
  ) {}

  async create(createPackageInput: CreatePackageInput): Promise<Package> {
    const existingPackage = await this.findOneByTitle(createPackageInput.title);

    if (existingPackage) {
      throw new BadRequestException(
        `Package with the title "${existingPackage.title}" already exists.`,
      );
    }

    const packageInstance = new Package();

    const packageWithProps = mapPropsToEntity<CreatePackageInput, Package>(
      createPackageInput,
      packageInstance,
    );

    return await this.packageRepo.save(packageWithProps);
  }

  async findAll(): Promise<Package[]> {
    return await this.packageRepo.find();
  }

  async findOne(id: number): Promise<Package> {
    const existingPackage = await this.packageRepo.findOne(id);

    if (!existingPackage) {
      throw new BadRequestException(
        `Package with the id "${id}" does not exist.`,
      );
    }
    return await this.packageRepo.findOne(id);
  }

  async update(
    id: number,
    updatePackageInput: UpdatePackageInput,
  ): Promise<Package> {
    const existingPackage = await this.packageRepo.findOne(id);

    if (!existingPackage) {
      throw new BadRequestException(`Package with id "${id}" does not exist.`);
    }

    const updatedPackage = mapPropsToEntity<UpdatePackageInput, Package>(
      updatePackageInput,
      existingPackage,
    );

    return await this.packageRepo.save(updatedPackage);
  }

  async remove(id: number): Promise<boolean> {
    const existingPackage = await this.findOne(id);

    if (!existingPackage) {
      throw new BadRequestException(
        `Package with the id "${id}" does not exist.`,
      );
    }

    await this.packageRepo.delete(id);
    return true;
  }

  async findOneByTitle(title: string): Promise<Package> {
    return this.packageRepo.findOne({ where: { title } });
  }

  async getTotalPriceByIDs(ids: number[]): Promise<number> {
    const packagePrices = await this.packageRepo.findByIds(ids, {
      select: ['price'],
    });
    return packagePrices.reduce(
      (init, current) => Number(init + current.price),
      0,
    );
  }
}
