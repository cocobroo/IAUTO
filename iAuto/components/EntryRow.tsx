import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../constants/Colors';
import { VehicleEntry } from '../types';

interface EntryRowProps {
  entry: VehicleEntry;
  index: number;
}

export function EntryRow({ entry, index }: EntryRowProps) {
  const vehicleText = `${entry.make} ${entry.model}${entry.year ? ` ${entry.year}` : ''}`;
  const priceText = entry.action === 'sale' && entry.salePrice
    ? `+ USD ${(entry.salePrice / 1000).toFixed(1)}k`
    : entry.purchasePrice > 0
    ? `+ USD ${(entry.purchasePrice / 1000).toFixed(1)}k`
    : '+ Agregado';

  return (
    <View style={styles.container}>
      <Text style={styles.vehicleText}>{vehicleText}</Text>
      <Text style={styles.priceText}>{priceText}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 20,
    opacity: 0.5,
  },
  vehicleText: {
    fontSize: 17,
    color: Colors.textPrimary,
  },
  priceText: {
    fontSize: 17,
    color: Colors.accentBlue,
  },
});
