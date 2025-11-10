import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing
} from 'react-native-reanimated';
import { Colors } from '../constants/Colors';
import { Timing } from '../constants/Timing';
import { VehicleEntry } from '../types';

interface EntryRowProps {
  entry: VehicleEntry;
  index: number;
}

export function EntryRow({ entry, index }: EntryRowProps) {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(-20);

  useEffect(() => {
    // Animate in
    opacity.value = withTiming(0.5, {
      duration: Timing.entryMoveDuration,
      easing: Easing.out(Easing.ease),
    });
    translateY.value = withTiming(0, {
      duration: Timing.entryMoveDuration,
      easing: Easing.out(Easing.ease),
    });
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  const vehicleText = `${entry.make} ${entry.model}${entry.year ? ` ${entry.year}` : ''}`;
  const priceText = entry.action === 'sale' && entry.salePrice
    ? `+ USD ${(entry.salePrice / 1000).toFixed(1)}k`
    : entry.purchasePrice > 0
    ? `+ USD ${(entry.purchasePrice / 1000).toFixed(1)}k`
    : '+ Agregado';

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <Text style={styles.vehicleText}>{vehicleText}</Text>
      <Text style={styles.priceText}>{priceText}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 20,
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
