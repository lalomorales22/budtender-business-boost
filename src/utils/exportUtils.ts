import { getAllProducts, getAllOrders, getAllOrderItems, getAllCustomers, getAllWeedmapsProducts } from '@/lib/database';

export const downloadCSV = (data: any[], filename: string) => {
  if (data.length === 0) return;

  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(','),
    ...data.map(row => 
      headers.map(header => {
        const value = row[header];
        // Handle values that might contain commas or quotes
        if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value || '';
      }).join(',')
    )
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const downloadJSON = (data: any[], filename: string) => {
  const jsonContent = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.json`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const exportProducts = (format: 'csv' | 'json') => {
  const products = getAllProducts();
  const filename = `products_${new Date().toISOString().split('T')[0]}`;
  
  if (format === 'csv') {
    downloadCSV(products, filename);
  } else {
    downloadJSON(products, filename);
  }
};

export const exportOrders = (format: 'csv' | 'json') => {
  const orders = getAllOrders();
  const filename = `orders_${new Date().toISOString().split('T')[0]}`;
  
  if (format === 'csv') {
    downloadCSV(orders, filename);
  } else {
    downloadJSON(orders, filename);
  }
};

export const exportOrderItems = (format: 'csv' | 'json') => {
  const orderItems = getAllOrderItems();
  const filename = `order_items_${new Date().toISOString().split('T')[0]}`;
  
  if (format === 'csv') {
    downloadCSV(orderItems, filename);
  } else {
    downloadJSON(orderItems, filename);
  }
};

export const exportCustomers = (format: 'csv' | 'json') => {
  const customers = getAllCustomers();
  const filename = `customers_${new Date().toISOString().split('T')[0]}`;
  
  if (format === 'csv') {
    downloadCSV(customers, filename);
  } else {
    downloadJSON(customers, filename);
  }
};

export const exportWeedmapsProducts = (format: 'csv' | 'json') => {
  const weedmapsProducts = getAllWeedmapsProducts();
  const filename = `weedmaps_products_${new Date().toISOString().split('T')[0]}`;
  
  if (format === 'csv') {
    downloadCSV(weedmapsProducts, filename);
  } else {
    downloadJSON(weedmapsProducts, filename);
  }
};

export const exportAllData = (format: 'csv' | 'json') => {
  const allData = {
    products: getAllProducts(),
    orders: getAllOrders(),
    order_items: getAllOrderItems(),
    customers: getAllCustomers(),
    weedmaps_products: getAllWeedmapsProducts(),
    exported_at: new Date().toISOString()
  };
  
  const filename = `complete_database_${new Date().toISOString().split('T')[0]}`;
  
  if (format === 'json') {
    downloadJSON([allData], filename);
  } else {
    // For CSV, export each table separately in a zip would be ideal, 
    // but for simplicity, we'll export the largest dataset (orders)
    downloadCSV(allData.orders, filename);
  }
};
