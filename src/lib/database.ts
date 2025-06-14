
// Browser-compatible database using localStorage
interface DatabaseResult {
  lastInsertRowid: number;
  changes: number;
}

// In-memory database simulation using localStorage
let isInitialized = false;

export const initDatabase = () => {
  if (isInitialized) return true;

  // Initialize empty tables if they don't exist
  const tables = ['products', 'customers', 'employees', 'orders', 'order_items', 'inventory_transactions'];
  
  tables.forEach(table => {
    if (!localStorage.getItem(table)) {
      localStorage.setItem(table, JSON.stringify([]));
    }
  });

  // Initialize ID counters
  tables.forEach(table => {
    if (!localStorage.getItem(`${table}_counter`)) {
      localStorage.setItem(`${table}_counter`, '0');
    }
  });

  console.log('Database initialized successfully');
  isInitialized = true;
  return true;
};

export const getDatabase = () => {
  if (!isInitialized) {
    return initDatabase();
  }
  return true;
};

// Helper functions
const getNextId = (table: string): number => {
  const currentId = parseInt(localStorage.getItem(`${table}_counter`) || '0');
  const nextId = currentId + 1;
  localStorage.setItem(`${table}_counter`, nextId.toString());
  return nextId;
};

const getCurrentTimestamp = (): string => {
  return new Date().toISOString();
};

// Product operations
export const insertProduct = (product: {
  name: string;
  description?: string;
  price: number;
  stock_quantity: number;
  category?: string;
  strain_type?: string;
  thc_content?: number;
  cbd_content?: number;
  image_url?: string;
}): DatabaseResult => {
  const products = JSON.parse(localStorage.getItem('products') || '[]');
  const id = getNextId('products');
  const timestamp = getCurrentTimestamp();
  
  const newProduct = {
    id,
    ...product,
    created_at: timestamp,
    updated_at: timestamp
  };
  
  products.push(newProduct);
  localStorage.setItem('products', JSON.stringify(products));
  
  return { lastInsertRowid: id, changes: 1 };
};

export const getAllProducts = () => {
  const products = JSON.parse(localStorage.getItem('products') || '[]');
  return products.sort((a: any, b: any) => a.name.localeCompare(b.name));
};

export const getProductById = (id: number) => {
  const products = JSON.parse(localStorage.getItem('products') || '[]');
  return products.find((product: any) => product.id === id);
};

export const updateProduct = (id: number, updates: any): DatabaseResult => {
  const products = JSON.parse(localStorage.getItem('products') || '[]');
  const index = products.findIndex((product: any) => product.id === id);
  
  if (index === -1) {
    return { lastInsertRowid: 0, changes: 0 };
  }
  
  products[index] = {
    ...products[index],
    ...updates,
    updated_at: getCurrentTimestamp()
  };
  
  localStorage.setItem('products', JSON.stringify(products));
  return { lastInsertRowid: id, changes: 1 };
};

export const deleteProduct = (id: number): DatabaseResult => {
  const products = JSON.parse(localStorage.getItem('products') || '[]');
  const filteredProducts = products.filter((product: any) => product.id !== id);
  
  if (products.length === filteredProducts.length) {
    return { lastInsertRowid: 0, changes: 0 };
  }
  
  localStorage.setItem('products', JSON.stringify(filteredProducts));
  return { lastInsertRowid: id, changes: 1 };
};

// Future: Customer operations
export const insertCustomer = (customer: any): DatabaseResult => {
  const customers = JSON.parse(localStorage.getItem('customers') || '[]');
  const id = getNextId('customers');
  const timestamp = getCurrentTimestamp();
  
  const newCustomer = {
    id,
    ...customer,
    created_at: timestamp,
    updated_at: timestamp
  };
  
  customers.push(newCustomer);
  localStorage.setItem('customers', JSON.stringify(customers));
  
  return { lastInsertRowid: id, changes: 1 };
};

export const getAllCustomers = () => {
  return JSON.parse(localStorage.getItem('customers') || '[]');
};

// Order operations
export const insertOrder = (order: any): DatabaseResult => {
  const orders = JSON.parse(localStorage.getItem('orders') || '[]');
  const id = getNextId('orders');
  const timestamp = getCurrentTimestamp();
  
  const newOrder = {
    id,
    ...order,
    created_at: timestamp
  };
  
  orders.push(newOrder);
  localStorage.setItem('orders', JSON.stringify(orders));
  
  return { lastInsertRowid: id, changes: 1 };
};

export const getAllOrders = () => {
  return JSON.parse(localStorage.getItem('orders') || '[]');
};

// Order Items operations
export const insertOrderItem = (orderItem: {
  order_id: number;
  product_id: number;
  quantity: number;
  unit_price: number;
  total_price: number;
}): DatabaseResult => {
  const orderItems = JSON.parse(localStorage.getItem('order_items') || '[]');
  const id = getNextId('order_items');
  
  const newOrderItem = {
    id,
    ...orderItem
  };
  
  orderItems.push(newOrderItem);
  localStorage.setItem('order_items', JSON.stringify(orderItems));
  
  return { lastInsertRowid: id, changes: 1 };
};

export const getOrderItemsByOrderId = (orderId: number) => {
  const orderItems = JSON.parse(localStorage.getItem('order_items') || '[]');
  return orderItems.filter((item: any) => item.order_id === orderId);
};

export const getAllOrderItems = () => {
  return JSON.parse(localStorage.getItem('order_items') || '[]');
};
