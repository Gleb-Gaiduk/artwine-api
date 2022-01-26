import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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

    for (const [key, value] of Object.entries(createPackageInput)) {
      packageInstance[key] = value;
    }

    return await this.packageRepo.save(packageInstance);
  }

  async findAll(): Promise<Package[]> {
    return await this.packageRepo.find();
  }

  async findOne(id: number): Promise<Package> {
    const existingPackage = await this.findOne(id);

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

    for (const [key, value] of Object.entries(updatePackageInput)) {
      existingPackage[key] = value;
    }

    return await this.packageRepo.save(existingPackage);
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
}
