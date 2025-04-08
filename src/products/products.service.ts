import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { Product } from '../entities/product.entity';
import { ObjectId } from 'mongodb';
import { parse } from 'csv-parse';
import { createReadStream } from 'fs';


@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productsRepository: MongoRepository<Product>,
  ) {}

  async create(product: Partial<Product>): Promise<Product> {
    const newProduct = this.productsRepository.create(product);
    return this.productsRepository.save(newProduct);
  }

  async findAll(): Promise<Product[]> {
    return this.productsRepository.find();
  }

  async findOne(id: string): Promise<Product> {
    try {
      const product = await this.productsRepository.findOne({
        where: { _id: new ObjectId(id) }
      });
      if (!product) {
        throw new NotFoundException(`Product #${id} not found`);
      }
      return product;
    } catch (error) {
      if (error.name === 'BSONTypeError') {
        throw new NotFoundException(`Invalid product ID format`);
      }
      throw error;
    }
  }

  async update(id: string, updateData: Partial<Product>): Promise<Product> {
    try {
      const result = await this.productsRepository.updateOne(
        { _id: new ObjectId(id) },
        { $set: updateData }
      );
      
      if (result.matchedCount === 0) {
        throw new NotFoundException(`Product #${id} not found`);
      }
      
      return this.findOne(id);
    } catch (error) {
      if (error.name === 'BSONTypeError') {
        throw new NotFoundException(`Invalid product ID format`);
      }
      throw error;
    }
  }

  async remove(id: string): Promise<void> {
    try {
      const result = await this.productsRepository.deleteOne(
        { _id: new ObjectId(id) }
      );
      if (result.deletedCount === 0) {
        throw new NotFoundException(`Product #${id} not found`);
      }
    } catch (error) {
      if (error.name === 'BSONTypeError') {
        throw new NotFoundException(`Invalid product ID format`);
      }
      throw error;
    }
  }

// products.service.ts
async importProductsFromCSV(filePath: string): Promise<Product[]> {
  const products: Product[] = [];

  return new Promise((resolve, reject) => {
    createReadStream(filePath)
      .pipe(parse({ columns: true }))
      .on('data', (row: Record<string, string>) => {
        products.push({
          productname: row.productname,
          type: row.type as 'Medicine' | 'Surgical',
          category: row.category,
          company: row.company,
          price: parseFloat(row.price.replace('-', '')),
          notes: row.notes,
          // System fields will be auto-set by TypeORM
          _id: undefined!, // Mark as optional
          created: undefined!,
          modified: undefined!
        });
      })
      .on('end', async () => {
        try {
          await this.productsRepository.save(products);
          resolve(products);
        } catch (err) {
          reject(err);
        }
      });
  });
}


}

