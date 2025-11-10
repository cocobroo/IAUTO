import React, { createContext, useContext, ReactNode } from 'react';
import { useVehicleInput } from '../hooks/useVehicleInput';
import { VehicleEntry, ParsedVehicle } from '../types';

interface VehicleContextType {
  currentInput: string;
  handleInputChange: (text: string) => void;
  isAnalyzing: boolean;
  detectedVehicle: ParsedVehicle | null;
  showConfirmation: boolean;
  recentEntries: VehicleEntry[];
  allEntries: VehicleEntry[];
  metrics: {
    totalInventoryValue: number;
    availableCars: number;
    totalSales: number;
    carsSold: number;
  };
}

const VehicleContext = createContext<VehicleContextType | undefined>(undefined);

export function VehicleProvider({ children }: { children: ReactNode }) {
  const vehicleData = useVehicleInput();

  return (
    <VehicleContext.Provider value={vehicleData}>
      {children}
    </VehicleContext.Provider>
  );
}

export function useVehicleContext() {
  const context = useContext(VehicleContext);
  if (!context) {
    throw new Error('useVehicleContext must be used within VehicleProvider');
  }
  return context;
}
