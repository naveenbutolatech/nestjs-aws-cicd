import { Injectable, NotFoundException, ConflictException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { User } from '../entities/user.entity';
import { ObjectId } from 'mongodb';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private usersRepository: MongoRepository<User>,
        private jwtService: JwtService,
    ) {}

    async validateUser(emailOrPhone: string): Promise<User | null> {
        const user = await this.usersRepository.findOne({
            where: {
                $or: [
                    { email: emailOrPhone },
                    { phonenumber: emailOrPhone }
                ]
            }
        });

        return user;
    }
    async create(userData: Partial<User>): Promise<User> {
        const existingUser = await this.usersRepository.findOne({ where: { email: userData.email } });
        if (existingUser) {
            throw new ConflictException('Email already in use');
        }

        // Hash the password before saving to the database
        if (userData.password) {
            const salt = await bcrypt.genSalt(10);
            userData.password = await bcrypt.hash(userData.password, salt);
        }

        const user = this.usersRepository.create(userData);
        await this.usersRepository.save(user);
        return user;
    }

    async findAll(): Promise<User[]> {
        return this.usersRepository.find();
    }

    async findByUsername(emailOrPhone: string): Promise<User> {
        const user: User | null = await this.validateUser(emailOrPhone);
        if (!user) {
            throw new NotFoundException('User not found');
          }
        return user;
    }

 
    async update(id: string, updatedData: Partial<User>): Promise<User> {
        const objectId = new ObjectId(id);
        await this.usersRepository.updateOne({ _id: objectId }, { $set: updatedData });
        return this.findOne(id);
    }

    async findOne(id: string): Promise<User> {
        const objectId = new ObjectId(id);
        const user = await this.usersRepository.findOne({ where: { _id: objectId }});
        if (!user) {
            throw new NotFoundException(`User with ID ${id} not found`);
        }
        return user;
    }
    
    async delete(id: string): Promise<void> {
        const objectId = new ObjectId(id);
        const result = await this.usersRepository.delete(objectId);
        if (result.affected === 0) {
            throw new NotFoundException(`User with ID ${id} not found`);
        }
    }
}

