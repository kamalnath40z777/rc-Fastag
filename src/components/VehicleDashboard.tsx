import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Search, 
  Plus, 
  Download, 
  Edit, 
  Trash2, 
  FileText, 
  Archive,
  Car,
  Filter
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Vehicle } from '@/types/Vehicle';
import { VehicleService } from '@/services/vehicleService';
import { PDFDownloadLink, pdf } from '@react-pdf/renderer';
import VehiclePDF from './VehiclePDF';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

interface VehicleDashboardProps {
  onAddVehicle: () => void;
  onEditVehicle: (vehicle: Vehicle) => void;
}

const VehicleDashboard: React.FC<VehicleDashboardProps> = ({
  onAddVehicle,
  onEditVehicle,
}) => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [filteredVehicles, setFilteredVehicles] = useState<Vehicle[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedVehicles, setSelectedVehicles] = useState<Set<string>>(new Set());
  const [isGeneratingBulk, setIsGeneratingBulk] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadVehicles();
  }, []);

  useEffect(() => {
    filterVehicles();
  }, [vehicles, searchTerm]);

  const loadVehicles = () => {
    const allVehicles = VehicleService.getAllVehicles();
    setVehicles(allVehicles);
  };

  const filterVehicles = () => {
    if (!searchTerm.trim()) {
      setFilteredVehicles(vehicles);
      return;
    }

    const filtered = VehicleService.searchVehicles(searchTerm);
    setFilteredVehicles(filtered);
  };

  const handleDeleteVehicle = (id: string) => {
    if (window.confirm('Are you sure you want to delete this vehicle?')) {
      const success = VehicleService.deleteVehicle(id);
      if (success) {
        loadVehicles();
        setSelectedVehicles(prev => {
          const newSet = new Set(prev);
          newSet.delete(id);
          return newSet;
        });
        toast({
          title: 'Vehicle Deleted',
          description: 'Vehicle has been removed successfully',
          variant: 'default',
        });
      }
    }
  };

  const handleSelectVehicle = (vehicleId: string, checked: boolean) => {
    setSelectedVehicles(prev => {
      const newSet = new Set(prev);
      if (checked) {
        newSet.add(vehicleId);
      } else {
        newSet.delete(vehicleId);
      }
      return newSet;
    });
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedVehicles(new Set(filteredVehicles.map(v => v.id)));
    } else {
      setSelectedVehicles(new Set());
    }
  };

  const generateBulkPDFs = async () => {
    if (selectedVehicles.size === 0) {
      toast({
        title: 'No Selection',
        description: 'Please select vehicles to generate PDFs',
        variant: 'destructive',
      });
      return;
    }

    setIsGeneratingBulk(true);

    try {
      const zip = new JSZip();
      const selectedVehicleList = vehicles.filter(v => selectedVehicles.has(v.id));

      for (const vehicle of selectedVehicleList) {
        const pdfDoc = <VehiclePDF vehicle={vehicle} />;
        const pdfBlob = await pdf(pdfDoc).toBlob();
        const fileName = `${vehicle.vehicleNumber?.replace(/\s/g, '') || vehicle.id}_RC.pdf`;
        zip.file(fileName, pdfBlob);
      }

      const zipBlob = await zip.generateAsync({ type: 'blob' });
      const timestamp = new Date().toISOString().split('T')[0];
      saveAs(zipBlob, `vehicle_pdfs_${timestamp}.zip`);

      toast({
        title: 'Bulk Export Complete',
        description: `Generated ${selectedVehicles.size} PDF(s) in ZIP file`,
        variant: 'default',
      });

      setSelectedVehicles(new Set());
    } catch (error) {
      console.error('Error generating bulk PDFs:', error);
      toast({
        title: 'Export Failed',
        description: 'Failed to generate bulk PDFs. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsGeneratingBulk(false);
    }
  };

  const generateSampleData = () => {
    VehicleService.generateSampleData();
    loadVehicles();
    toast({
      title: 'Sample Data Generated',
      description: 'Added sample vehicle records for testing',
      variant: 'default',
    });
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });
    } catch {
      return dateString;
    }
  };

  const allSelected = filteredVehicles.length > 0 && 
    filteredVehicles.every(v => selectedVehicles.has(v.id));
  const someSelected = selectedVehicles.size > 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-[image:var(--gradient-primary)] bg-clip-text text-transparent">
            Vehicle Dashboard
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage vehicle records and generate PDF documents
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={generateSampleData}
            variant="outline"
            size="sm"
          >
            <FileText className="h-4 w-4 mr-2" />
            Add Sample Data
          </Button>
          <Button
            onClick={onAddVehicle}
            className="bg-[image:var(--gradient-primary)] hover:shadow-[var(--shadow-glow)] transition-all duration-300"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Vehicle
          </Button>
        </div>
      </div>

      {/* Search and Bulk Actions */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search vehicles by number, owner, or any field..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                checked={allSelected}
                onCheckedChange={handleSelectAll}
                disabled={filteredVehicles.length === 0}
              />
              <span className="text-sm text-muted-foreground">
                Select All ({selectedVehicles.size})
              </span>
              <Button
                onClick={generateBulkPDFs}
                disabled={selectedVehicles.size === 0 || isGeneratingBulk}
                variant="outline"
                size="sm"
              >
                {isGeneratingBulk ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Archive className="h-4 w-4 mr-2" />
                    Bulk Export ({selectedVehicles.size})
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Vehicle List */}
      {filteredVehicles.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Car className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-xl font-semibold mb-2">No Vehicles Found</h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm ? 'No vehicles match your search criteria' : 'Start by adding your first vehicle'}
            </p>
            {!searchTerm && (
              <Button onClick={onAddVehicle}>
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Vehicle
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredVehicles.map((vehicle) => (
            <Card key={vehicle.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <Checkbox
                      checked={selectedVehicles.has(vehicle.id)}
                      onCheckedChange={(checked) => 
                        handleSelectVehicle(vehicle.id, checked as boolean)
                      }
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold font-mono">
                          {vehicle.vehicleNumber || 'N/A'}
                        </h3>
                        {vehicle.vehicleClass && (
                          <Badge variant="secondary" className="text-xs">
                            {vehicle.vehicleClass}
                          </Badge>
                        )}
                        {vehicle.fuelType && (
                          <Badge variant="outline" className="text-xs">
                            {vehicle.fuelType}
                          </Badge>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 text-sm text-muted-foreground">
                        {vehicle.ownerName && (
                          <div><strong>Owner:</strong> {vehicle.ownerName}</div>
                        )}
                        {vehicle.manufacturer && vehicle.model && (
                          <div><strong>Vehicle:</strong> {vehicle.manufacturer} {vehicle.model}</div>
                        )}
                        {vehicle.registrationDate && (
                          <div><strong>Registered:</strong> {formatDate(vehicle.registrationDate)}</div>
                        )}
                        {vehicle.insuranceValidTill && (
                          <div><strong>Insurance:</strong> {formatDate(vehicle.insuranceValidTill)}</div>
                        )}
                        {vehicle.rtoOffice && (
                          <div><strong>RTO:</strong> {vehicle.rtoOffice}</div>
                        )}
                        {vehicle.chassisNumber && (
                          <div><strong>Chassis:</strong> {vehicle.chassisNumber}</div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <PDFDownloadLink
                      document={<VehiclePDF vehicle={vehicle} />}
                      fileName={`${vehicle.vehicleNumber?.replace(/\s/g, '') || vehicle.id}_RC.pdf`}
                    >
                      {({ loading }) => (
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={loading}
                          className="hover:bg-success/10 hover:border-success"
                        >
                          {loading ? (
                            <>
                              <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-success border-t-transparent" />
                              Generating...
                            </>
                          ) : (
                            <>
                              <Download className="h-4 w-4 mr-2" />
                              PDF
                            </>
                          )}
                        </Button>
                      )}
                    </PDFDownloadLink>
                    
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onEditVehicle(vehicle)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDeleteVehicle(vehicle.id)}
                      className="hover:bg-destructive/10 hover:border-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Stats */}
      {vehicles.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-primary">{vehicles.length}</div>
                <div className="text-sm text-muted-foreground">Total Vehicles</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-accent">{selectedVehicles.size}</div>
                <div className="text-sm text-muted-foreground">Selected</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-success">
                  {vehicles.filter(v => v.vehicleClass?.includes('LMV')).length}
                </div>
                <div className="text-sm text-muted-foreground">Light Vehicles</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-secondary-foreground">
                  {vehicles.filter(v => v.fuelType === 'ELECTRIC').length}
                </div>
                <div className="text-sm text-muted-foreground">Electric</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default VehicleDashboard;