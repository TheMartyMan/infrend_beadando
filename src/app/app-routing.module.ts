import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WarehouseComponent } from './warehouse/warehouse.component';
import { WarehouseListComponent } from './warehouse-list/warehouse-list.component';
import { ManufacturingComponent } from './manufacturing/manufacturing.component';
import { ManufacturingListComponent } from './manufacturing-list/manufacturing-list.component';
import { OrderComponent } from './order/order.component';
import { OrderListComponent } from './order-list/order-list.component';

const routes: Routes = [
  {
    path: 'warehouse',
    component: WarehouseComponent
  },

  {
    path: 'warehouse-list',
    component: WarehouseListComponent
  },

  {
    path: 'manufacturing',
    component: ManufacturingComponent
  },

  {
    path: 'manufacturing-list',
    component: ManufacturingListComponent
  },

  {
    path: 'order',
    component: OrderComponent
  },

  {
    path: 'order-list',
    component: OrderListComponent
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
