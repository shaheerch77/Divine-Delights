export interface OrderItem {
  productId: string;
  quantity: number;
  price: number;
  name: string;
  image: string;
}

export interface Order {
  _id?: string;
  orderNumber: string;
  userId?: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  paymentMethod: 'cash' | 'card' | 'online';
  orderType: 'delivery' | 'pickup';
  deliveryAddress?: string;
  pickupTime?: string;
  specialInstructions?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CustomCakeRequest {
  _id?: string;
  name: string;
  email: string;
  phone: string;
  cakeType: string;
  flavor: string;
  size: string;
  occasion: string;
  designDescription: string;
  deliveryDate: string;
  budget: number;
  status: 'pending' | 'reviewing' | 'approved' | 'rejected' | 'completed';
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}