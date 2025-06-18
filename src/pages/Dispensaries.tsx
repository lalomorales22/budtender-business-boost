
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, MapPin, Phone, Clock, Building } from 'lucide-react';

interface Dispensary {
  id: number;
  name: string;
  address: string;
  city: string;
  phone: string;
  hours: string;
  license: string;
  status: 'Active' | 'Pending' | 'Closed';
}

const Dispensaries = () => {
  const [dispensaries, setDispensaries] = useState<Dispensary[]>([]);
  const [filteredDispensaries, setFilteredDispensaries] = useState<Dispensary[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  // Sample California dispensaries data
  const californiaDispensaries: Dispensary[] = [
    {
      id: 1,
      name: "Green Valley Cannabis",
      address: "123 Main St",
      city: "Los Angeles",
      phone: "(323) 555-0101",
      hours: "9:00 AM - 10:00 PM",
      license: "C10-0000123-LIC",
      status: "Active"
    },
    {
      id: 2,
      name: "Golden State Dispensary",
      address: "456 Castro St",
      city: "San Francisco",
      phone: "(415) 555-0202",
      hours: "10:00 AM - 9:00 PM",
      license: "C10-0000456-LIC",
      status: "Active"
    },
    {
      id: 3,
      name: "Pacific Coast Cannabis",
      address: "789 Beach Blvd",
      city: "San Diego",
      phone: "(619) 555-0303",
      hours: "8:00 AM - 11:00 PM",
      license: "C10-0000789-LIC",
      status: "Active"
    },
    {
      id: 4,
      name: "Valley Green Collective",
      address: "321 Valley Rd",
      city: "Sacramento",
      phone: "(916) 555-0404",
      hours: "9:00 AM - 10:00 PM",
      license: "C10-0001234-LIC",
      status: "Pending"
    },
    {
      id: 5,
      name: "Emerald Triangle Cannabis",
      address: "654 Redwood Ave",
      city: "Oakland",
      phone: "(510) 555-0505",
      hours: "10:00 AM - 8:00 PM",
      license: "C10-0005678-LIC",
      status: "Active"
    },
    {
      id: 6,
      name: "Sunset Cannabis Co",
      address: "987 Sunset Blvd",
      city: "West Hollywood",
      phone: "(323) 555-0606",
      hours: "9:00 AM - 11:00 PM",
      license: "C10-0009876-LIC",
      status: "Active"
    }
  ];

  useEffect(() => {
    setDispensaries(californiaDispensaries);
    setFilteredDispensaries(californiaDispensaries);
  }, []);

  useEffect(() => {
    const filtered = dispensaries.filter(dispensary =>
      dispensary.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dispensary.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dispensary.address.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredDispensaries(filtered);
  }, [dispensaries, searchTerm]);

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
                {getStatusBadge(dispensary.status)}
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
    </div>
  );
};

export default Dispensaries;
