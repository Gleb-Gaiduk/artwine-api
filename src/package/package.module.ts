import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Package } from './entities/package.entity';
import { PackageResolver } from './package.resolver';
import { PackageService } from './package.service';

@Module({
  imports: [TypeOrmModule.forFeature([Package])],
  providers: [PackageResolver, PackageService],
})
export class PackageModule {}
