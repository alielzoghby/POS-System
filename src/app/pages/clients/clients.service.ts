import { Injectable } from '@angular/core';
import { ApiBaseService } from '@/shared/services/general/api-base.service';
import { ApiConstant } from '@/shared/config/api.constant';
import { Mapper } from '@/shared/mapper/base-mapper.mapper';
import { Observable, map } from 'rxjs';
import { filterNullEntity } from '@/shared/utils/filter-null-entity.util';
import { Client, ClientList } from './models/client.model';

@Injectable({
  providedIn: 'root',
})
export class ClientService {
  constructor(
    private baseAPI: ApiBaseService,
    private mapper: Mapper
  ) {}

  createClient(body: Client): Observable<Client> {
    return this.baseAPI
      .post(ApiConstant.CREATE_CLIENT, filterNullEntity(body))
      .pipe(map((res) => this.mapper.fromJson(Client, res.data)));
  }

  getClients(body: {
    page: number;
    limit: number;
    search?: string;
    active?: boolean;
    company?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }): Observable<ClientList> {
    return this.baseAPI
      .get(ApiConstant.GET_CLIENTS, {
        params: {
          ...filterNullEntity(body),
        },
      })
      .pipe(map((res) => this.mapper.fromJson(ClientList, res.data)));
  }

  getClientById(clientId: number): Observable<Client> {
    return this.baseAPI
      .get(`${ApiConstant.GET_CLIENT_BY_ID}/${clientId}`)
      .pipe(map((res) => this.mapper.fromJson(Client, res.data)));
  }

  updateClient(clientId: number, body: Client): Observable<Client> {
    return this.baseAPI
      .put(ApiConstant.UPDATE_CLIENT.replace('{id}', String(clientId)), filterNullEntity(body))
      .pipe(map((res) => this.mapper.fromJson(Client, res.data)));
  }

  deleteClient(clientId: number): Observable<void> {
    return this.baseAPI
      .delete(ApiConstant.DELETE_CLIENT.replace('{id}', String(clientId)))
      .pipe(map(() => {}));
  }
}
