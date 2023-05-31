import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { switchMap } from 'rxjs/operators';
import { ManufacturingItem } from '../../../models/manufacturing-item';

@Injectable({
  providedIn: 'root'
})
export class ManufacturingService {

  constructor(private http: HttpClient) { }

  getManufacturingItems(): Observable<ManufacturingItem[]> {
    return this.http.get<ManufacturingItem[]>('/api/manufacturing');
  }

  getOne(id: number) {

    return this.http.get<ManufacturingItem>('/api/manufacturing/' + id);

  }

  getInventoryCount(itemName: string): Observable<number> {
    return this.http.get<ManufacturingItem[]>('/api/manufacturing').pipe(
      map((manufacturingItems: ManufacturingItem[]) => {
        const item = manufacturingItems.find((item) => item.manufacturingName === itemName);
        return item ? item.quantity : 0;
      })
    );
  }

  create (item: ManufacturingItem) {

    return this.http.post<ManufacturingItem>('/api/manufacturing', item);
  }

  update (item: ManufacturingItem) {

    return this.http.put<ManufacturingItem>('/api/manufacturing', item);
  }

  deleteManufacturingItem(itemId: number) {
    return this.http.delete('/api/manufacturing/' + itemId);
  }


  updateQuantity(itemName: string, newQuantity: number): Observable<ManufacturingItem> {
    return this.http.get<ManufacturingItem[]>('/api/manufacturing').pipe(
      switchMap((warehouseItems: ManufacturingItem[]) => {
        const item = warehouseItems.find((item) => item.manufacturingName === itemName);
        if (item) {
            
            item.quantity -= newQuantity;
            return this.update(item)   

        }
        throw new Error('Az elem nem található a raktárban.');
      })
    );
  }
}