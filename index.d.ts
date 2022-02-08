import 'typeorm';

declare module 'typeorm' {
  export interface SelectQueryBuilder<Entity> {
    leftJoinAndSelectWithRelations(
      alias: string,
      relations: string[],
    ): SelectQueryBuilder<Entity>;
  }
}
