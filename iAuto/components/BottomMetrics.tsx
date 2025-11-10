import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../constants/Colors';
import { AnimatedNumber } from './AnimatedNumber';

interface BottomMetricsProps {
  totalInventoryValue: number;
  availableCars: number;
}

export function BottomMetrics({
  totalInventoryValue,
  availableCars
}: BottomMetricsProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Restante</Text>

      <View style={styles.row}>
        <Text style={styles.metricLabel}>Inventario Actual</Text>
        <AnimatedNumber
          value={totalInventoryValue}
          prefix="USD "
          style={styles.metricValue}
        />
      </View>

      <View style={styles.divider} />

      <View style={styles.row}>
        <Text style={styles.metricLabel}>Disponibles</Text>
        <AnimatedNumber
          value={availableCars}
          decimals={0}
          style={styles.metricValue}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 140,
    backgroundColor: Colors.cardBackground,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  label: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  metricLabel: {
    fontSize: 17,
    color: Colors.textPrimary,
  },
  metricValue: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: 8,
  },
});
