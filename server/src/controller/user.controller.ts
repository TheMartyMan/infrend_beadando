import { DatabaseData } from "../data-source";
import { User } from "../entity/User";
import { Controller } from "./base.controller";

import bcrypt from 'bcrypt';

export class UserController extends Controller {
    repository = DatabaseData.getRepository(User);

    create = async (req, res) => {
        try {
            const entity = this.repository.create(req.body as object);
            entity.id = null;

            entity.password = await bcrypt.hash(entity.password, 12);

            const result = await this.repository.save(entity);
            delete result.password;
            
            res.json(result);
        } catch (err) {
            this.handleError(res, err);
        }
    };
}