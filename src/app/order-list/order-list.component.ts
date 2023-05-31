import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { OrderService } from '../services/order.service';
import { Validators } from '@angular/forms';
import { ManufacturingItem } from 'models/manufacturing-item';
import { WarehouseService } from '../services/warehouse.service';
import { ManufacturingService } from '../services/manufacturing.service';
import { FormControl } from '@angular/forms';
import { OrderItem } from 'models/order-item';


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
  })
  
    manufacturingForm = this.formBuilder.group({

      id: this.formBuilder.control(0),
      manufacturingName: new FormControl(this.orderForm.controls.order.value),
      quantity: this.formBuilder.control(1)
  
    

  });


    constructor(
      
      private orderService: OrderService,
      private warehouseService: WarehouseService,
      private manufacturingService: ManufacturingService,
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


      updateManufacturingName() {
        this.manufacturingForm.controls.manufacturingName.setValue(this.orderForm.controls.order.value);
      }



    
      makeOrder() {
    
        const orderItem = this.orderForm.value as OrderItem;
        const manufacturingItem = this.manufacturingForm.value as ManufacturingItem;
        const manufacturingName = this.manufacturingForm.controls.manufacturingName.value;
        const rendelo = orderItem.customerName;
        const rendeles = orderItem.order;
    
        if (manufacturingName !== null) {
          manufacturingItem.manufacturingName = manufacturingName;
        }
    
        this.updateManufacturingName();
    
        const gyCount = manufacturingItem.quantity;
        
        if (this.orderForm.valid) {
    
    
          if (manufacturingName === 'Autó') {
            
            
    
            this.warehouseService.getInventoryCount('Motor').subscribe(motorCount => {
              this.warehouseService.getInventoryCount('Váz').subscribe(vazCount => {
                this.warehouseService.getInventoryCount('Kerék').subscribe(kerekCount => {
                  if (motorCount >= 1*gyCount && vazCount >= 1*gyCount && kerekCount >= 4*gyCount) {
    
          
                    this.manufacturingService.create(manufacturingItem).subscribe({
                      next: () => {
                        this.toastrService.info('A felhasznált raktári egységek törlésre kerültek.', 'Figyelem');
                        this.toastrService.success('Új autó sikeresen megrendelve!', 'Siker');
                        this.warehouseService.updateQuantity('Motor', 1*gyCount).subscribe({
                          next: () => {},
                          error: (err) => {
                            console.error(err);
                            this.toastrService.error('Hiba történt a motor raktár egység frissítésekor.', 'Hiba');
                          }
                        });
                        this.warehouseService.updateQuantity('Váz', 1*gyCount).subscribe({
                          next: () => {},
                          error: (err) => {
                            console.error(err);
                            this.toastrService.error('Hiba történt a váz raktár egység frissítésekor.', 'Hiba');
                          }
                        });
                        this.warehouseService.updateQuantity('Kerék', 4*gyCount).subscribe({
                          next: () => {},
                          error: (err) => {
                            console.error(err);
                            this.toastrService.error('Hiba történt a kerék raktár egység frissítésekor.', 'Hiba');
                          }
                        });
                      },
                      error: (err) => {
                        console.error(err);
                        this.toastrService.error('Hiba történt a megrendelés létrehozásakor.', 'Hiba');
                      }
                    });
                    
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
                    this.toastrService.info('A gyártmány táblázatból ellenőrizheted a szükséges alkatrészek mennyiségét.', 'Figyelem');
                    this.toastrService.error('Nincs elegendő alkatrész a raktárban az autóhoz! Megrendelés nem hozható létre!', 'Hiba');
                  }
                });
              });
            });
    
    
    
    
    
          } else if (manufacturingName === 'Motorkerékpár') {
            this.warehouseService.getInventoryCount('Motor').subscribe(motorCount => {
              this.warehouseService.getInventoryCount('Váz').subscribe(vazCount => {
                this.warehouseService.getInventoryCount('Kerék').subscribe(kerekCount => {
                  if (motorCount >= 1*gyCount && vazCount >= 1*gyCount && kerekCount >= 2*gyCount) {
    
          
                    this.manufacturingService.create(manufacturingItem).subscribe({
                      next: (insertedItem) => {
                        this.toastrService.info('A felhasznált raktári egységek törlésre kerültek.', 'Figyelem');
                        this.toastrService.success('Új motorkerékpár sikeresen megrendelve!', 'Siker');
                        this.warehouseService.updateQuantity('Motor', 1*gyCount).subscribe({
                          next: () => {},
                          error: (err) => {
                            console.error(err);
                            this.toastrService.error('Hiba történt a motor raktár egység frissítésekor.', 'Hiba');
                          }
                        });
                        this.warehouseService.updateQuantity('Váz', 1*gyCount).subscribe({
                          next: () => {},
                          error: (err) => {
                            console.error(err);
                            this.toastrService.error('Hiba történt a váz raktár egység frissítésekor.', 'Hiba');
                          }
                        });
                        this.warehouseService.updateQuantity('Kerék', 2*gyCount).subscribe({
                          next: () => {},
                          error: (err) => {
                            console.error(err);
                            this.toastrService.error('Hiba történt a kerék raktár egység frissítésekor.', 'Hiba');
                          }
                        });
                      },
                      error: (err) => {
                        console.error(err);
                        this.toastrService.error('Hiba történt a létrehozáskor.', 'Hiba');
                      }
                    });

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
                    this.toastrService.info('A gyártmány táblázatból ellenőrizheted a szükséges alkatrészek mennyiségét.', 'Figyelem');
                    this.toastrService.error('Nincs elegendő alkatrész a raktárban a motorkerékpárhoz! Megrendelés nem hozható létre!', 'Hiba');
                  }
                });
              });
            });
    
    
    
    
          } else if (manufacturingName === 'Kamion') {
            this.warehouseService.getInventoryCount('Motor').subscribe(motorCount => {
              this.warehouseService.getInventoryCount('Váz').subscribe(vazCount => {
                this.warehouseService.getInventoryCount('Kerék').subscribe(kerekCount => {
                  if (motorCount >= 1*gyCount && vazCount >= 2*gyCount && kerekCount >= 6*gyCount) {
    
          
                    this.manufacturingService.create(manufacturingItem).subscribe({
                      next: (insertedItem) => {
                        this.toastrService.info('A felhasznált raktári egységek törlésre kerültek.', 'Figyelem');
                        this.toastrService.success('Új kamion sikeresen megrendelve!', 'Siker');
                        this.warehouseService.updateQuantity('Motor', 1*gyCount).subscribe({
                          next: () => {},
                          error: (err) => {
                            console.error(err);
                            this.toastrService.error('Hiba történt a motor raktár egység frissítésekor.', 'Hiba');
                          }
                        });
                        this.warehouseService.updateQuantity('Váz', 2*gyCount).subscribe({
                          next: () => {},
                          error: (err) => {
                            console.error(err);
                            this.toastrService.error('Hiba történt a váz raktár egység frissítésekor.', 'Hiba');
                          }
                        });
                        this.warehouseService.updateQuantity('Kerék', 6*gyCount).subscribe({
                          next: () => {},
                          error: (err) => {
                            console.error(err);
                            this.toastrService.error('Hiba történt a kerék raktár egység frissítésekor.', 'Hiba');
                          }
                        });
                      },
                      error: (err) => {
                        console.error(err);
                        this.toastrService.error('Hiba történt a létrehozáskor.', 'Hiba');
                      }
                    });


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
                    this.toastrService.info('A gyártmány táblázatból ellenőrizheted a szükséges alkatrészek mennyiségét.', 'Figyelem');
                    this.toastrService.error('Nincs elegendő alkatrész a raktárban a kamionhoz! Megrendelés nem hozható létre!', 'Hiba');
                  }
                });
              });
            });
    
    
    
          } else if (manufacturingName === 'Bicikli') {
            this.manufacturingService.getInventoryCount('Csavarkészlet').subscribe(csavarCount => {
              this.warehouseService.getInventoryCount('Váz').subscribe(vazCount => {
                this.warehouseService.getInventoryCount('Kerék').subscribe(kerekCount => {
                  if (csavarCount >= 1*gyCount && vazCount >= 1*gyCount && kerekCount >= 2*gyCount) {
    
          
                    this.manufacturingService.create(manufacturingItem).subscribe({
                      next: (insertedItem) => {
                        this.toastrService.info('A felhasznált raktári egységek és a gyártmány törlésre került.', 'Figyelem');
                        this.toastrService.success('Új bicikli sikeresen megrendelve!', 'Siker');
                        this.manufacturingService.updateQuantity('Csavarkészlet', 1*gyCount).subscribe({
                          next: () => {},
                          error: (err) => {
                            console.error(err);
                            this.toastrService.error('Hiba történt a csavarkészlet gyártmány frissítésekor.', 'Hiba');
                          }
                        });
                        this.warehouseService.updateQuantity('Váz', 1*gyCount).subscribe({
                          next: () => {},
                          error: (err) => {
                            console.error(err);
                            this.toastrService.error('Hiba történt a váz raktár egység frissítésekor.', 'Hiba');
                          }
                        });
                        this.warehouseService.updateQuantity('Kerék', 2*gyCount).subscribe({
                          next: () => {},
                          error: (err) => {
                            console.error(err);
                            this.toastrService.error('Hiba történt a kerék raktár egység frissítésekor.', 'Hiba');
                          }
                        });
                      },
                      error: (err) => {
                        console.error(err);
                        this.toastrService.error('Hiba történt a létrehozáskor.', 'Hiba');
                      }
                    });





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
                    this.toastrService.info('A gyártmány táblázatból ellenőrizheted a szükséges alkatrészek mennyiségét.', 'Figyelem');
                    this.toastrService.error('Nincs elegendő alkatrész a raktárban a biciklihez! Megrendelés nem hozható létre!', 'Hiba');
                  }
                });
              });
            });
    
    
    
          } else if (manufacturingName === 'Csavarkészlet') {
            this.warehouseService.getInventoryCount('M2-es csavar').subscribe(M2Count => {
              this.warehouseService.getInventoryCount('M6-os csavar').subscribe(M6Count => {
                this.warehouseService.getInventoryCount('M12-es csavar').subscribe(M12Count => {
                  if (M2Count >= 10*gyCount && M6Count >= 10*gyCount && M12Count >= 10*gyCount) {
    
          
                    this.manufacturingService.create(manufacturingItem).subscribe({
                      next: (insertedItem) => {
                        this.toastrService.info('A felhasznált raktári egységek törlésre kerültek.', 'Figyelem');
                        this.toastrService.success('Új csavarkészlet sikeresen megrendelve!', 'Siker');
                        this.warehouseService.updateQuantity('M2-es csavar', 10*gyCount).subscribe({
                          next: () => {},
                          error: (err) => {
                            console.error(err);
                            this.toastrService.error('Hiba történt az M2-es csavar raktári egység frissítésekor.', 'Hiba');
                          }
                        });
                        this.warehouseService.updateQuantity('M6-os csavar', 10*gyCount).subscribe({
                          next: () => {},
                          error: (err) => {
                            console.error(err);
                            this.toastrService.error('Hiba történt az M6-os csavar raktári egység frissítésekor.', 'Hiba');
                          }
                        });
                        this.warehouseService.updateQuantity('M12-es csavar', 10*gyCount).subscribe({
                          next: () => {},
                          error: (err) => {
                            console.error(err);
                            this.toastrService.error('Hiba történt az M12-es csavar raktári egység frissítésekor.', 'Hiba');
                          }
                        });
                      },
                      error: (err) => {
                        console.error(err);
                        this.toastrService.error('Hiba történt a létrehozáskor.', 'Hiba');
                      }
                    });




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
                    this.toastrService.info('A gyártmány táblázatból ellenőrizheted a szükséges alkatrészek mennyiségét.', 'Figyelem');
                    this.toastrService.error('Nincs elegendő alkatrész a raktárban a csavarkészlethez! Megrendelés nem hozható létre!', 'Hiba');
                  }

            });
          });
        });
      }   
    } else {
        this.toastrService.info('Kérlek ne hagyj üresen mezőt, mert így nem kerül felvételre a megrendelés.');
      }
  }  
}