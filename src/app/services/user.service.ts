import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserItem } from '../../../models/user-items';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  getAll() {
    return this.http.get<UserItem[]>('/api/user');
  }

  getOne(id: number) {
    return this.http.get<UserItem>('/api/user/' + id);
  }

  create(user: UserItem) {
    return this.http.post<UserItem>('/api/user', user);
  }

  update(user: UserItem) {
    return this.http.put<UserItem>('/api/user', user);
  }

  delete(id: number) {
    return this.http.delete('/api/user/' + id);
  }
}