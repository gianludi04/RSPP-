import React from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';
import { COLORS } from '@/constants/colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface HeaderProps {
  title: string;
  subtitle?: string;
  style?: ViewStyle;
  rightComponent?: React.ReactNode;
}

export default function Header({ title, subtitle, style, rightComponent }: HeaderProps) {
  const insets = useSafeAreaInsets();
  
  return (
    <View style={[
      styles.header, 
      { paddingTop: insets.top },
      style
    ]}>
      <View style={styles.content}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{title}</Text>
          {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
        </View>
        {rightComponent && <View>{rightComponent}</View>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: COLORS.primary,
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    color: COLORS.white,
    fontSize: 20,
    fontFamily: 'Inter-Bold',
  },
  subtitle: {
    color: COLORS.white,
    opacity: 0.8,
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    marginTop: 2,
  },
});