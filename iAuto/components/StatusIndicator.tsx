import React, { useEffect } from 'react';
import { Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing
} from 'react-native-reanimated';
import { Colors } from '../constants/Colors';
import { Timing } from '../constants/Timing';
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
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (showConfirmation && detectedVehicle) {
      // Show confirmation
      opacity.value = withTiming(1, {
        duration: Timing.fadeInDuration,
        easing: Easing.ease,
      });
    } else if (isAnalyzing) {
      // Show analyzing
      opacity.value = withTiming(1, {
        duration: Timing.fadeInDuration,
        easing: Easing.ease,
      });
    } else {
      // Hide
      opacity.value = withTiming(0, {
        duration: Timing.fadeOutDuration,
        easing: Easing.ease,
      });
    }
  }, [isAnalyzing, detectedVehicle, showConfirmation]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

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
    <Animated.View style={animatedStyle}>
      <Text style={textStyle}>{displayText}</Text>
    </Animated.View>
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
