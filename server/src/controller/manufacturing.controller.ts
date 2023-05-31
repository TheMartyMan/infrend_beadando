import { DatabaseData } from "../data-source";
import { Controller } from "./base.controller";
import { Manufacturing } from "../entity/Manufacturing";

export class ManufacturingController extends Controller {

    repository = DatabaseData.getRepository(Manufacturing);

}