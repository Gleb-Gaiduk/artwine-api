import { InputType } from '@nestjs/graphql';

@InputType()
export class SearchQueryInput {
  q: string;
}
