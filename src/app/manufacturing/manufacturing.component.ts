import { Component, OnInit } from '@angular/core';
import { ManufacturingItem } from '../../../models/manufacturing-item';
import { ManufacturingService } from '../services/manufacturing.service';
import { ToastrService } from 'ngx-toastr';

@Component({

  selector: 'app-manufacturing',
  templateUrl: './manufacturing.component.html',
  styleUrls: ['./manufacturing.component.css']
})
export class ManufacturingComponent implements OnInit {
  manufacturingItems: ManufacturingItem[] = [];

  constructor(private manufacturingService: ManufacturingService, private toastrService: ToastrService,) { }
  ngOnInit(): void {
    this.loadManufacturingItems();
  }

  loadManufacturingItems(): void {
    this.manufacturingService.getManufacturingItems().subscribe(items => {
      this.manufacturingItems = items.filter(item => item.quantity > 0);
  
      // Törlés azokból az elemekből, amelyeknek a darabszáma 0
      const deleteItems = items.filter(item => item.quantity === 0);
      deleteItems.forEach(item => {
        this.manufacturingService.deleteManufacturingItem(item.id).subscribe(() => {
          console.log('0-ás darabszám miatt a(z) ' + item.manufacturingName + ' gyártmány törölve lett');
        }, error => {
          console.error('Hiba történt az elem törlésekor:', error);
        });
      });
    });
  }

  addManufacturingItem(newItem: ManufacturingItem): void {
    this.manufacturingService.create(newItem).subscribe(() => {
      // Sikeres hozzáadás esetén frissítjük a gyártmányok tömbjét
      this.loadManufacturingItems();
    }, error => {
      console.error('Hiba történt a gyártmány hozzáadásakor:', error);
      // Kezeljük a hiba esetét, pl. hibaüzenet megjelenítése
    });
  }
  
  deleteManufacturingItem(itemId: number): void {
    this.manufacturingService.deleteManufacturingItem(itemId).subscribe(() => {
      // Sikeres törlés esetén frissítjük a gyártmányok tömbjét
      this.loadManufacturingItems();
      this.toastrService.success('Gyártmány sikeresen törölve!', 'Siker');
    }, error => {
      console.error('Hiba történt a gyártmány törlésekor:', error);
      // Kezeljük a hiba esetét, pl. hibaüzenet megjelenítése
    });
  }
}