
import { useEffect, useState } from 'react';
import { getAllProducts, initDatabase } from '@/lib/database';
import { Product } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, Users, ShoppingCart, DollarSign } from 'lucide-react';

const Dashboard = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [stats, setStats] = useState({
    totalProducts: 0,
    lowStockProducts: 0,
    totalCustomers: 0,
    todaysSales: 0
  });

  useEffect(() => {
    // Initialize database when app loads
    initDatabase();
    loadStats();
  }, []);

  const loadStats = () => {
    try {
      const allProducts = getAllProducts() as Product[];
      setProducts(allProducts);
      
      const lowStock = allProducts.filter(p => p.stock_quantity < 10);
      
      setStats({
        totalProducts: allProducts.length,
        lowStockProducts: lowStock.length,
        totalCustomers: 0, // Will implement customer count later
        todaysSales: 0 // Will implement sales calculation later
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalProducts}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock Items</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.lowStockProducts}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCustomers}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Sales</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.todaysSales.toFixed(2)}</div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Products */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Products</CardTitle>
        </CardHeader>
        <CardContent>
          {products.length === 0 ? (
            <p className="text-gray-500">No products found. Add your first product to get started!</p>
          ) : (
            <div className="space-y-2">
              {products.slice(0, 5).map(product => (
                <div key={product.id} className="flex justify-between items-center p-2 border rounded">
                  <div>
                    <span className="font-medium">{product.name}</span>
                    <span className="text-sm text-gray-500 ml-2">{product.category}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">${product.price.toFixed(2)}</div>
                    <div className="text-sm text-gray-500">Stock: {product.stock_quantity}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
