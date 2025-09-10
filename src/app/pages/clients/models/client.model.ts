import { Expose, Type } from 'class-transformer';
import { Pagination } from './../../../shared/models/list';
import { Order } from '@/pages/orders/models/order.model';

export class Address {
  @Expose() address_id!: number;

  @Expose() client_id!: number;

  @Expose() street!: string;

  @Expose() city!: string;

  @Expose() state?: string;

  @Expose() postal_code?: string;

  @Expose() country!: string;

  @Expose() is_primary!: boolean;

  @Expose() created_at!: Date;

  @Expose() updated_at!: Date;
}

export class PhoneNumber {
  @Expose() phone_number_id!: number;

  @Expose() client_id!: number;

  @Expose() number!: string;

  @Expose() is_primary!: boolean;

  @Expose() type?: string;

  @Expose() created_at!: Date;

  @Expose() updated_at!: Date;
}

export class Client {
  @Expose() client_id!: number;

  @Expose() title?: string;

  @Expose() first_name!: string;

  @Expose() last_name!: string;

  @Expose() email!: string;

  @Expose() company?: string;

  @Expose() sales?: number;

  @Expose() active!: boolean;

  @Expose() created_at!: Date;

  @Expose() updated_at!: Date;

  @Expose()
  orders?: Order[];

  @Expose()
  addresses?: Address[];

  @Expose()
  phoneNumbers?: PhoneNumber[];
}

export class ClientList {
  @Expose() clients!: Client[];
  @Expose() pagination!: Pagination;
}
