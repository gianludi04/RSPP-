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

  // daysUntil function moved outside, modified for testability, and exported below

  const getStatusColor = (date: Date, isUrgent: boolean) => {
    const days = daysUntil(date);
    if (days < 0) return COLORS.danger;
    if (isUrgent || days <= 7) return COLORS.warning;
    if (days <= 30) return COLORS.info;
    return COLORS.success;
  };

// Moved daysUntil outside the component, made it exportable and testable.
// Added currentDate parameter and date normalization.
export const daysUntil = (date: Date, currentDate: Date = new Date()): number => {
  const currentNormalized = new Date(currentDate);
  currentNormalized.setHours(0, 0, 0, 0); // Normalize current date to the beginning of the day

  const targetNormalized = new Date(date);
  targetNormalized.setHours(0, 0, 0, 0); // Normalize target date to the beginning of the day

  const diffTime = targetNormalized.getTime() - currentNormalized.getTime();
  // Use Math.round for days difference to be more precise around midnight
  // or Math.ceil if the intention is "any part of a day counts as a full day forward"
  // The original used Math.ceil. Let's stick to it for now but be mindful.
  // For "days until", if it's 0.5 days away, it's "1 day until" (tomorrow).
  // If it's -0.5 days ago, it's "0 days until" if we ceil (meaning today, or already passed today).
  // Let's re-evaluate ceil for past dates.
  // If target is 2024-04-10 and current is 2024-04-11 (target is yesterday)
  // diffTime = -24 * 3600 * 1000. diffDays = ceil(-1) = -1. This is correct.
  // If target is 2024-04-10 23:00 and current is 2024-04-10 01:00 (both normalized to 2024-04-10 00:00)
  // diffTime = 0. diffDays = ceil(0) = 0. This is correct.
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

export default function DeadlineCard({ items, onViewAll }: DeadlineCardProps) {
  const formatDate = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = { day: '2-digit', month: '2-digit', year: 'numeric' };
    return date.toLocaleDateString('it-IT', options);
  };

  // getStatusColor now uses the exported daysUntil, passing the item's date.
  // It will use the real 'new Date()' for currentDate by default.
  const getStatusColor = (date: Date, isUrgent: boolean) => {
    const days = daysUntil(date); // daysUntil will use its default new Date() for current time
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
        items.map((item, index) => (
          <View 
            key={item.id} 
            style={[
              styles.deadlineItemBase, 
              index < items.length - 1 && styles.deadlineItemBorder
            ]}
          >
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
  deadlineItemBase: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  deadlineItemBorder: {
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