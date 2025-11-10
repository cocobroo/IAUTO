import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Keyboard
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../constants/Colors';
import { useVehicleContext } from '../../contexts/VehicleContext';
import { StatusIndicator } from '../../components/StatusIndicator';
import { EntryRow } from '../../components/EntryRow';
import { BottomMetrics } from '../../components/BottomMetrics';

export default function RegistroScreen() {
  const inputRef = useRef<TextInput>(null);
  const {
    currentInput,
    handleInputChange,
    isAnalyzing,
    detectedVehicle,
    showConfirmation,
    recentEntries,
    metrics,
  } = useVehicleContext();

  // Auto-focus input on mount
  useEffect(() => {
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  }, []);

  // Focus input when tapping anywhere
  const handleTapAnywhere = () => {
    inputRef.current?.focus();
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoid}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.logo}>iAuto</Text>
          <Text style={styles.todayLabel}>Hoy</Text>
        </View>

        {/* Main content - tap to focus */}
        <TouchableWithoutFeedback onPress={handleTapAnywhere}>
          <View style={styles.content}>
            <ScrollView
              contentContainerStyle={styles.scrollContent}
              keyboardShouldPersistTaps="handled"
            >
              {/* Current Input Row */}
              <View style={styles.inputRow}>
                <TextInput
                  ref={inputRef}
                  style={styles.input}
                  value={currentInput}
                  onChangeText={handleInputChange}
                  placeholder="Escribe aquí..."
                  placeholderTextColor={Colors.textSecondary}
                  multiline
                  autoCapitalize="none"
                  autoCorrect={false}
                  autoFocus
                />
                <View style={styles.statusContainer}>
                  <StatusIndicator
                    isAnalyzing={isAnalyzing}
                    detectedVehicle={detectedVehicle}
                    showConfirmation={showConfirmation}
                  />
                </View>
              </View>

              {/* Recent Entries */}
              {recentEntries.map((entry, index) => (
                <EntryRow key={entry.id} entry={entry} index={index} />
              ))}

              {/* Empty state hint */}
              {recentEntries.length === 0 && !currentInput && (
                <View style={styles.emptyState}>
                  <Text style={styles.emptyText}>
                    Escribe algo como "bmw 435i" o "vendimos mazda 3 en 8.5k"
                  </Text>
                </View>
              )}
            </ScrollView>
          </View>
        </TouchableWithoutFeedback>

        {/* Bottom Metrics - Fixed */}
        <BottomMetrics
          totalInventoryValue={metrics.totalInventoryValue}
          availableCars={metrics.availableCars}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  keyboardAvoid: {
    flex: 1,
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
  scrollContent: {
    paddingTop: 20,
    paddingBottom: 20,
    minHeight: '100%',
  },
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    paddingVertical: 8,
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
  emptyState: {
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  emptyText: {
    fontSize: 15,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
});
