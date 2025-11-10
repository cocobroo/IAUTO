import { useState, useEffect, useCallback } from 'react';
import { parseVehicleInput, isValidVehicle } from '../utils/vehicleParser';
import { VehicleEntry, ParsedVehicle } from '../types';
import { Timing } from '../constants/Timing';
import { useDebounce } from './useDebounce';

export function useVehicleInput() {
  const [currentInput, setCurrentInput] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [detectedVehicle, setDetectedVehicle] = useState<ParsedVehicle | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [recentEntries, setRecentEntries] = useState<VehicleEntry[]>([]);
  const [allEntries, setAllEntries] = useState<VehicleEntry[]>([]);

  // Debounce the input to avoid excessive parsing
  const debouncedInput = useDebounce(currentInput, Timing.debounceDelay);

  // Parse the debounced input
  useEffect(() => {
    if (!debouncedInput || debouncedInput.trim().length < 3) {
      setIsAnalyzing(false);
      setDetectedVehicle(null);
      return;
    }

    // Show analyzing state
    setIsAnalyzing(true);

    // Parse the input
    const parsed = parseVehicleInput(debouncedInput);

    if (parsed && isValidVehicle(parsed)) {
      // Valid vehicle detected
      setDetectedVehicle(parsed);
      setIsAnalyzing(false);
      setShowConfirmation(true);

      // Auto-submit after confirmation duration
      const timeout = setTimeout(() => {
        submitVehicle(parsed, debouncedInput);
      }, Timing.confirmationDuration);

      return () => clearTimeout(timeout);
    } else {
      // Still analyzing or incomplete
      setDetectedVehicle(null);
    }
  }, [debouncedInput]);

  // Submit vehicle entry
  const submitVehicle = useCallback((parsed: ParsedVehicle, originalText: string) => {
    const newEntry: VehicleEntry = {
      id: Date.now().toString(),
      make: parsed.make,
      model: parsed.model,
      year: parsed.year,
      color: parsed.color,
      purchasePrice: parsed.action === 'arrival' ? parsed.price : 0,
      salePrice: parsed.action === 'sale' ? parsed.price : undefined,
      status: parsed.action === 'arrival' ? 'inventory' : 'sold',
      action: parsed.action,
      originalText,
      createdAt: new Date(),
      soldAt: parsed.action === 'sale' ? new Date() : undefined,
    };

    // Add to all entries
    setAllEntries((prev) => [newEntry, ...prev]);

    // Add to recent entries (keep last 5)
    setRecentEntries((prev) => [newEntry, ...prev.slice(0, 4)]);

    // Clear the input and states
    setCurrentInput('');
    setDetectedVehicle(null);
    setShowConfirmation(false);
    setIsAnalyzing(false);
  }, []);

  // Manual input change handler
  const handleInputChange = useCallback((text: string) => {
    setCurrentInput(text);
    setShowConfirmation(false);
  }, []);

  // Calculate metrics
  const metrics = {
    totalInventoryValue: allEntries
      .filter((e) => e.status === 'inventory')
      .reduce((sum, e) => sum + e.purchasePrice, 0),
    availableCars: allEntries.filter((e) => e.status === 'inventory').length,
    totalSales: allEntries
      .filter((e) => e.status === 'sold')
      .reduce((sum, e) => sum + (e.salePrice || 0), 0),
    carsSold: allEntries.filter((e) => e.status === 'sold').length,
  };

  return {
    currentInput,
    handleInputChange,
    isAnalyzing,
    detectedVehicle,
    showConfirmation,
    recentEntries,
    allEntries,
    metrics,
  };
}
