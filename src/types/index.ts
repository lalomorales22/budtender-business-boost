
export interface Product {
  id: number;
  name: string;
  description?: string;
  price: number;
  stock_quantity: number;
  category?: string;
  strain_type?: string;
  thc_content?: number;
  cbd_content?: number;
  image_url?: string;
  created_at: string;
  updated_at: string;
}

export interface Customer {
  id: number;
  first_name: string;
  last_name: string;
  email?: string;
  phone?: string;
  date_of_birth?: string;
  license_number?: string;
  address?: string;
  created_at: string;
  updated_at: string;
}

export interface Employee {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  role: string;
  password_hash: string;
  created_at: string;
  updated_at: string;
}

export interface Order {
  id: number;
  customer_id?: number;
  employee_id?: number;
  total_amount: number;
  payment_method: string;
  payment_status: string;
  stripe_payment_id?: string;
  created_at: string;
}

export interface OrderItem {
  id: number;
  order_id: number;
  product_id: number;
  quantity: number;
  unit_price: number;
  total_price: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}
