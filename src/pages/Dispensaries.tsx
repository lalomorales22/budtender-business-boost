
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Search, MapPin, Phone, Clock, Building, Plus, Edit, Trash2 } from 'lucide-react';
import { Dispensary } from '@/types';
import { getAllDispensaries, insertDispensary, updateDispensary, deleteDispensary, initDatabase } from '@/lib/database';
import DispensaryForm from '@/components/DispensaryForm';
import { useToast } from '@/hooks/use-toast';

const Dispensaries = () => {
  const [dispensaries, setDispensaries] = useState<Dispensary[]>([]);
  const [filteredDispensaries, setFilteredDispensaries] = useState<Dispensary[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingDispensary, setEditingDispensary] = useState<Dispensary | undefined>();
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [dispensaryToDelete, setDispensaryToDelete] = useState<number | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    initDatabase();
    loadDispensaries();
  }, []);

  useEffect(() => {
    const filtered = dispensaries.filter(dispensary =>
      dispensary.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dispensary.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dispensary.address.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredDispensaries(filtered);
  }, [dispensaries, searchTerm]);

  const loadDispensaries = () => {
    const data = getAllDispensaries();
    setDispensaries(data);
  };

  const handleAddDispensary = (dispensaryData: Omit<Dispensary, 'id' | 'created_at' | 'updated_at'>) => {
    const result = insertDispensary(dispensaryData);
    if (result.changes > 0) {
      loadDispensaries();
      toast({
        title: "Success",
        description: "Dispensary added successfully",
      });
    }
  };

  const handleEditDispensary = (dispensaryData: Omit<Dispensary, 'id' | 'created_at' | 'updated_at'>) => {
    if (editingDispensary) {
      const result = updateDispensary(editingDispensary.id, dispensaryData);
      if (result.changes > 0) {
        loadDispensaries();
        setEditingDispensary(undefined);
        toast({
          title: "Success",
          description: "Dispensary updated successfully",
        });
      }
    }
  };

  const handleDeleteDispensary = () => {
    if (dispensaryToDelete) {
      const result = deleteDispensary(dispensaryToDelete);
      if (result.changes > 0) {
        loadDispensaries();
        toast({
          title: "Success",
          description: "Dispensary deleted successfully",
        });
      }
      setDispensaryToDelete(null);
      setDeleteConfirmOpen(false);
    }
  };

  const confirmDelete = (id: number) => {
    setDispensaryToDelete(id);
    setDeleteConfirmOpen(true);
  };

  const openEditForm = (dispensary: Dispensary) => {
    setEditingDispensary(dispensary);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingDispensary(undefined);
  };

  const getStatusBadge = (status: string) => {
    const statusColors: { [key: string]: 'default' | 'secondary' | 'destructive' } = {
      Active: 'default',
      Pending: 'secondary',
      Closed: 'destructive'
    };
    return <Badge variant={statusColors[status] || 'secondary'}>{status}</Badge>;
  };

  const activeDispensaries = dispensaries.filter(d => d.status === 'Active').length;
  const pendingDispensaries = dispensaries.filter(d => d.status === 'Pending').length;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">California Dispensaries</h1>
        <Button onClick={() => setIsFormOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Dispensary
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Dispensaries</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dispensaries.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active</CardTitle>
            <Badge variant="default" className="h-4 w-4 rounded-full p-0" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{activeDispensaries}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Badge variant="secondary" className="h-4 w-4 rounded-full p-0" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{pendingDispensaries}</div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="relative w-64">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          placeholder="Search dispensaries..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Dispensaries Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDispensaries.map(dispensary => (
          <Card key={dispensary.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">{dispensary.name}</CardTitle>
                <div className="flex gap-2">
                  {getStatusBadge(dispensary.status)}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => openEditForm(dispensary)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => confirmDelete(dispensary.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <MapPin className="w-4 h-4" />
                <span>{dispensary.address}, {dispensary.city}</span>
              </div>
              
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Phone className="w-4 h-4" />
                <span>{dispensary.phone}</span>
              </div>
              
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Clock className="w-4 h-4" />
                <span>{dispensary.hours}</span>
              </div>
              
              <div className="pt-2 border-t">
                <span className="text-xs text-gray-500">License: {dispensary.license}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredDispensaries.length === 0 && (
        <div className="text-center py-12">
          <Building className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <p className="text-gray-500 text-lg">No dispensaries found</p>
          <p className="text-gray-400">Try adjusting your search criteria</p>
        </div>
      )}

      {/* Form Dialog */}
      <DispensaryForm
        dispensary={editingDispensary}
        isOpen={isFormOpen}
        onClose={closeForm}
        onSubmit={editingDispensary ? handleEditDispensary : handleAddDispensary}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Dispensary</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this dispensary? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteDispensary}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Dispensaries;

