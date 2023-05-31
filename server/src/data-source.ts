import "reflect-metadata"
import { DataSource } from "typeorm"
import { Warehouse } from "./entity/Warehouse"
import { Manufacturing } from "./entity/Manufacturing"
import { Order } from "./entity/Order"
import { User } from "./entity/User"

export const DatabaseData = new DataSource({
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "root",
    database: "raktár",
    synchronize: true,
    logging: true,
    entities: [User, Warehouse, Manufacturing, Order],
    migrations: [],
    subscribers: [],
})
