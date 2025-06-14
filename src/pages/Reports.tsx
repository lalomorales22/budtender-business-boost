import { useEffect, useState } from 'react';
import { getAllProducts, getAllOrders } from '@/lib/database';
import { Product, Order } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { TrendingUp, DollarSign, Package, ShoppingCart, Calendar, FileExport } from 'lucide-react';
import { exportProducts, exportOrders, exportOrderItems, exportCustomers, exportAllData } from '@/utils/exportUtils';
import { useToast } from '@/hooks/use-toast';

const Reports = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [timeframe, setTimeframe] = useState('week');
  const { toast } = useToast();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    try {
      const allProducts = getAllProducts() as Product[];
      const allOrders = getAllOrders() as Order[];
      setProducts(allProducts);
      setOrders(allOrders);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const handleExport = (type: string, format: 'csv' | 'json') => {
    try {
      switch (type) {
        case 'products':
          exportProducts(format);
          break;
        case 'orders':
          exportOrders(format);
          break;
        case 'order_items':
          exportOrderItems(format);
          break;
        case 'customers':
          exportCustomers(format);
          break;
        case 'all':
          exportAllData(format);
          break;
        default:
          return;
      }
      
      toast({
        title: "Export Successful",
        description: `${type} data exported as ${format.toUpperCase()}`
      });
    } catch (error) {
      console.error('Export error:', error);
      toast({
        title: "Export Failed",
        description: "There was an error exporting the data",
        variant: "destructive"
      });
    }
  };

  // Sales by day for the past week
  const getSalesData = () => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dayOrders = orders.filter(order => 
        new Date(order.created_at).toDateString() === date.toDateString()
      );
      
      days.push({
        name: date.toLocaleDateString('en-US', { weekday: 'short' }),
        sales: dayOrders.reduce((sum, order) => sum + order.total_amount, 0),
        orders: dayOrders.length
      });
    }
    return days;
  };

  // Product category distribution
  const getCategoryData = () => {
    const categories = products.reduce((acc, product) => {
      const category = product.category || 'Other';
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {} as { [key: string]: number });

    return Object.entries(categories).map(([name, value]) => ({ name, value }));
  };

  // Top selling products (mock data since we don't track individual product sales yet)
  const getTopProducts = () => {
    return products
      .sort((a, b) => (b.stock_quantity || 0) - (a.stock_quantity || 0))
      .slice(0, 5)
      .map(product => ({
        name: product.name,
        sales: Math.floor(Math.random() * 100) + 20, // Mock sales data
        revenue: (Math.floor(Math.random() * 100) + 20) * product.price
      }));
  };

  // Low stock products
  const getLowStockProducts = () => {
    return products.filter(product => product.stock_quantity < 10);
  };

  const salesData = getSalesData();
  const categoryData = getCategoryData();
  const topProducts = getTopProducts();
  const lowStockProducts = getLowStockProducts();

  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#8dd1e1'];

  const totalRevenue = orders.reduce((sum, order) => sum + order.total_amount, 0);
  const totalOrders = orders.length;
  const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Reports & Analytics</h1>
        <div className="flex gap-4">
          <Select value={timeframe} onValueChange={setTimeframe}>
            <SelectTrigger className="w-40">
              <Calendar className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Export Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileExport className="w-5 h-5" />
            Export Data
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="space-y-2">
              <p className="text-sm font-medium">Products</p>
              <div className="flex gap-1">
                <Button size="sm" variant="outline" onClick={() => handleExport('products', 'csv')}>
                  CSV
                </Button>
                <Button size="sm" variant="outline" onClick={() => handleExport('products', 'json')}>
                  JSON
                </Button>
              </div>
            </div>
            
            <div className="space-y-2">
              <p className="text-sm font-medium">Orders</p>
              <div className="flex gap-1">
                <Button size="sm" variant="outline" onClick={() => handleExport('orders', 'csv')}>
                  CSV
                </Button>
                <Button size="sm" variant="outline" onClick={() => handleExport('orders', 'json')}>
                  JSON
                </Button>
              </div>
            </div>
            
            <div className="space-y-2">
              <p className="text-sm font-medium">Order Items</p>
              <div className="flex gap-1">
                <Button size="sm" variant="outline" onClick={() => handleExport('order_items', 'csv')}>
                  CSV
                </Button>
                <Button size="sm" variant="outline" onClick={() => handleExport('order_items', 'json')}>
                  JSON
                </Button>
              </div>
            </div>
            
            <div className="space-y-2">
              <p className="text-sm font-medium">Customers</p>
              <div className="flex gap-1">
                <Button size="sm" variant="outline" onClick={() => handleExport('customers', 'csv')}>
                  CSV
                </Button>
                <Button size="sm" variant="outline" onClick={() => handleExport('customers', 'json')}>
                  JSON
                </Button>
              </div>
            </div>
            
            <div className="space-y-2">
              <p className="text-sm font-medium">Complete Database</p>
              <div className="flex gap-1">
                <Button size="sm" variant="outline" onClick={() => handleExport('all', 'csv')}>
                  CSV
                </Button>
                <Button size="sm" variant="outline" onClick={() => handleExport('all', 'json')}>
                  JSON
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalRevenue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline w-3 h-3 mr-1" />
              +20.1% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalOrders}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline w-3 h-3 mr-1" />
              +12% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Order Value</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${averageOrderValue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline w-3 h-3 mr-1" />
              +5.2% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Products in Stock</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{products.length}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-orange-600">{lowStockProducts.length} low stock</span>
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Daily Sales</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => [`$${value}`, 'Sales']} />
                <Bar dataKey="sales" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Category Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Product Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Top Products and Low Stock */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Products */}
        <Card>
          <CardHeader>
            <CardTitle>Top Selling Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topProducts.map((product, index) => (
                <div key={product.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                      <span className="text-sm font-bold">#{index + 1}</span>
                    </div>
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-gray-500">{product.sales} units sold</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">${product.revenue.toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Low Stock Alert */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="w-5 h-5 text-orange-600" />
              Low Stock Alert
            </CardTitle>
          </CardHeader>
          <CardContent>
            {lowStockProducts.length > 0 ? (
              <div className="space-y-3">
                {lowStockProducts.slice(0, 5).map(product => (
                  <div key={product.id} className="flex items-center justify-between p-3 border rounded">
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-gray-500">{product.category}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-orange-600 font-semibold">
                        {product.stock_quantity} left
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">All products are well stocked!</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Reports;
