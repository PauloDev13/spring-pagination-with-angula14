import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { GetUsersResponse } from '../interface/get-users-response';
import { Page } from '../interface/page';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly baseUrl = 'http://localhost:8080';

  constructor(private httpClient: HttpClient) {}

  users$ = (name = '', page = 0, size = 10): Observable<GetUsersResponse<Page>> =>
    this.httpClient.get<GetUsersResponse<Page>>(
      `${this.baseUrl}/users?name=${name}&page=${page}&size=${size}`,
    );

  // getUsers(name = '', page = 0, size = 10): Observable<any> {
  //   return this.httpClient.get<any>(
  //     `${this.baseUrl}/users?name=${name}&page=${page}&size=${size}`,
  //   );
  // }
}
