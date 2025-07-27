import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Save, FileText, Plus, Edit } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Vehicle, VehicleFormData } from "@/types/Vehicle";
import { VehicleService } from "@/services/vehicleService";

interface VehicleFormProps {
  vehicle?: Vehicle;
  onSave: (vehicle: Vehicle) => void;
  onCancel: () => void;
}

const VehicleForm = ({ vehicle, onSave, onCancel }: VehicleFormProps) => {
  const [formData, setFormData] = useState<VehicleFormData>({
    vehicleNumber: '',
    ownerName: '',
    vehicleClass: '',
    fuelType: '',
    chassisNumber: '',
    engineNumber: '',
    manufacturer: '',
    model: '',
    registrationDate: '',
    insuranceValidTill: '',
    rtoOffice: '',
    ownerAddress: '',
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (vehicle) {
      setFormData({
        vehicleNumber: vehicle.vehicleNumber || '',
        ownerName: vehicle.ownerName || '',
        vehicleClass: vehicle.vehicleClass || '',
        fuelType: vehicle.fuelType || '',
        chassisNumber: vehicle.chassisNumber || '',
        engineNumber: vehicle.engineNumber || '',
        manufacturer: vehicle.manufacturer || '',
        model: vehicle.model || '',
        registrationDate: vehicle.registrationDate || '',
        insuranceValidTill: vehicle.insuranceValidTill || '',
        rtoOffice: vehicle.rtoOffice || '',
        ownerAddress: vehicle.ownerAddress || '',
      });
    }
  }, [vehicle]);

  const formatVehicleNumber = (value: string) => {
    // Remove any non-alphanumeric characters and convert to uppercase
    const cleaned = value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
    
    // Format as TN01AB1234 pattern
    if (cleaned.length <= 2) return cleaned;
    if (cleaned.length <= 4) return cleaned.slice(0, 2) + ' ' + cleaned.slice(2);
    if (cleaned.length <= 6) return cleaned.slice(0, 2) + ' ' + cleaned.slice(2, 4) + ' ' + cleaned.slice(4);
    return cleaned.slice(0, 2) + ' ' + cleaned.slice(2, 4) + ' ' + cleaned.slice(4, 6) + ' ' + cleaned.slice(6, 10);
  };

  const handleVehicleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatVehicleNumber(e.target.value);
    setFormData(prev => ({ ...prev, vehicleNumber: formatted }));
  };

  const handleInputChange = (field: keyof VehicleFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.vehicleNumber?.trim()) {
      toast({
        title: "Error",
        description: "Please enter a vehicle number",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      let savedVehicle: Vehicle;
      
      if (vehicle) {
        // Update existing vehicle
        savedVehicle = VehicleService.updateVehicle(vehicle.id, formData)!;
        toast({
          title: "Vehicle Updated",
          description: "Vehicle information has been updated successfully",
          variant: "default",
        });
      } else {
        // Create new vehicle
        savedVehicle = VehicleService.createVehicle(formData);
        toast({
          title: "Vehicle Created",
          description: "New vehicle has been added successfully",
          variant: "default",
        });
      }
      
      onSave(savedVehicle);
    } catch (error) {
      console.error('Error saving vehicle:', error);
      toast({
        title: "Error",
        description: "Failed to save vehicle. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const vehicleClasses = [
    'MCWG (Motor Cycle With Gear)',
    'MCWOG (Motor Cycle Without Gear)',
    'LMV (Light Motor Vehicle)',
    'HMV (Heavy Motor Vehicle)',
    'TRANS (Transport Vehicle)',
    'TRACTOR',
    'TRAILER',
  ];

  const fuelTypes = [
    'PETROL',
    'DIESEL',
    'CNG',
    'LPG',
    'ELECTRIC',
    'HYBRID',
  ];

  const manufacturers = [
    'BAJAJ AUTO LTD',
    'HERO MOTOCORP LTD',
    'HONDA MOTORCYCLE & SCOOTER INDIA PVT LTD',
    'MARUTI SUZUKI INDIA LTD',
    'HYUNDAI MOTOR INDIA LTD',
    'TATA MOTORS LTD',
    'MAHINDRA & MAHINDRA LTD',
    'TOYOTA KIRLOSKAR MOTOR PVT LTD',
    'FORD INDIA PVT LTD',
    'VOLKSWAGEN INDIA PVT LTD',
  ];

  const rtoOffices = [
    'RTO CHENNAI CENTRAL',
    'RTO CHENNAI NORTH',
    'RTO CHENNAI SOUTH',
    'RTO BANGALORE EAST',
    'RTO BANGALORE WEST',
    'RTO MUMBAI CENTRAL',
    'RTO DELHI',
    'RTO PUNE',
    'RTO HYDERABAD',
    'RTO KOLKATA',
  };

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-[var(--shadow-elegant)] bg-[image:var(--gradient-card)] border-0 animate-scale-in">
      <CardHeader className="text-center pb-6">
        <CardTitle className="text-2xl font-bold bg-[image:var(--gradient-primary)] bg-clip-text text-transparent mb-2">
          {vehicle ? 'Edit Vehicle' : 'Add New Vehicle'}
        </CardTitle>
        <CardDescription className="text-base text-muted-foreground">
          {vehicle ? 'Update vehicle information' : 'Enter vehicle details to create a new record'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="vehicle-number">Vehicle Number *</Label>
              <Input
                id="vehicle-number"
                type="text"
                placeholder="TN 01 AB 1234"
                value={formData.vehicleNumber}
                onChange={handleVehicleNumberChange}
                maxLength={13}
                className="font-mono text-lg tracking-wider"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="owner-name">Owner Name</Label>
              <Input
                id="owner-name"
                type="text"
                placeholder="Enter owner name"
                value={formData.ownerName}
                onChange={(e) => handleInputChange('ownerName', e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="vehicle-class">Vehicle Class</Label>
              <Select value={formData.vehicleClass} onValueChange={(value) => handleInputChange('vehicleClass', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select vehicle class" />
                </SelectTrigger>
                <SelectContent>
                  {vehicleClasses.map((cls) => (
                    <SelectItem key={cls} value={cls}>{cls}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="fuel-type">Fuel Type</Label>
              <Select value={formData.fuelType} onValueChange={(value) => handleInputChange('fuelType', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select fuel type" />
                </SelectTrigger>
                <SelectContent>
                  {fuelTypes.map((fuel) => (
                    <SelectItem key={fuel} value={fuel}>{fuel}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="chassis-number">Chassis Number</Label>
              <Input
                id="chassis-number"
                type="text"
                placeholder="Enter chassis number"
                value={formData.chassisNumber}
                onChange={(e) => handleInputChange('chassisNumber', e.target.value)}
                className="font-mono"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="engine-number">Engine Number</Label>
              <Input
                id="engine-number"
                type="text"
                placeholder="Enter engine number"
                value={formData.engineNumber}
                onChange={(e) => handleInputChange('engineNumber', e.target.value)}
                className="font-mono"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="manufacturer">Manufacturer</Label>
              <Select value={formData.manufacturer} onValueChange={(value) => handleInputChange('manufacturer', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select manufacturer" />
                </SelectTrigger>
                <SelectContent>
                  {manufacturers.map((mfg) => (
                    <SelectItem key={mfg} value={mfg}>{mfg}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="model">Model</Label>
              <Input
                id="model"
                type="text"
                placeholder="Enter vehicle model"
                value={formData.model}
                onChange={(e) => handleInputChange('model', e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="registration-date">Registration Date</Label>
              <Input
                id="registration-date"
                type="date"
                value={formData.registrationDate}
                onChange={(e) => handleInputChange('registrationDate', e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="insurance-valid-till">Insurance Valid Till</Label>
              <Input
                id="insurance-valid-till"
                type="date"
                value={formData.insuranceValidTill}
                onChange={(e) => handleInputChange('insuranceValidTill', e.target.value)}
              />
            </div>
            
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="rto-office">RTO Office</Label>
              <Select value={formData.rtoOffice} onValueChange={(value) => handleInputChange('rtoOffice', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select RTO office" />
                </SelectTrigger>
                <SelectContent>
                  {rtoOffices.map((rto) => (
                    <SelectItem key={rto} value={rto}>{rto}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="owner-address">Owner Address</Label>
            <Textarea
              id="owner-address"
              placeholder="Enter complete address"
              value={formData.ownerAddress}
              onChange={(e) => handleInputChange('ownerAddress', e.target.value)}
              rows={3}
            />
          </div>

          <div className="flex gap-3 pt-6">
            <Button 
              type="submit"
              disabled={loading}
              className="flex-1 bg-[image:var(--gradient-primary)] hover:shadow-[var(--shadow-glow)] transition-all duration-300 transform hover:scale-105 text-white border-0 h-12 text-base font-semibold"
            >
              {loading ? (
                <>
                  <div className="mr-2 h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-5 w-5" />
                  {vehicle ? 'Update Vehicle' : 'Save Vehicle'}
                </>
              )}
            </Button>
            
            <Button 
              type="button"
              onClick={onCancel}
              variant="outline"
              className="border-2 border-primary/20 hover:border-primary/40 hover:bg-primary/5 transition-all duration-300"
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default VehicleForm;