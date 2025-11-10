export type VehicleAction = 'arrival' | 'sale';
export type VehicleStatus = 'inventory' | 'sold';

export interface VehicleEntry {
  id: string;
  make: string;
  model: string;
  year?: number;
  color?: string;
  purchasePrice: number;
  salePrice?: number;
  status: VehicleStatus;
  action: VehicleAction;
  originalText: string;
  createdAt: Date;
  soldAt?: Date;
}

export interface ParsedVehicle {
  make: string;
  model: string;
  year?: number;
  color?: string;
  price: number;
  action: VehicleAction;
}

export interface UserMetrics {
  monthlyGoal: number;
  totalSales: number;
  carsSold: number;
  totalInventoryValue: number;
  availableCars: number;
  month: string;
}

export interface AnalysisStatus {
  isAnalyzing: boolean;
  detectedVehicle: ParsedVehicle | null;
  showConfirmation: boolean;
}
