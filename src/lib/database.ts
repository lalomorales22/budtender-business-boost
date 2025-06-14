
import Database from 'better-sqlite3';

let db: Database.Database;

export const initDatabase = () => {
  if (db) return db;

  // Create or open database file
  db = new Database('cannabis_pos.db');

  // Create tables
  db.exec(`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      price REAL NOT NULL,
      stock_quantity INTEGER NOT NULL DEFAULT 0,
      category TEXT,
      strain_type TEXT,
      thc_content REAL,
      cbd_content REAL,
      image_url TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS customers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      first_name TEXT NOT NULL,
      last_name TEXT NOT NULL,
      email TEXT UNIQUE,
      phone TEXT,
      date_of_birth DATE,
      license_number TEXT,
      address TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS employees (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      first_name TEXT NOT NULL,
      last_name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      role TEXT NOT NULL,
      password_hash TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      customer_id INTEGER,
      employee_id INTEGER,
      total_amount REAL NOT NULL,
      payment_method TEXT NOT NULL,
      payment_status TEXT DEFAULT 'pending',
      stripe_payment_id TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (customer_id) REFERENCES customers (id),
      FOREIGN KEY (employee_id) REFERENCES employees (id)
    );

    CREATE TABLE IF NOT EXISTS order_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_id INTEGER NOT NULL,
      product_id INTEGER NOT NULL,
      quantity INTEGER NOT NULL,
      unit_price REAL NOT NULL,
      total_price REAL NOT NULL,
      FOREIGN KEY (order_id) REFERENCES orders (id),
      FOREIGN KEY (product_id) REFERENCES products (id)
    );

    CREATE TABLE IF NOT EXISTS inventory_transactions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      product_id INTEGER NOT NULL,
      transaction_type TEXT NOT NULL,
      quantity INTEGER NOT NULL,
      notes TEXT,
      employee_id INTEGER,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (product_id) REFERENCES products (id),
      FOREIGN KEY (employee_id) REFERENCES employees (id)
    );
  `);

  console.log('Database initialized successfully');
  return db;
};

export const getDatabase = () => {
  if (!db) {
    return initDatabase();
  }
  return db;
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
}) => {
  const stmt = db.prepare(`
    INSERT INTO products (name, description, price, stock_quantity, category, strain_type, thc_content, cbd_content, image_url)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  return stmt.run(
    product.name,
    product.description,
    product.price,
    product.stock_quantity,
    product.category,
    product.strain_type,
    product.thc_content,
    product.cbd_content,
    product.image_url
  );
};

export const getAllProducts = () => {
  const stmt = db.prepare('SELECT * FROM products ORDER BY name');
  return stmt.all();
};

export const getProductById = (id: number) => {
  const stmt = db.prepare('SELECT * FROM products WHERE id = ?');
  return stmt.get(id);
};

export const updateProduct = (id: number, updates: any) => {
  const fields = Object.keys(updates).map(key => `${key} = ?`).join(', ');
  const values = Object.values(updates);
  const stmt = db.prepare(`UPDATE products SET ${fields}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`);
  return stmt.run(...values, id);
};

export const deleteProduct = (id: number) => {
  const stmt = db.prepare('DELETE FROM products WHERE id = ?');
  return stmt.run(id);
};
