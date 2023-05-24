import express from 'express';
import { UserController } from './controller/user.controller';
import { WarehouseController } from './controller/warehouse.controller';
import { ManufacturingController } from './controller/manufacturing.controller';
import { OrderController } from './controller/order.controller';

export function getRoutes() {
    const router = express.Router();


    const userController = new UserController();

    router.get('/user', userController.getAll);
    router.get('/user/:id', userController.getOne);
    router.post('/user', userController.create);
    router.put('/user', userController.update);
    router.delete('/user/:id', userController.delete);


    const warehouseController = new WarehouseController();


    router.get('/warehouse', warehouseController.getAll);
    router.get('/warehouse/:id', warehouseController.getOne);
    router.post('/warehouse', warehouseController.create);
    router.put('/warehouse', warehouseController.update);
    router.delete('/warehouse/:id', warehouseController.delete);


    const manufacturingController = new ManufacturingController();

    router.get('/manufacturing', manufacturingController.getAll);
    router.get('/manufacturing/:id', manufacturingController.getOne);
    router.post('/manufacturing', manufacturingController.create);
    router.put('/manufacturing', manufacturingController.update);
    router.delete('/manufacturing/:id', manufacturingController.delete);


    const orderController = new OrderController();

    router.get('/order', orderController.getAll);
    router.get('/order/:id', orderController.getOne);
    router.post('/order', orderController.create);
    router.put('/order', orderController.update);
    router.delete('/order/:id', orderController.delete);



    return router;
}