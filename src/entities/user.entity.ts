import { Entity, Column, ObjectId, ObjectIdColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class User {
    @ObjectIdColumn()
    _id: ObjectId;

    @Column()
    firstname: string;

    @Column()
    lastname: string;

    @Column({ unique: true })
    email: string;

    @Column()
    phonenumber: string;

    @Column()
    status: string;

    @Column()
    role: string;

    @Column()
    password: string;

    @Column()
    address: string;

    @Column({ default: 'default.jpg' })
    profileimage: string;

    @Column({ default: 'general' })
    department: string;
    @CreateDateColumn()
    created: Date;

@Column({ nullable: true })
resetPasswordToken?: string;

@Column({ nullable: true })
resetPasswordExpires?: Date;

@UpdateDateColumn()
modified: Date;
}

