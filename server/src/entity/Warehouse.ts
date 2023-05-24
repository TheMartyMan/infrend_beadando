import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { WarehouseItem } from '../../../models/warehouse-item';

@Entity()
export class Warehouse implements WarehouseItem {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'text' })
    name: string;

    @Column({ type: 'int', nullable: true })
    stockNumber: number;

    @Column({ type: 'date' })
    dateAdded: Date;

    @Column()
    quantity: number;
}