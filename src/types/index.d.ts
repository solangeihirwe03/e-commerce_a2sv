import { Request } from "express";

export interface ExtendRequest extends Request{
    user? :user;
    product? :article;
    file? : any;
    pagination?: {
        limit: number;
        page: number;
        offset: number;
    };
    searchQuery?: any
    validatedProducts?: any
    orders?:any
}

export interface IProduct {
    id: string;
    userId: string;
    name: string;
    description?: string;
    price: number;
    stock: number;
    category: string;
    images: string;
    createdAt: Date;
    updatedAt: Date;
  }