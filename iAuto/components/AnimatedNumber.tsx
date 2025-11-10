import React, { useEffect, useState } from 'react';
import { Text, TextStyle } from 'react-native';

interface AnimatedNumberProps {
  value: number;
  style?: TextStyle;
  prefix?: string;
  suffix?: string;
  decimals?: number;
}

export function AnimatedNumber({
  value,
  style,
  prefix = '',
  suffix = '',
  decimals = 1
}: AnimatedNumberProps) {
  const [displayValue, setDisplayValue] = useState(value);

  useEffect(() => {
    // Simple transition
    const timer = setTimeout(() => {
      setDisplayValue(value);
    }, 50);

    return () => clearTimeout(timer);
  }, [value]);

  const formattedValue = displayValue >= 1000
    ? `${(displayValue / 1000).toFixed(decimals)}k`
    : displayValue.toFixed(0);

  return (
    <Text style={style}>
      {prefix}{formattedValue}{suffix}
    </Text>
  );
}
