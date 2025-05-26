import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { COLORS } from '@/constants/colors';
import { ArrowRight, TriangleAlert as AlertTriangle, CircleCheck as CheckCircle, Info } from 'lucide-react-native';
import Card from '@/components/common/Card';

interface Notification {
  id: string;
  title: string;
  message: string;
  date: Date;
  type: 'warning' | 'info' | 'success';
  isRead: boolean;
}

interface NotificationCardProps {
  notifications: Notification[];
  onViewAll: () => void;
  onNotificationPress: (id: string) => void;
}

export default function NotificationCard({ 
  notifications, 
  onViewAll,
  onNotificationPress 
}: NotificationCardProps) {
  // formatDate function moved outside the component and exported below

  const getNotificationIcon = (type: Notification['type']) => {
    const diffMins = Math.round(diffMs / 60000);
    const diffHours = Math.round(diffMs / 3600000);
    const diffDays = Math.round(diffMs / 86400000);
    
    if (diffMins < 60) {
      return `${diffMins} min fa`;
    } else if (diffHours < 24) {
      return `${diffHours} ore fa`;
    } else if (diffDays === 1) {
      return 'Ieri';
    } else if (diffDays < 7) {
      return `${diffDays} giorni fa`;
    } else {
      const options: Intl.DateTimeFormatOptions = { day: '2-digit', month: '2-digit' };
      return date.toLocaleDateString('it-IT', options);
    }
  };

// Moved formatDate outside the component to make it exportable and testable.
export const formatDate = (date: Date): string => {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.round(diffMs / 60000);
  const diffHours = Math.round(diffMs / 3600000);
  const diffDays = Math.round(diffMs / 86400000);
  
  if (diffMins < 60) {
    return `${diffMins} min fa`;
  } else if (diffHours < 24) {
    return `${diffHours} ore fa`;
  } else if (diffDays === 1) {
    return 'Ieri';
  } else if (diffDays < 7) {
    return `${diffDays} giorni fa`;
  } else {
    const options: Intl.DateTimeFormatOptions = { day: '2-digit', month: '2-digit' };
    return date.toLocaleDateString('it-IT', options);
  }
};

export default function NotificationCard({ 
  notifications, 
  onViewAll,
  onNotificationPress 
}: NotificationCardProps) {
  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'warning':
        return <AlertTriangle size={20} color={COLORS.warning} />;
      case 'success':
        return <CheckCircle size={20} color={COLORS.success} />;
      case 'info':
        return <Info size={20} color={COLORS.info} />;
      default:
        return <Info size={20} color={COLORS.info} />;
    }
  };

  // Original component return statement starts here
  return (
    <Card>
      <View style={styles.header}>
        <Text style={styles.title}>Notifiche</Text>
        <TouchableOpacity onPress={onViewAll} style={styles.viewAllButton}>
          <Text style={styles.viewAllText}>Vedi tutte</Text>
          <ArrowRight size={16} color={COLORS.primary} />
        </TouchableOpacity>
      </View>
      
      {notifications.length === 0 ? (
        <Text style={styles.emptyText}>Nessuna notifica</Text>
      ) : (
        notifications.map((notification, index) => (
          <TouchableOpacity
            key={notification.id}
            style={[
              styles.notificationItemBase,
              !notification.isRead && styles.unreadNotification,
              index < notifications.length - 1 && styles.notificationItemBorder
            ]}
            onPress={() => onNotificationPress(notification.id)}
          >
            <View style={styles.iconContainer}>
              {getNotificationIcon(notification.type)}
            </View>
            <View style={styles.notificationContent}>
              <Text style={styles.notificationTitle}>{notification.title}</Text>
              <Text style={styles.notificationMessage} numberOfLines={2}>
                {notification.message}
              </Text>
              <Text style={styles.notificationDate}>{formatDate(notification.date)}</Text>
            </View>
          </TouchableOpacity>
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
  notificationItemBase: {
    flexDirection: 'row',
    paddingVertical: 12,
  },
  notificationItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  unreadNotification: {
    backgroundColor: COLORS.veryLightGray,
    borderRadius: 8,
    marginHorizontal: -8,
    paddingHorizontal: 8,
  },
  iconContainer: {
    marginRight: 12,
    paddingTop: 2,
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 15,
    fontFamily: 'Inter-Medium',
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  notificationMessage: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: COLORS.textSecondary,
    marginBottom: 6,
  },
  notificationDate: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: COLORS.gray,
  },
});