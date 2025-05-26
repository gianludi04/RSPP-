import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { COLORS } from '@/constants/colors';
import { ArrowRight, Clock } from 'lucide-react-native';
import Card from '@/components/common/Card';

interface Activity {
  id: string;
  title: string;
  description: string;
  date: Date;
  status: 'completed' | 'in-progress' | 'pending' | 'overdue';
}

interface ActivityListProps {
  activities: Activity[];
  onViewAll: () => void;
}

export default function ActivityList({ activities, onViewAll }: ActivityListProps) {
  const formatDate = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = { day: '2-digit', month: '2-digit', year: 'numeric' };
    return date.toLocaleDateString('it-IT', options);
  };

  const getStatusColor = (status: Activity['status']) => {
    switch (status) {
      case 'completed':
        return COLORS.success;
      case 'in-progress':
        return COLORS.info;
      case 'pending':
        return COLORS.warning;
      case 'overdue':
        return COLORS.danger;
      default:
        return COLORS.gray;
    }
  };

  const getStatusText = (status: Activity['status']) => {
    switch (status) {
      case 'completed':
        return 'Completata';
      case 'in-progress':
        return 'In corso';
      case 'pending':
        return 'In attesa';
      case 'overdue':
        return 'In ritardo';
      default:
        return '';
    }
  };

  return (
    <Card>
      <View style={styles.header}>
        <Text style={styles.title}>Attività Recenti</Text>
        <TouchableOpacity onPress={onViewAll} style={styles.viewAllButton}>
          <Text style={styles.viewAllText}>Vedi tutte</Text>
          <ArrowRight size={16} color={COLORS.primary} />
        </TouchableOpacity>
      </View>
      
      {activities.length === 0 ? (
        <Text style={styles.emptyText}>Nessuna attività recente</Text>
      ) : (
        activities.map((activity, index) => (
          <View 
            key={activity.id} 
            style={[
              styles.activityItemBase, 
              index < activities.length - 1 && styles.activityItemBorder
            ]}
          >
            <View style={styles.activityHeader}>
              <Text style={styles.activityTitle}>{activity.title}</Text>
              <View style={[styles.statusBadge, { backgroundColor: getStatusColor(activity.status) }]}>
                <Text style={styles.statusText}>{getStatusText(activity.status)}</Text>
              </View>
            </View>
            <Text style={styles.activityDescription} numberOfLines={2}>{activity.description}</Text>
            <View style={styles.activityFooter}>
              <Clock size={14} color={COLORS.gray} style={styles.icon} />
              <Text style={styles.activityDate}>{formatDate(activity.date)}</Text>
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
  activityItemBase: {
    paddingVertical: 12,
  },
  activityItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  activityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  activityTitle: {
    fontSize: 15,
    fontFamily: 'Inter-Medium',
    color: COLORS.textPrimary,
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    marginLeft: 8,
  },
  statusText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: COLORS.white,
  },
  activityDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: COLORS.textSecondary,
    marginBottom: 8,
  },
  activityFooter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 4,
  },
  activityDate: {
    fontSize: 13,
    fontFamily: 'Inter-Regular',
    color: COLORS.textSecondary,
  },
});