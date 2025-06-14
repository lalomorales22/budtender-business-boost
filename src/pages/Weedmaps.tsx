
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Download, Edit, Trash2, MapPin } from 'lucide-react';
import { insertWeedmapsProduct, getAllWeedmapsProducts, updateWeedmapsProduct, deleteWeedmapsProduct } from '@/lib/database';
import { useToast } from '@/hooks/use-toast';

interface WeedmapsProduct {
  id: number;
  weedmaps_id?: string;
  name: string;
  description?: string;
  published: boolean;
  external_id?: string;
  picture?: string;
  featured: boolean;
  category?: string;
  tags?: string;
  strain?: string;
  genetics?: string;
  gallery_images?: string;
  cbd_percentage?: number;
  thc_percentage?: number;
  created_at: string;
}

const Weedmaps = () => {
  const [products, setProducts] = useState<WeedmapsProduct[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<WeedmapsProduct | null>(null);
  const [formData, setFormData] = useState({
    weedmaps_id: '',
    name: '',
    description: '',
    published: true,
    external_id: '',
    picture: '',
    featured: false,
    category: '',
    tags: '',
    strain: '',
    genetics: '',
    gallery_images: '',
    cbd_percentage: 0,
    thc_percentage: 0,
  });
  const { toast } = useToast();

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = () => {
    try {
      const allProducts = getAllWeedmapsProducts() as WeedmapsProduct[];
      setProducts(allProducts);
    } catch (error) {
      console.error('Error loading Weedmaps products:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      weedmaps_id: '',
      name: '',
      description: '',
      published: true,
      external_id: '',
      picture: '',
      featured: false,
      category: '',
      tags: '',
      strain: '',
      genetics: '',
      gallery_images: '',
      cbd_percentage: 0,
      thc_percentage: 0,
    });
    setEditingProduct(null);
    setIsFormOpen(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingProduct) {
        updateWeedmapsProduct(editingProduct.id, formData);
        toast({
          title: "Product Updated",
          description: "Weedmaps product has been updated successfully."
        });
      } else {
        insertWeedmapsProduct(formData);
        toast({
          title: "Product Added",
          description: "New Weedmaps product has been added successfully."
        });
      }
      
      loadProducts();
      resetForm();
    } catch (error) {
      console.error('Error saving product:', error);
      toast({
        title: "Error",
        description: "Failed to save product.",
        variant: "destructive"
      });
    }
  };

  const handleEdit = (product: WeedmapsProduct) => {
    setFormData({
      weedmaps_id: product.weedmaps_id || '',
      name: product.name,
      description: product.description || '',
      published: product.published,
      external_id: product.external_id || '',
      picture: product.picture || '',
      featured: product.featured,
      category: product.category || '',
      tags: product.tags || '',
      strain: product.strain || '',
      genetics: product.genetics || '',
      gallery_images: product.gallery_images || '',
      cbd_percentage: product.cbd_percentage || 0,
      thc_percentage: product.thc_percentage || 0,
    });
    setEditingProduct(product);
    setIsFormOpen(true);
  };

  const handleDelete = (id: number) => {
    try {
      deleteWeedmapsProduct(id);
      loadProducts();
      toast({
        title: "Product Deleted",
        description: "Weedmaps product has been deleted successfully."
      });
    } catch (error) {
      console.error('Error deleting product:', error);
      toast({
        title: "Error",
        description: "Failed to delete product.",
        variant: "destructive"
      });
    }
  };

  const exportToCSV = () => {
    if (products.length === 0) {
      toast({
        title: "No Data",
        description: "No products to export.",
        variant: "destructive"
      });
      return;
    }

    const headers = [
      'weedmaps_id', 'name', 'description', 'published', 'external_id', 
      'picture', 'featured', 'category', 'tags', 'strain', 'genetics', 
      'gallery_images', 'cbd_percentage', 'thc_percentage', 'created_at'
    ];

    const csvData = products.map(product => [
      product.weedmaps_id || '',
      product.name,
      product.description || '',
      product.published,
      product.external_id || '',
      product.picture || '',
      product.featured,
      product.category || '',
      product.tags || '',
      product.strain || '',
      product.genetics || '',
      product.gallery_images || '',
      product.cbd_percentage || '',
      product.thc_percentage || '',
      product.created_at
    ]);

    const csvContent = [
      headers.join(','),
      ...csvData.map(row => 
        row.map(cell => {
          const value = String(cell);
          if (value.includes(',') || value.includes('"')) {
            return `"${value.replace(/"/g, '""')}"`;
          }
          return value;
        }).join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `weedmaps_products_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Export Successful",
      description: "Weedmaps CSV has been downloaded successfully."
    });
  };

  const categories = [
    'Flower', 'Edibles', 'Concentrates', 'Topicals', 'Tinctures', 
    'Pre-Rolls', 'Vaporizers', 'Accessories', 'Seeds', 'Clones'
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <MapPin className="w-8 h-8 text-green-600" />
          <div>
            <h1 className="text-3xl font-bold">Weedmaps Integration</h1>
            <p className="text-gray-600">Manage your Weedmaps product catalog</p>
          </div>
        </div>
        <div className="flex gap-3">
          <Button onClick={exportToCSV} variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
          <Button onClick={() => setIsFormOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Product
          </Button>
        </div>
      </div>

      {/* Product Form */}
      {isFormOpen && (
        <Card>
          <CardHeader>
            <CardTitle>
              {editingProduct ? 'Edit Weedmaps Product' : 'Add New Weedmaps Product'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="weedmaps_id">Weedmaps ID</Label>
                  <Input
                    id="weedmaps_id"
                    value={formData.weedmaps_id}
                    onChange={(e) => setFormData({...formData, weedmaps_id: e.target.value})}
                    placeholder="Optional Weedmaps ID"
                  />
                </div>
                
                <div>
                  <Label htmlFor="name">Product Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="Product name"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="external_id">External ID</Label>
                  <Input
                    id="external_id"
                    value={formData.external_id}
                    onChange={(e) => setFormData({...formData, external_id: e.target.value})}
                    placeholder="Your internal product ID"
                  />
                </div>

                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="strain">Strain</Label>
                  <Input
                    id="strain"
                    value={formData.strain}
                    onChange={(e) => setFormData({...formData, strain: e.target.value})}
                    placeholder="e.g., Indica, Sativa, Hybrid"
                  />
                </div>

                <div>
                  <Label htmlFor="genetics">Genetics</Label>
                  <Input
                    id="genetics"
                    value={formData.genetics}
                    onChange={(e) => setFormData({...formData, genetics: e.target.value})}
                    placeholder="Strain genetics"
                  />
                </div>

                <div>
                  <Label htmlFor="thc_percentage">THC %</Label>
                  <Input
                    id="thc_percentage"
                    type="number"
                    step="0.01"
                    value={formData.thc_percentage}
                    onChange={(e) => setFormData({...formData, thc_percentage: parseFloat(e.target.value) || 0})}
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <Label htmlFor="cbd_percentage">CBD %</Label>
                  <Input
                    id="cbd_percentage"
                    type="number"
                    step="0.01"
                    value={formData.cbd_percentage}
                    onChange={(e) => setFormData({...formData, cbd_percentage: parseFloat(e.target.value) || 0})}
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Product description"
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="tags">Tags</Label>
                <Input
                  id="tags"
                  value={formData.tags}
                  onChange={(e) => setFormData({...formData, tags: e.target.value})}
                  placeholder="Comma-separated tags"
                />
              </div>

              <div>
                <Label htmlFor="picture">Picture URL</Label>
                <Input
                  id="picture"
                  value={formData.picture}
                  onChange={(e) => setFormData({...formData, picture: e.target.value})}
                  placeholder="Main product image URL"
                />
              </div>

              <div>
                <Label htmlFor="gallery_images">Gallery Images</Label>
                <Input
                  id="gallery_images"
                  value={formData.gallery_images}
                  onChange={(e) => setFormData({...formData, gallery_images: e.target.value})}
                  placeholder="Comma-separated image URLs"
                />
              </div>

              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="published"
                    checked={formData.published}
                    onCheckedChange={(checked) => setFormData({...formData, published: checked})}
                  />
                  <Label htmlFor="published">Published</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="featured"
                    checked={formData.featured}
                    onCheckedChange={(checked) => setFormData({...formData, featured: checked})}
                  />
                  <Label htmlFor="featured">Featured</Label>
                </div>
              </div>

              <div className="flex gap-3">
                <Button type="submit">
                  {editingProduct ? 'Update Product' : 'Add Product'}
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Products Table */}
      <Card>
        <CardHeader>
          <CardTitle>Weedmaps Products ({products.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {products.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Strain</TableHead>
                    <TableHead>THC%</TableHead>
                    <TableHead>CBD%</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell className="font-medium">{product.name}</TableCell>
                      <TableCell>{product.category}</TableCell>
                      <TableCell>{product.strain}</TableCell>
                      <TableCell>{product.thc_percentage}%</TableCell>
                      <TableCell>{product.cbd_percentage}%</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          {product.published && (
                            <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                              Published
                            </span>
                          )}
                          {product.featured && (
                            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                              Featured
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEdit(product)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDelete(product.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <MapPin className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No Weedmaps products yet. Add your first product to get started!</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Weedmaps;
