export interface Product {
  id: string;
  title: string;
  price: number;
  shipping?: number;
  image: string;
  images?: string[]; // Array of additional images for gallery
  category: string;
  description: string;
}

export interface User {
  uid: string;
  email: string;
  displayName: string;
  role: 'user' | 'admin';
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Order {
  id: string;
  userUid: string;
  items: CartItem[];
  total: number;
  createdAt: any;
  status: 'pending' | 'shipped' | 'delivered' | 'cancelled';
}

export interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  total: number;
}