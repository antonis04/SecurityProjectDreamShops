export interface ApiResponse<T = unknown> {
  message: string;
  data: T;
}

export interface Category {
  id: number;
  name: string;
}

export interface ImageDto {
  id: number;
  fileName: string;
  downloadUrl: string;
}

export interface Product {
  id: number;
  name: string;
  brand: string;
  price: number;
  inventory: number;
  description: string;
  category: Category;
  images: ImageDto[];
}

export interface CartItem {
  itemId?: number;
  id?: number;
  quantity: number;
  unitPrice: number;
  totalPrice?: number;
  product: Product;
}

export interface Cart {
  cartId?: number;
  id?: number;
  totalAmount: number;
  items: CartItem[];
}

export interface OrderItem {
  productId: number;
  productName: string;
  productBrand: string;
  quantity: number;
  price: number;
}

export interface Order {
  id?: number;
  orderId?: number;
  userId: number;
  orderDate: string;
  totalAmount: number;
  status: string;
  items: OrderItem[];
}

export interface UserDto {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  cart: Cart | null;
  orders: Order[];
}

export interface JwtResponse {
  id: number;
  token: string;
}
