// iAuto - Demo simplificada para Expo Snack
// Copia todo este código en https://snack.expo.dev

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableWithoutFeedback,
  SafeAreaView,
} from 'react-native';

// Colores
const Colors = {
  background: '#F8F6F1',
  cardBackground: '#FFFFFF',
  textPrimary: '#1A1A1A',
  textSecondary: '#8E8E93',
  accentBlue: '#007AFF',
  successGreen: '#34C759',
  border: '#E5E5E5',
};

// Parser simplificado
const parseVehicle = (text) => {
  if (!text || text.length < 3) return null;

  const lowerText = text.toLowerCase();
  const makes = ['bmw', 'mazda', 'honda', 'toyota', 'ford', 'chevrolet'];

  let make = null;
  let makeIndex = -1;

  for (const m of makes) {
    const idx = lowerText.indexOf(m);
    if (idx !== -1) {
      make = m.charAt(0).toUpperCase() + m.slice(1);
      makeIndex = idx;
      break;
    }
  }

  if (!make) return null;

  const afterMake = text.slice(makeIndex + make.length).trim();
  const modelMatch = afterMake.match(/^([a-z0-9\-]+)/i);

  if (!modelMatch) return null;

  const model = modelMatch[1];

  // Detectar precio
  let price = 0;
  const priceMatch = text.match(/(\d+(?:\.\d+)?)\s*k/i);
  if (priceMatch) {
    price = parseFloat(priceMatch[1]) * 1000;
  }

  // Detectar acción
  const isSale = /vendimos|vendido|vendi|sold/i.test(text);

  if (isSale && price === 0) return null; // Venta requiere precio

  return { make, model, price, action: isSale ? 'sale' : 'arrival' };
};

// Hook de debounce
const useDebounce = (value, delay) => {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
};

// Componente principal
export default function App() {
  const [input, setInput] = useState('');
  const [entries, setEntries] = useState([]);
  const [detected, setDetected] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);

  const debouncedInput = useDebounce(input, 300);

  useEffect(() => {
    if (!debouncedInput) {
      setDetected(null);
      setShowConfirm(false);
      return;
    }

    const parsed = parseVehicle(debouncedInput);
    if (parsed) {
      setDetected(parsed);
      setShowConfirm(true);

      const timer = setTimeout(() => {
        // Auto-submit
        setEntries(prev => [{
          id: Date.now(),
          ...parsed,
          text: debouncedInput,
        }, ...prev]);
        setInput('');
        setDetected(null);
        setShowConfirm(false);
      }, 1500);

      return () => clearTimeout(timer);
    } else {
      setDetected(null);
    }
  }, [debouncedInput]);

  const inventory = entries.filter(e => e.action === 'arrival');
  const totalValue = inventory.reduce((sum, e) => sum + e.price, 0);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.logo}>iAuto</Text>
        <Text style={styles.todayLabel}>Hoy</Text>
      </View>

      <ScrollView style={styles.content}>
        {/* Input Row */}
        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            value={input}
            onChangeText={setInput}
            placeholder="Escribe aquí... (ej: bmw 435i)"
            placeholderTextColor={Colors.textSecondary}
            multiline
          />
          <View style={styles.statusContainer}>
            {!showConfirm && debouncedInput && !detected && (
              <Text style={styles.analyzing}>analizando</Text>
            )}
            {showConfirm && detected && (
              <Text style={styles.detected}>
                {detected.price > 0
                  ? `+ USD ${(detected.price / 1000).toFixed(1)}k`
                  : '+ Agregado'}
              </Text>
            )}
          </View>
        </View>

        {/* Recent Entries */}
        {entries.slice(0, 5).map(entry => (
          <View key={entry.id} style={styles.entryRow}>
            <Text style={styles.entryText}>
              {entry.make} {entry.model}
            </Text>
            <Text style={styles.entryPrice}>
              {entry.price > 0
                ? `+ USD ${(entry.price / 1000).toFixed(1)}k`
                : '+ Agregado'}
            </Text>
          </View>
        ))}

        {entries.length === 0 && !input && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>
              Prueba escribiendo:{'\n\n'}
              "bmw 435i"{'\n'}
              "llegó mazda 3 en 8.5k"{'\n'}
              "vendimos honda civic 11k"
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Bottom Metrics */}
      <View style={styles.metrics}>
        <Text style={styles.metricsLabel}>Restante</Text>
        <View style={styles.metricsRow}>
          <Text style={styles.metricsText}>Inventario Actual</Text>
          <Text style={styles.metricsValue}>
            USD {(totalValue / 1000).toFixed(1)}k
          </Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.metricsRow}>
          <Text style={styles.metricsText}>Disponibles</Text>
          <Text style={styles.metricsValue}>{inventory.length}</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    height: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    backgroundColor: Colors.cardBackground,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  logo: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  todayLabel: {
    fontSize: 17,
    color: Colors.textPrimary,
  },
  content: {
    flex: 1,
  },
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    minHeight: 50,
  },
  input: {
    flex: 1,
    fontSize: 17,
    color: Colors.textPrimary,
    paddingRight: 12,
  },
  statusContainer: {
    justifyContent: 'center',
    minWidth: 120,
    alignItems: 'flex-end',
  },
  analyzing: {
    fontSize: 15,
    color: Colors.textSecondary,
    fontStyle: 'italic',
  },
  detected: {
    fontSize: 17,
    color: Colors.accentBlue,
    fontWeight: '600',
  },
  entryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 8,
    opacity: 0.5,
  },
  entryText: {
    fontSize: 17,
    color: Colors.textPrimary,
  },
  entryPrice: {
    fontSize: 17,
    color: Colors.accentBlue,
  },
  emptyState: {
    paddingHorizontal: 20,
    paddingTop: 60,
  },
  emptyText: {
    fontSize: 15,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  metrics: {
    height: 140,
    backgroundColor: Colors.cardBackground,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  metricsLabel: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginBottom: 12,
  },
  metricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  metricsText: {
    fontSize: 17,
    color: Colors.textPrimary,
  },
  metricsValue: {
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
