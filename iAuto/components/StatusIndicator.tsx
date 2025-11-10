import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../constants/Colors';
import { ParsedVehicle } from '../types';

interface StatusIndicatorProps {
  isAnalyzing: boolean;
  detectedVehicle: ParsedVehicle | null;
  showConfirmation: boolean;
}

export function StatusIndicator({
  isAnalyzing,
  detectedVehicle,
  showConfirmation
}: StatusIndicatorProps) {
  // Determine what to show
  let displayText = '';
  let textStyle = styles.analyzing;

  if (showConfirmation && detectedVehicle) {
    if (detectedVehicle.price > 0) {
      displayText = `+ USD ${(detectedVehicle.price / 1000).toFixed(1)}k`;
      textStyle = styles.detected;
    } else {
      displayText = '+ Agregado';
      textStyle = styles.detectedGreen;
    }
  } else if (isAnalyzing) {
    displayText = 'analizando';
    textStyle = styles.analyzing;
  }

  if (!displayText) {
    return null;
  }

  return (
    <View>
      <Text style={textStyle}>{displayText}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
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
  detectedGreen: {
    fontSize: 17,
    color: Colors.successGreen,
    fontWeight: '600',
  },
});
