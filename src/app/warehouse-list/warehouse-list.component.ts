import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { WarehouseItem } from '../../../models/warehouse-item';
import { ToastrService } from 'ngx-toastr';
import { WarehouseService } from '../services/warehouse.service';
import { Validators } from '@angular/forms';


@Component({
  selector: 'app-product-form',
  templateUrl: './warehouse-list.component.html',
  styleUrls: ['./warehouse-list.component.css']
})
export class WarehouseListComponent implements OnInit {
  warehouseForm = this.formBuilder.group({

    id: this.formBuilder.control(0),
    name: this.formBuilder.control('', Validators.required),
    stockNumber: this.formBuilder.control(1),
    dateAdded: this.formBuilder.control(new Date()),
    quantity: this.formBuilder.control(1)

  });


    constructor(
      private warehouseService: WarehouseService,
      private toastrService: ToastrService,
      private activatedRoute: ActivatedRoute,
      private formBuilder: FormBuilder) { }


      ngOnInit(): void {
        const id = this.activatedRoute.snapshot.params['id'];

        if (id) {

          this.warehouseService.getOne(id).subscribe({

            next: (item) => {

              this.warehouseForm.setValue(item);
            },

            error: (err) => {

              console.error(err);
              this.toastrService.error('Hiba a termékadatok betöltésekor.', 'Hiba');
            }


          })

        }
      }

      saveWarehouseItem() {
        const warehouseItem = this.warehouseForm.value as WarehouseItem;
        
        if (this.warehouseForm.valid) {
          const itemName = warehouseItem.name;
        
          // Ellenőrizzük, hogy az adott névvel elem már szerepel-e a raktárban
          this.warehouseService.getWarehouseItems().subscribe(items => {
            const existingItem = items.find(item => item.name === itemName);
        
            if (existingItem) {
              // Az elem már szerepel a raktárban, növeljük a darabszámot
              existingItem.quantity += warehouseItem.quantity;
        
              // Frissítjük az adatbázisban az elem darabszámát
              this.warehouseService.update(existingItem).subscribe(updatedItem => {
                this.toastrService.info('Már megtalálható a(z) ' + itemName + ' egység, ezért csak a darabszám frissült.', 'Figyelem');
              }, error => {
                console.error(error);
                this.toastrService.error('Hiba történt a darabszám frissítésekor.', 'Hiba');
              });
            } else {
              // Az elem még nem szerepel a raktárban, hozzáadjuk az adatbázishoz
              this.warehouseService.create(warehouseItem).subscribe(createdItem => {
                this.toastrService.success('Új '+ itemName + ' egység sikeresen létrehozva!', 'Siker');
              }, error => {
                console.error(error);
                this.toastrService.error('Hiba történt a létrehozás során.', 'Hiba');
              });
            }
          });
        } else {
          this.toastrService.info('Kérlek ne hagyj üresen mezőt, mert így nem kerül felvételre raktári egység.');
        }
      }
}