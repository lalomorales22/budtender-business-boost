
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Dispensary } from '@/types';

interface DispensaryFormProps {
  dispensary?: Dispensary;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (dispensaryData: Omit<Dispensary, 'id' | 'created_at' | 'updated_at'>) => void;
}

const DispensaryForm = ({ dispensary, isOpen, onClose, onSubmit }: DispensaryFormProps) => {
  const [formData, setFormData] = useState({
    name: dispensary?.name || '',
    address: dispensary?.address || '',
    city: dispensary?.city || '',
    phone: dispensary?.phone || '',
    hours: dispensary?.hours || '',
    license: dispensary?.license || '',
    status: dispensary?.status || 'Active' as const
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
    setFormData({
      name: '',
      address: '',
      city: '',
      phone: '',
      hours: '',
      license: '',
      status: 'Active'
    });
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{dispensary ? 'Edit Dispensary' : 'Add New Dispensary'}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              value={formData.address}
              onChange={(e) => handleChange('address', e.target.value)}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="city">City</Label>
            <Input
              id="city"
              value={formData.city}
              onChange={(e) => handleChange('city', e.target.value)}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="hours">Hours</Label>
            <Input
              id="hours"
              value={formData.hours}
              onChange={(e) => handleChange('hours', e.target.value)}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="license">License</Label>
            <Input
              id="license"
              value={formData.license}
              onChange={(e) => handleChange('license', e.target.value)}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="status">Status</Label>
            <Select value={formData.status} onValueChange={(value) => handleChange('status', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Closed">Closed</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex gap-2">
            <Button type="submit" className="flex-1">
              {dispensary ? 'Update' : 'Add'} Dispensary
            </Button>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default DispensaryForm;
