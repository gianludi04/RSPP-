import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { COLORS } from '@/constants/colors';
import Card from '@/components/common/Card';

interface Stat {
  label: string;
  value: number;
  color: string;
}

interface StatsCardProps {
  title: string;
  stats: Stat[];
}

export default function StatsCard({ title, stats }: StatsCardProps) {
  return (
    <Card>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.statsContainer}>
        {stats.map((stat, index) => (
          <View key={index} style={styles.statItem}>
            <View style={[styles.statValue, { backgroundColor: stat.color }]}>
              <Text style={styles.statValueText}>{stat.value}</Text>
            </View>
            <Text style={styles.statLabel}>{stat.label}</Text>
          </View>
        ))}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: COLORS.textPrimary,
    marginBottom: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 8, // Adds space between items
  },
  statItem: {
    flex: 1, // Allows items to share space equally
    alignItems: 'center',
  },
  statValue: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statValueText: {
    color: COLORS.white,
    fontSize: 18,
    fontFamily: 'Inter-Bold',
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
});