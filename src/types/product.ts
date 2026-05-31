export interface Product {
  _id?: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  ingredients: string[];
  isAvailable: boolean;
  createdAt: Date;
  updatedAt: Date;
}