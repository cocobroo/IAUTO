import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../constants/Colors';
import { useVehicleContext } from '../../contexts/VehicleContext';

export default function MetricasScreen() {
  const { metrics, allEntries } = useVehicleContext();

  const monthlyGoal = 80000;
  const progress = metrics.carsSold > 0 ? (metrics.totalSales / monthlyGoal) * 100 : 0;
  const averageSale = metrics.carsSold > 0 ? metrics.totalSales / metrics.carsSold : 0;
  const remaining = monthlyGoal - metrics.totalSales;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Métricas</Text>
          <Text style={styles.monthLabel}>Noviembre 2025</Text>
        </View>

        {/* Progress Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>
            {metrics.carsSold}/10 autos vendidos
          </Text>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${Math.min(progress, 100)}%` }]} />
          </View>
          <Text style={styles.progressText}>
            {progress.toFixed(1)}% de la meta mensual
          </Text>
        </View>

        {/* Average Sale Card */}
        <View style={styles.card}>
          <Text style={styles.cardLabel}>Venta Promedio</Text>
          <Text style={styles.cardValue}>
            USD {(averageSale / 1000).toFixed(1)}k
          </Text>
        </View>

        {/* Summary Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Resumen</Text>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Ventas Totales</Text>
            <Text style={styles.summaryValue}>
              USD {(metrics.totalSales / 1000).toFixed(1)}k
            </Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Meta Mensual</Text>
            <Text style={styles.summaryValue}>USD 80k</Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Restante</Text>
            <Text style={[styles.summaryValue, { color: Colors.accentBlue }]}>
              USD {(remaining / 1000).toFixed(1)}k
            </Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Inventario Actual</Text>
            <Text style={styles.summaryValue}>
              USD {(metrics.totalInventoryValue / 1000).toFixed(1)}k
            </Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Autos Disponibles</Text>
            <Text style={styles.summaryValue}>{metrics.availableCars}</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: Colors.cardBackground,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  title: {
    fontSize: 28,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  monthLabel: {
    fontSize: 15,
    color: Colors.textSecondary,
  },
  card: {
    backgroundColor: Colors.cardBackground,
    marginHorizontal: 16,
    marginTop: 16,
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 12,
  },
  cardLabel: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginBottom: 8,
  },
  cardValue: {
    fontSize: 28,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  progressBar: {
    height: 8,
    backgroundColor: Colors.border,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.accentBlue,
    borderRadius: 4,
  },
  progressText: {
    fontSize: 15,
    color: Colors.textSecondary,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  summaryLabel: {
    fontSize: 17,
    color: Colors.textPrimary,
  },
  summaryValue: {
    fontSize: 17,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: 8,
  },
});
