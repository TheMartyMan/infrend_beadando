import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { OrderItem } from '../../../models/order-item';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(private http: HttpClient) { }

  getOrders(): Observable<OrderItem[]> {
    return this.http.get<OrderItem[]>('/api/order');
  }

  getOne(id: number) {

    return this.http.get<OrderItem>('/api/order/' + id);

  }

  create (item: OrderItem) {

    return this.http.post<OrderItem>('/api/order', item);
  }

  update (item: OrderItem) {

    return this.http.put<OrderItem>('/api/order', item);
  }

  deleteOrder(itemId: number) {
    return this.http.delete('/api/order/' + itemId);
  }
}