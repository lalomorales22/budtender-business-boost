
import { Product } from '@/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Edit, Trash2 } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
  onEdit?: (product: Product) => void;
  onDelete?: (id: number) => void;
  showActions?: boolean;
}

const ProductCard = ({ product, onAddToCart, onEdit, onDelete, showActions = true }: ProductCardProps) => {
  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{product.name}</CardTitle>
          <div className="flex gap-1">
            {product.category && (
              <Badge variant="secondary">{product.category}</Badge>
            )}
            {product.strain_type && (
              <Badge variant="outline">{product.strain_type}</Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {product.image_url && (
          <img 
            src={product.image_url} 
            alt={product.name}
            className="w-full h-48 object-cover rounded-md mb-4"
          />
        )}
        <p className="text-gray-600 text-sm mb-2">{product.description}</p>
        <div className="space-y-1">
          <div className="flex justify-between">
            <span className="font-semibold text-lg">${product.price.toFixed(2)}</span>
            <span className="text-sm text-gray-500">Stock: {product.stock_quantity}</span>
          </div>
          {(product.thc_content || product.cbd_content) && (
            <div className="flex gap-4 text-sm">
              {product.thc_content && (
                <span>THC: {product.thc_content}%</span>
              )}
              {product.cbd_content && (
                <span>CBD: {product.cbd_content}%</span>
              )}
            </div>
          )}
        </div>
      </CardContent>
      {showActions && (
        <CardFooter className="flex gap-2">
          {onAddToCart && (
            <Button 
              onClick={() => onAddToCart(product)}
              className="flex-1"
              disabled={product.stock_quantity === 0}
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              Add to Cart
            </Button>
          )}
          {onEdit && (
            <Button variant="outline" size="icon" onClick={() => onEdit(product)}>
              <Edit className="w-4 h-4" />
            </Button>
          )}
          {onDelete && (
            <Button variant="destructive" size="icon" onClick={() => onDelete(product.id)}>
              <Trash2 className="w-4 h-4" />
            </Button>
          )}
        </CardFooter>
      )}
    </Card>
  );
};

export default ProductCard;
