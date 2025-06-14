
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { 
  ShoppingCart, 
  Package, 
  Users, 
  FileText, 
  UserCheck, 
  BarChart3,
  Home
} from 'lucide-react';

const Navigation = () => {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Dashboard', icon: Home },
    { path: '/products', label: 'Products', icon: Package },
    { path: '/pos', label: 'POS', icon: ShoppingCart },
    { path: '/orders', label: 'Orders', icon: FileText },
    { path: '/customers', label: 'Customers', icon: Users },
    { path: '/employees', label: 'Employees', icon: UserCheck },
    { path: '/reports', label: 'Reports', icon: BarChart3 },
  ];

  return (
    <nav className="bg-white shadow-lg border-b">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <span className="text-2xl font-bold text-green-600">Cannabis POS</span>
          </div>
          <div className="flex space-x-8">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors",
                    location.pathname === item.path
                      ? "border-green-500 text-green-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  )}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
