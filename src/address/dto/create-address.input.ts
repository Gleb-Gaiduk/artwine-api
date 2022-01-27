import { InputType } from '@nestjs/graphql';
import { Transform } from 'class-transformer';
import {
  IsNumber,
  IsOptional,
  IsPostalCode,
  IsString,
  Matches,
} from 'class-validator';
import { capitalizeFirstLetter } from '../../utils/utils-functions';

@InputType()
export class CreateAddressInput {
  @IsNumber({ allowNaN: false, allowInfinity: false })
  userId: number;

  @IsString()
  @Transform(({ value }) => capitalizeFirstLetter(value))
  country: string;

  @IsString()
  @Transform(({ value }) => capitalizeFirstLetter(value))
  city: string;

  @IsString()
  @Transform(({ value }) => capitalizeFirstLetter(value))
  street: string;

  @IsString()
  @Matches(/\d/, {
    message: 'Home number must contain at least one numeric digit.',
  })
  homeNumber: string;

  @IsOptional()
  @IsString()
  @Matches(/\d/, {
    message: 'Flat number must contain at least one numeric digit.',
  })
  flatNumber?: string;

  @IsPostalCode('PL')
  postalIndex: string;
}
