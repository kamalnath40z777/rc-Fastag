export interface Vehicle {
  id: string;
  vehicleNumber?: string;
  ownerName?: string;
  vehicleClass?: string;
  fuelType?: string;
  chassisNumber?: string;
  engineNumber?: string;
  manufacturer?: string;
  model?: string;
  registrationDate?: string;
  insuranceValidTill?: string;
  rtoOffice?: string;
  ownerAddress?: string;
  createdAt: string;
  updatedAt: string;
}

export interface VehicleFormData {
  vehicleNumber?: string;
  ownerName?: string;
  vehicleClass?: string;
  fuelType?: string;
  chassisNumber?: string;
  engineNumber?: string;
  manufacturer?: string;
  model?: string;
  registrationDate?: string;
  insuranceValidTill?: string;
  rtoOffice?: string;
  ownerAddress?: string;
}