export interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  category: string;
}

export interface Cart {
  userId?: string;
  sessionId?: string;
  items: CartItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  updatedAt: Date;
}