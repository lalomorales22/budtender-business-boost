
import { useEffect, useState } from 'react';
import { getAllProducts } from '@/lib/database';
import { Product, CartItem } from '@/types';
import ProductCard from '@/components/ProductCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Trash2, Plus, Minus, CreditCard, DollarSign } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const POS = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'credit'>('cash');
  const { toast } = useToast();

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = () => {
    try {
      const allProducts = getAllProducts() as Product[];
      setProducts(allProducts.filter(p => p.stock_quantity > 0));
    } catch (error) {
      console.error('Error loading products:', error);
    }
  };

  const addToCart = (product: Product) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.product.id === product.id);
      if (existingItem) {
        if (existingItem.quantity < product.stock_quantity) {
          return prevCart.map(item =>
            item.product.id === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          );
        } else {
          toast({
            title: "Stock Limit",
            description: "Cannot add more items than available in stock",
            variant: "destructive"
          });
          return prevCart;
        }
      } else {
        return [...prevCart, { product, quantity: 1 }];
      }
    });
  };

  const updateQuantity = (productId: number, newQuantity: number) => {
    if (newQuantity === 0) {
      removeFromCart(productId);
      return;
    }
    
    setCart(prevCart =>
      prevCart.map(item =>
        item.product.id === productId
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  const removeFromCart = (productId: number) => {
    setCart(prevCart => prevCart.filter(item => item.product.id !== productId));
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  };

  const handleCheckout = () => {
    if (cart.length === 0) {
      toast({
        title: "Empty Cart",
        description: "Please add items to cart before checkout",
        variant: "destructive"
      });
      return;
    }

    // TODO: Process payment and create order
    toast({
      title: "Checkout Successful",
      description: `Order processed with ${paymentMethod} payment`
    });
    
    setCart([]);
    loadProducts(); // Refresh products to update stock
  };

  return (
    <div className="flex gap-6 h-[calc(100vh-120px)]">
      {/* Products Section */}
      <div className="flex-1 overflow-y-auto">
        <h1 className="text-3xl font-bold mb-6">Point of Sale</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={addToCart}
              showActions={false}
            />
          ))}
        </div>
      </div>

      {/* Cart Section */}
      <div className="w-96 bg-white border-l">
        <Card className="h-full flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="w-5 h-5" />
              Cart ({cart.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col">
            <div className="flex-1 overflow-y-auto space-y-3">
              {cart.map(item => (
                <div key={item.product.id} className="flex items-center gap-3 p-3 border rounded">
                  <div className="flex-1">
                    <h4 className="font-medium">{item.product.name}</h4>
                    <p className="text-sm text-gray-500">${item.product.price.toFixed(2)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      size="icon"
                      variant="outline"
                      className="h-8 w-8"
                      onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                    >
                      <Minus className="w-3 h-3" />
                    </Button>
                    <span className="w-8 text-center">{item.quantity}</span>
                    <Button
                      size="icon"
                      variant="outline"
                      className="h-8 w-8"
                      onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                      disabled={item.quantity >= item.product.stock_quantity}
                    >
                      <Plus className="w-3 h-3" />
                    </Button>
                  </div>
                  <Button
                    size="icon"
                    variant="destructive"
                    className="h-8 w-8"
                    onClick={() => removeFromCart(item.product.id)}
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              ))}
            </div>

            {/* Checkout Section */}
            <div className="border-t pt-4 space-y-4">
              <div className="flex justify-between text-lg font-bold">
                <span>Total:</span>
                <span>${getCartTotal().toFixed(2)}</span>
              </div>

              <div className="flex gap-2">
                <Button
                  variant={paymentMethod === 'cash' ? 'default' : 'outline'}
                  onClick={() => setPaymentMethod('cash')}
                  className="flex-1"
                >
                  <DollarSign className="w-4 h-4 mr-2" />
                  Cash
                </Button>
                <Button
                  variant={paymentMethod === 'credit' ? 'default' : 'outline'}
                  onClick={() => setPaymentMethod('credit')}
                  className="flex-1"
                >
                  <CreditCard className="w-4 h-4 mr-2" />
                  Credit
                </Button>
              </div>

              <Button
                onClick={handleCheckout}
                className="w-full"
                size="lg"
                disabled={cart.length === 0}
              >
                Complete Sale
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default POS;
