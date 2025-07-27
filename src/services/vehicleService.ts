import { Vehicle, VehicleFormData } from '@/types/Vehicle';
import { v4 as uuidv4 } from 'uuid';

const STORAGE_KEY = 'vehicles';

export class VehicleService {
  static getAllVehicles(): Vehicle[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error loading vehicles:', error);
      return [];
    }
  }

  static getVehicleById(id: string): Vehicle | null {
    const vehicles = this.getAllVehicles();
    return vehicles.find(v => v.id === id) || null;
  }

  static createVehicle(data: VehicleFormData): Vehicle {
    const vehicle: Vehicle = {
      id: uuidv4(),
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const vehicles = this.getAllVehicles();
    vehicles.push(vehicle);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(vehicles));
    
    return vehicle;
  }

  static updateVehicle(id: string, data: Partial<VehicleFormData>): Vehicle | null {
    const vehicles = this.getAllVehicles();
    const index = vehicles.findIndex(v => v.id === id);
    
    if (index === -1) return null;

    vehicles[index] = {
      ...vehicles[index],
      ...data,
      updatedAt: new Date().toISOString(),
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(vehicles));
    return vehicles[index];
  }

  static deleteVehicle(id: string): boolean {
    const vehicles = this.getAllVehicles();
    const filteredVehicles = vehicles.filter(v => v.id !== id);
    
    if (filteredVehicles.length === vehicles.length) return false;

    localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredVehicles));
    return true;
  }

  static searchVehicles(query: string): Vehicle[] {
    const vehicles = this.getAllVehicles();
    const lowercaseQuery = query.toLowerCase();
    
    return vehicles.filter(vehicle =>
      Object.values(vehicle).some(value =>
        value?.toString().toLowerCase().includes(lowercaseQuery)
      )
    );
  }

  // Sample data generator
  static generateSampleData(): void {
    const sampleVehicles: VehicleFormData[] = [
      {
        vehicleNumber: 'TN01AB1234',
        ownerName: 'RAJESH KUMAR',
        vehicleClass: 'MCWG (Motor Cycle With Gear)',
        fuelType: 'PETROL',
        chassisNumber: 'ME4JF48DXJK123456',
        engineNumber: 'JF48DFH123456',
        manufacturer: 'BAJAJ AUTO LTD',
        model: 'PULSAR 150',
        registrationDate: '2023-01-15',
        insuranceValidTill: '2024-12-31',
        rtoOffice: 'RTO CHENNAI CENTRAL',
        ownerAddress: 'No.45, Gandhi Street, T.Nagar, Chennai - 600017, Tamil Nadu',
      },
      {
        vehicleNumber: 'KA05MN9876',
        ownerName: 'PRIYA SHARMA',
        vehicleClass: 'LMV (Light Motor Vehicle)',
        fuelType: 'DIESEL',
        chassisNumber: 'MA3ERLF3S00123456',
        engineNumber: 'K9K792123456',
        manufacturer: 'MARUTI SUZUKI INDIA LTD',
        model: 'SWIFT DZIRE',
        registrationDate: '2022-08-20',
        insuranceValidTill: '2025-08-19',
        rtoOffice: 'RTO BANGALORE EAST',
        ownerAddress: 'Flat 302, Green Valley Apartments, Koramangala, Bangalore - 560034, Karnataka',
      },
      {
        vehicleNumber: 'MH12CD5678',
        ownerName: 'AMIT PATEL',
        vehicleClass: 'HMV (Heavy Motor Vehicle)',
        fuelType: 'DIESEL',
        chassisNumber: 'MAT634567890123456',
        engineNumber: 'BS6D567890',
        manufacturer: 'TATA MOTORS LTD',
        model: 'ACE GOLD',
        registrationDate: '2023-03-10',
        insuranceValidTill: '2024-03-09',
        rtoOffice: 'RTO PUNE',
        ownerAddress: 'Shop No. 15, Industrial Estate, Pimpri-Chinchwad, Pune - 411018, Maharashtra',
      },
    ];

    sampleVehicles.forEach(vehicleData => {
      this.createVehicle(vehicleData);
    });
  }
}