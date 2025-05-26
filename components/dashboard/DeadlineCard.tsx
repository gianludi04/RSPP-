import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { COLORS } from '@/constants/colors';
import { Clock, ArrowRight } from 'lucide-react-native';
import Card from '@/components/common/Card';

interface DeadlineItem {
  id: string;
  title: string;
  date: Date;
  type: string;
  isUrgent: boolean;
}

interface DeadlineCardProps {
  items: DeadlineItem[];
  onViewAll: () => void;
}

export default function DeadlineCard({ items, onViewAll }: DeadlineCardProps) {
  const formatDate = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = { day: '2-digit', month: '2-digit', year: 'numeric' };
    return date.toLocaleDateString('it-IT', options);
  };

  const daysUntil = (date: Date) => {
    const today = new Date();
    const diffTime = date.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getStatusColor = (date: Date, isUrgent: boolean) => {
    const days = daysUntil(date);
    if (days < 0) return COLORS.danger;
    if (isUrgent || days <= 7) return COLORS.warning;
    if (days <= 30) return COLORS.info;
    return COLORS.success;
  };

  return (
    <Card>
      <View style={styles.header}>
        <Text style={styles.title}>Scadenze Imminenti</Text>
        <TouchableOpacity onPress={onViewAll} style={styles.viewAllButton}>
          <Text style={styles.viewAllText}>Vedi tutte</Text>
          <ArrowRight size={16} color={COLORS.primary} />
        </TouchableOpacity>
      </View>
      
      {items.length === 0 ? (
        <Text style={styles.emptyText}>Nessuna scadenza imminente</Text>
      ) : (
        items.map((item) => (
          <View key={item.id} style={styles.deadlineItem}>
            <View style={[styles.indicator, { backgroundColor: getStatusColor(item.date, item.isUrgent) }]} />
            <View style={styles.deadlineContent}>
              <Text style={styles.deadlineTitle}>{item.title}</Text>
              <View style={styles.deadlineInfo}>
                <Clock size={14} color={COLORS.gray} style={styles.icon} />
                <Text style={styles.deadlineDate}>{formatDate(item.date)}</Text>
                <View style={styles.typeBadge}>
                  <Text style={styles.typeText}>{item.type}</Text>
                </View>
              </View>
            </View>
          </View>
        ))
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: COLORS.textPrimary,
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewAllText: {
    color: COLORS.primary,
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    marginRight: 4,
  },
  emptyText: {
    color: COLORS.gray,
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    fontStyle: 'italic',
    textAlign: 'center',
    paddingVertical: 16,
  },
  deadlineItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 12,
  },
  deadlineContent: {
    flex: 1,
  },
  deadlineTitle: {
    fontSize: 15,
    fontFamily: 'Inter-Medium',
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  deadlineInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 4,
  },
  deadlineDate: {
    fontSize: 13,
    fontFamily: 'Inter-Regular',
    color: COLORS.textSecondary,
  },
  typeBadge: {
    backgroundColor: COLORS.veryLightGray,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    marginLeft: 8,
  },
  typeText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: COLORS.textSecondary,
  },
});