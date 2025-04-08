import { Entity, Column, ObjectIdColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ObjectId } from 'mongodb';

@Entity('products')
export class Product {
    @ObjectIdColumn()
    _id: ObjectId;

    @Column()
    productname: string;

    @Column()
    type: string;

    @Column()
    category: string;

    @Column()
    company: string;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    price: number;

    @Column('text')
    notes: string;

    @CreateDateColumn()
    created: Date;

    @UpdateDateColumn()
    modified: Date;
}
