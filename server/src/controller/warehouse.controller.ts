import { DatabaseData } from "../data-source";
import { Controller } from "./base.controller";
import { Warehouse } from "../entity/Warehouse";

export class WarehouseController extends Controller {

    repository = DatabaseData.getRepository(Warehouse);

}