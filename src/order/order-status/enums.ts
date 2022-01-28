import { registerEnumType } from '@nestjs/graphql';

export enum Status {
  PLACED = 'Placed',
  PROCESSING = 'Processing',
  CANCELED = 'Canceled',
  IN_TRANSIT = 'In transit',
  DELIVERED = 'Delivered',
  RETURNED = 'Returned',
}

registerEnumType(Status, {
  name: 'Status',
});
