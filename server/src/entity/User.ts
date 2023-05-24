import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { UserItem } from '../../../models/user-items';

@Entity()
export class User implements UserItem {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column({ unique: true })
    email: string;

    @Column({ select: false })
    password: string;
}