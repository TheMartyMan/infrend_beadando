import { Component, OnInit } from '@angular/core';
import { WarehouseItem } from '../../../models/warehouse-item';
import { WarehouseService } from '../services/warehouse.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-warehouse',
  templateUrl: './warehouse.component.html',
  styleUrls: ['./warehouse.component.css']
})
export class WarehouseComponent implements OnInit {
  warehouseItems: WarehouseItem[] = [];

  constructor(private warehouseService: WarehouseService, private toastrService: ToastrService,) { }

  ngOnInit(): void {
    this.loadWarehouseItems();
  }

  loadWarehouseItems(): void {
    this.warehouseService.getWarehouseItems().subscribe(items => {
      this.warehouseItems = items.filter(item => item.quantity > 0);
  
      // Törlés azokból az elemekből, amelyeknek a darabszáma 0
      const deleteItems = items.filter(item => item.quantity === 0);
      deleteItems.forEach(item => {
        this.warehouseService.deleteWarehouseItem(item.id).subscribe(() => {
          console.log('0-ás darabszám miatt a(z) ' + item.name + ' raktári egység törölve lett');
        }, error => {
          console.error('Hiba történt az elem törlésekor:', error);
        });
      });
    });
  }

  addWarehouseItem(newItem: WarehouseItem): void {
    this.warehouseService.create(newItem).subscribe(() => {
      // Sikeres hozzáadás esetén frissítjük a raktári elemek tömbjét
      this.loadWarehouseItems();
    }, error => {
      console.error('Hiba történt a raktári elem hozzáadásakor:', error);
      // Kezeljük a hiba esetét, pl. hibaüzenet megjelenítése
    });
  }
  
  deleteWarehouseItem(itemId: number): void {
    this.warehouseService.deleteWarehouseItem(itemId).subscribe(() => {
      // Sikeres törlés esetén frissítjük a raktári elemek tömbjét
      this.loadWarehouseItems();
      this.toastrService.success('Raktári egység sikeresen törölve!', 'Siker');
    }, error => {
      console.error('Hiba történt a raktári elem törlésekor:', error);
      // Kezeljük a hiba esetét, pl. hibaüzenet megjelenítése
    });
  }
}