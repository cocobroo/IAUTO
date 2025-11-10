import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../constants/Colors';
import { useVehicleContext } from '../../contexts/VehicleContext';
import { VehicleEntry } from '../../types';

export default function HistorialScreen() {
  const { allEntries } = useVehicleContext();
  const [searchQuery, setSearchQuery] = useState('');

  // Filter entries by search query
  const filteredEntries = searchQuery
    ? allEntries.filter((entry) => {
        const searchText = searchQuery.toLowerCase();
        return (
          entry.make.toLowerCase().includes(searchText) ||
          entry.model.toLowerCase().includes(searchText) ||
          entry.originalText.toLowerCase().includes(searchText)
        );
      })
    : allEntries;

  // Format date
  const formatDate = (date: Date) => {
    const now = new Date();
    const entryDate = new Date(date);
    const diffInDays = Math.floor((now.getTime() - entryDate.getTime()) / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) {
      return 'Hoy';
    } else if (diffInDays === 1) {
      return 'Ayer';
    } else {
      return entryDate.toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' });
    }
  };

  // Format time
  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
  };

  // Render entry item
  const renderEntry = (entry: VehicleEntry) => {
    const vehicleText = `${entry.make} ${entry.model}${entry.year ? ` ${entry.year}` : ''}`;
    const statusText = entry.status === 'sold' ? 'Vendido' : 'Agregado';
    const statusColor = entry.status === 'sold' ? Colors.successGreen : Colors.accentBlue;
    const priceText = entry.status === 'sold' && entry.salePrice
      ? `USD ${(entry.salePrice / 1000).toFixed(1)}k`
      : entry.purchasePrice > 0
      ? `USD ${(entry.purchasePrice / 1000).toFixed(1)}k`
      : '-';

    return (
      <View key={entry.id} style={styles.entryCard}>
        <View style={styles.entryHeader}>
          <Text style={styles.vehicleName}>{vehicleText}</Text>
          <Text style={styles.timeText}>{formatTime(entry.createdAt)}</Text>
        </View>

        <View style={styles.entryDetails}>
          <View style={styles.statusBadge}>
            <Text style={[styles.statusText, { color: statusColor }]}>
              {statusText}
            </Text>
          </View>
          <Text style={styles.priceText}>{priceText}</Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Historial</Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar vehículo..."
          placeholderTextColor={Colors.textSecondary}
          value={searchQuery}
          onChangeText={setSearchQuery}
          autoCapitalize="none"
          autoCorrect={false}
        />
      </View>

      {/* Entries List */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {filteredEntries.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>
              {searchQuery ? 'No se encontraron resultados' : 'Sin historial aún'}
            </Text>
          </View>
        ) : (
          <>
            {/* Group by date (simple version - show all with date headers) */}
            {filteredEntries.map((entry, index) => {
              const showDateHeader =
                index === 0 ||
                formatDate(entry.createdAt) !== formatDate(filteredEntries[index - 1].createdAt);

              return (
                <View key={entry.id}>
                  {showDateHeader && (
                    <Text style={styles.dateHeader}>{formatDate(entry.createdAt)}</Text>
                  )}
                  {renderEntry(entry)}
                </View>
              );
            })}
          </>
        )}
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
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: Colors.cardBackground,
  },
  searchInput: {
    backgroundColor: Colors.background,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 17,
    color: Colors.textPrimary,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  dateHeader: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.textSecondary,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  entryCard: {
    backgroundColor: Colors.cardBackground,
    marginHorizontal: 16,
    marginVertical: 4,
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  entryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  vehicleName: {
    fontSize: 17,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  timeText: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  entryDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  statusText: {
    fontSize: 15,
    fontWeight: '600',
  },
  priceText: {
    fontSize: 17,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  emptyState: {
    paddingTop: 80,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 17,
    color: Colors.textSecondary,
  },
});
