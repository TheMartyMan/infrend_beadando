import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { OrderItem } from '../../../models/order-item';

@Entity()
export class Order implements OrderItem {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'text' })
    customerName: string;

    @Column({ type: 'date' })
    dateOfBirth: Date;

    @Column({ type: 'text' })
    order: string;

    @Column()
    quantity: number;

}