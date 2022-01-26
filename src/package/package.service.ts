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
        `Package with the title "${existingPackage.title}" already exsists.`,
      );
    }

    const packageInstance = new Package();

    for (const [key, value] of Object.entries(createPackageInput)) {
      packageInstance[key] = value;
    }

    return await this.packageRepo.save(packageInstance);
  }

  findAll() {
    return `This action returns all package`;
  }

  findOne(id: number) {
    return `This action returns a #${id} package`;
  }

  update(id: number, updatePackageInput: UpdatePackageInput) {
    return `This action updates a #${id} package`;
  }

  remove(id: number) {
    return `This action removes a #${id} package`;
  }

  async findOneByTitle(title: string): Promise<Package> {
    return this.packageRepo.findOne({ where: { title } });
  }
}
