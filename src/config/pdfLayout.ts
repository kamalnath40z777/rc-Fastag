// PDF Layout Configuration
// Coordinates are in points (1 point = 1/72 inch)
// A4 size: 595.28 x 841.89 points

export interface FieldPosition {
  top: number;
  left: number;
  width?: number;
  height?: number;
  fontSize?: number;
  fontWeight?: 'normal' | 'bold';
  color?: string;
}

export const PDF_CONFIG = {
  pageSize: {
    width: 595.28,
    height: 841.89,
  },
  backgroundImage: '/assets/vehicle-template.jpg', // Place your template image here
};

export const FIELD_POSITIONS: Record<string, FieldPosition> = {
  vehicleNumber: {
    top: 180,
    left: 200,
    width: 200,
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000000',
  },
  ownerName: {
    top: 220,
    left: 200,
    width: 300,
    fontSize: 12,
    fontWeight: 'normal',
    color: '#000000',
  },
  vehicleClass: {
    top: 260,
    left: 200,
    width: 250,
    fontSize: 11,
    fontWeight: 'normal',
    color: '#000000',
  },
  fuelType: {
    top: 300,
    left: 200,
    width: 150,
    fontSize: 11,
    fontWeight: 'normal',
    color: '#000000',
  },
  chassisNumber: {
    top: 340,
    left: 200,
    width: 250,
    fontSize: 10,
    fontWeight: 'normal',
    color: '#000000',
  },
  engineNumber: {
    top: 380,
    left: 200,
    width: 250,
    fontSize: 10,
    fontWeight: 'normal',
    color: '#000000',
  },
  manufacturer: {
    top: 420,
    left: 200,
    width: 200,
    fontSize: 11,
    fontWeight: 'normal',
    color: '#000000',
  },
  model: {
    top: 460,
    left: 200,
    width: 200,
    fontSize: 11,
    fontWeight: 'normal',
    color: '#000000',
  },
  registrationDate: {
    top: 500,
    left: 200,
    width: 150,
    fontSize: 11,
    fontWeight: 'normal',
    color: '#000000',
  },
  insuranceValidTill: {
    top: 540,
    left: 200,
    width: 150,
    fontSize: 11,
    fontWeight: 'normal',
    color: '#000000',
  },
  rtoOffice: {
    top: 580,
    left: 200,
    width: 250,
    fontSize: 11,
    fontWeight: 'normal',
    color: '#000000',
  },
  ownerAddress: {
    top: 620,
    left: 200,
    width: 300,
    height: 60,
    fontSize: 10,
    fontWeight: 'normal',
    color: '#000000',
  },
};