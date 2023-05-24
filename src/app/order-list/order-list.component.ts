import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { OrderItem } from '../../../models/order-item';
import { ToastrService } from 'ngx-toastr';
import { OrderService } from '../services/order.service';
import { Validators, AbstractControl } from '@angular/forms';
import { ValidatorFn, ValidationErrors } from '@angular/forms';


@Component({
  selector: 'app-product-form',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.css']
})



export class OrderListComponent implements OnInit {
  orderForm = this.formBuilder.group({

    id: this.formBuilder.control(0),
    customerName: this.formBuilder.control('', Validators.required),
    dateOfBirth: this.formBuilder.control(new Date()),
    order: this.formBuilder.control('', Validators.required),
    quantity: this.formBuilder.control(1)

  });


    constructor(
      private orderService: OrderService,
      private toastrService: ToastrService,
      private activatedRoute: ActivatedRoute,
      private formBuilder: FormBuilder) { }


      ngOnInit(): void {
        const id = this.activatedRoute.snapshot.params['id'];

        if (id) {

          this.orderService.getOne(id).subscribe({

            next: (item) => {

              this.orderForm.setValue(item);
            },

            error: (err) => {

              console.error(err);
              this.toastrService.error('Hiba a termékadatok betöltésekor.', 'Hiba');
            }


          })

        }
      }


      saveOrder() {
        const orderItem = this.orderForm.value as OrderItem;
        
        if (this.orderForm.valid) {
          const rendelo = orderItem.customerName;
          const rendeles = orderItem.order;
        
          // Ellenőrizzük, hogy az adott névvel elem már szerepel-e a raktárban
          this.orderService.getOrders().subscribe(items => {
            const existingItem = items.find(item => item.customerName === rendelo);
        
            if (existingItem) {
              // Az elem már szerepel a raktárban, növeljük a darabszámot
              existingItem.quantity += orderItem.quantity;
        
              // Frissítjük az adatbázisban az elem darabszámát
              this.orderService.update(existingItem).subscribe(updatedItem => {
                this.toastrService.info('Már megtalálható a(z) ' + rendeles + ' rendelés ezen a néven, ezért csak a darabszám frissült.', 'Figyelem');
              }, error => {
                console.error(error);
                this.toastrService.error('Hiba történt a darabszám frissítésekor.', 'Hiba');
              });
            } else {
              // Az elem még nem szerepel a raktárban, hozzáadjuk az adatbázishoz
              this.orderService.create(orderItem).subscribe(createdItem => {
                this.toastrService.success( rendeles + ' rendelés ' + rendelo + ' néven sikeresen létrehozva!', 'Siker');
              }, error => {
                console.error(error);
                this.toastrService.error('Hiba történt a létrehozás során.', 'Hiba');
              });
            }
          });
        } else {
          this.toastrService.info('Kérlek ne hagyj üresen mezőt, mert így nem nem tudjuk ellenőrizni a rendelést.');
        }
      }
}