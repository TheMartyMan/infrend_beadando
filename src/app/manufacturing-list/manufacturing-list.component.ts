import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ManufacturingItem } from '../../../models/manufacturing-item';
import { ToastrService } from 'ngx-toastr';
import { ManufacturingService } from '../services/manufacturing.service';
import { WarehouseService } from '../services/warehouse.service';
import { Validators } from '@angular/forms';


@Component({
  selector: 'app-product-form',
  templateUrl: './manufacturing-list.component.html',
  styleUrls: ['./manufacturing-list.component.css']
})



export class ManufacturingListComponent implements OnInit {



  manufacturingForm = this.formBuilder.group({

    id: this.formBuilder.control(0),
    manufacturingName: this.formBuilder.control('', Validators.required),
    quantity: this.formBuilder.control(1)

  });


    constructor(
      private manufacturingService: ManufacturingService,
      private warehouseService: WarehouseService,
      private toastrService: ToastrService,
      private activatedRoute: ActivatedRoute,
      private formBuilder: FormBuilder) { }


      ngOnInit(): void {
        const id = this.activatedRoute.snapshot.params['id'];

        if (id) {

          this.manufacturingService.getOne(id).subscribe({

            next: (item) => {

              this.manufacturingForm.setValue(item);
            },

            error: (err) => {

              console.error(err);
              this.toastrService.error('Hiba a termékadatok betöltésekor.', 'Hiba');
            }


          })

        }
      }




      saveManufacturingItem() {
        const manufacturingItem = this.manufacturingForm.value as ManufacturingItem;
        const manufacturingName = this.manufacturingForm.controls.manufacturingName.value;
        const gyCount = manufacturingItem.quantity;
        if (this.manufacturingForm.valid) {





          if (manufacturingName === 'Autó') {
            


            this.warehouseService.getInventoryCount('Motor').subscribe(motorCount => {
              this.warehouseService.getInventoryCount('Váz').subscribe(vazCount => {
                this.warehouseService.getInventoryCount('Kerék').subscribe(kerekCount => {
                  if (motorCount >= 1*gyCount && vazCount >= 1*gyCount && kerekCount >= 4*gyCount) {
  
          
                    this.manufacturingService.create(manufacturingItem).subscribe({
                      next: () => {
                        this.toastrService.info('A felhasznált raktári egységek törlésre kerültek.', 'Figyelem');
                        this.toastrService.success('Új autó sikeresen létrehozva!', 'Siker');
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
                        this.toastrService.error('Hiba történt a létrehozáskor.', 'Hiba');
                      }
                    });
                  } else {
                    this.toastrService.info('A táblázatokból ellenőrizheti a szükséges alkatrészek mennyiségét.', 'Figyelem');
                    this.toastrService.error('Nincs elegendő alkatrész a raktárban az autóhoz!', 'Hiba');
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
                        this.toastrService.success('Új motorkerékpár sikeresen létrehozva!', 'Siker');
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
                  } else {
                    this.toastrService.info('A táblázatokból ellenőrizheti a szükséges alkatrészek mennyiségét.', 'Figyelem');
                    this.toastrService.error('Nincs elegendő alkatrész a raktárban a motorkerékpárhoz!', 'Hiba');
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
                        this.toastrService.success('Új kamion sikeresen létrehozva!', 'Siker');
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
                  } else {
                    this.toastrService.info('A táblázatokból ellenőrizheti a szükséges alkatrészek mennyiségét.', 'Figyelem');
                    this.toastrService.error('Nincs elegendő alkatrész a raktárban a kamionhoz!', 'Hiba');
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
                        this.toastrService.success('Új bicikli sikeresen létrehozva!', 'Siker');
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
                  } else {
                    this.toastrService.info('A táblázatokból ellenőrizheti a szükséges alkatrészek mennyiségét.', 'Figyelem');
                    this.toastrService.error('Nincs elegendő alkatrész a raktárban a biciklihez!', 'Hiba');
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
                        this.toastrService.success('Új csavarkészlet sikeresen létrehozva!', 'Siker');
                        this.warehouseService.updateQuantity('M2-es csavar', 10*gyCount).subscribe({
                          next: () => {},
                          error: (err) => {
                            console.error(err);
                            this.toastrService.error('Hiba történt az M2-es csava raktári egység frissítésekor.', 'Hiba');
                          }
                        });
                        this.warehouseService.updateQuantity('M6-os csavar', 10*gyCount).subscribe({
                          next: () => {},
                          error: (err) => {
                            console.error(err);
                            this.toastrService.error('Hiba történt az M6-os csava raktári egység frissítésekor.', 'Hiba');
                          }
                        });
                        this.warehouseService.updateQuantity('M12-es csavar', 10*gyCount).subscribe({
                          next: () => {},
                          error: (err) => {
                            console.error(err);
                            this.toastrService.error('Hiba történt az M12-es csava raktári egység frissítésekor.', 'Hiba');
                          }
                        });
                      },
                      error: (err) => {
                        console.error(err);
                        this.toastrService.error('Hiba történt a létrehozáskor.', 'Hiba');
                      }
                    });
                  } else {
                    this.toastrService.info('A táblázatokból ellenőrizheti a szükséges alkatrészek mennyiségét.', 'Figyelem');
                    this.toastrService.error('Nincs elegendő alkatrész a raktárban a csavarkészlethez!', 'Hiba');
                  }
                });
              });
            });
          }



    } else {
      this.toastrService.info('Kérlek ne hagyj üresen mezőt, mert így nem kerül felvételre gyártmány.');
    }
  }
}
