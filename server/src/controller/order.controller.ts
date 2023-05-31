import { DatabaseData } from "../data-source";
import { Controller } from "./base.controller";
import { Order } from "../entity/Order";

export class OrderController extends Controller {

    repository = DatabaseData.getRepository(Order);

}