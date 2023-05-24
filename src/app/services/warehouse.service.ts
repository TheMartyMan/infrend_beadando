import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { switchMap } from 'rxjs/operators';
import { WarehouseItem } from '../../../models/warehouse-item';

@Injectable({
  providedIn: 'root'
})
export class WarehouseService {

  constructor(private http: HttpClient) { }

  getWarehouseItems(): Observable<WarehouseItem[]> {
    return this.http.get<WarehouseItem[]>('/api/warehouse');
  }


  getOne(id: number) {

    return this.http.get<WarehouseItem>('/api/warehouse/' + id);

  }


  getInventoryCount(itemName: string): Observable<number> {
    return this.http.get<WarehouseItem[]>('/api/warehouse').pipe(
      map((warehouseItems: WarehouseItem[]) => {
        const item = warehouseItems.find((item) => item.name === itemName);
        return item ? item.quantity : 0;
      })
    );
  }

  update (item: WarehouseItem) {

    return this.http.put<WarehouseItem>('/api/warehouse', item);
  }


  create (item: WarehouseItem) {

    return this.http.post<WarehouseItem>('/api/warehouse', item);
  }


  
  deleteWarehouseItem(itemId: number) {
    return this.http.delete('/api/warehouse/' + itemId);
  }




  updateQuantity(itemName: string, newQuantity: number): Observable<WarehouseItem> {
    return this.http.get<WarehouseItem[]>('/api/warehouse').pipe(
      switchMap((warehouseItems: WarehouseItem[]) => {
        const item = warehouseItems.find((item) => item.name === itemName);
        if (item) {
            
            item.quantity -= newQuantity;
            return this.update(item)   

        }
        throw new Error('Az elem nem található a raktárban.');
      })
    );
  }

}