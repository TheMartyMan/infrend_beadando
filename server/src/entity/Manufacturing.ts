import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ManufacturingItem } from '../../../models/manufacturing-item';

@Entity()
export class Manufacturing implements ManufacturingItem {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'text' })
    manufacturingName: string;

    @Column()
    quantity: number;

}