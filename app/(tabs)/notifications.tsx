import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, FlatList, Switch } from 'react-native';
import { COLORS } from '@/constants/colors';
import { TriangleAlert as AlertTriangle, CircleCheck as CheckCircle, Info, Filter, Trash2 } from 'lucide-react-native';
import Header from '@/components/common/Header';

interface Notification {
  id: string;
  title: string;
  message: string;
  date: Date;
  type: 'warning' | 'info' | 'success';
  isRead: boolean;
}

// Mock data
const allNotifications: Notification[] = [
  {
    id: '1',
    title: 'Nuova segnalazione',
    message: 'Giovanni Rossi ha segnalato un rischio nel reparto produzione',
    date: new Date(2025, 3, 29, 10, 30),
    type: 'warning',
    isRead: false,
  },
  {
    id: '2',
    title: 'Documento approvato',
    message: 'Il DUVRI per il cantiere di Via Roma è stato approvato',
    date: new Date(2025, 3, 28, 15, 45),
    type: 'success',
    isRead: true,
  },
  {
    id: '3',
    title: 'Scadenza imminente',
    message: 'Il corso antincendio per 3 dipendenti scade tra 7 giorni',
    date: new Date(2025, 3, 27, 9, 15),
    type: 'info',
    isRead: false,
  },
  {
    id: '4',
    title: 'Non conformità rilevata',
    message: 'Non conformità rilevata durante il sopralluogo del cantiere',
    date: new Date(2025, 3, 26, 14, 20),
    type: 'warning',
    isRead: true,
  },
  {
    id: '5',
    title: 'Aggiornamento normativa',
    message: 'Nuovo aggiornamento normativa sicurezza sul lavoro',
    date: new Date(2025, 3, 25, 11, 45),
    type: 'info',
    isRead: true,
  },
];

export default function NotificationsScreen() {
  const [notifications, setNotifications] = useState<Notification[]>(allNotifications);
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);
  
  const formatDate = (date: Date) => {
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
      const options: Intl.DateTimeFormatOptions = { 
        day: '2-digit', 
        month: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      };
      return date.toLocaleDateString('it-IT', options);
    }
  };

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

  const handleNotificationPress = (id: string) => {
    setNotifications(
      notifications.map(notification => 
        notification.id === id 
          ? { ...notification, isRead: true } 
          : notification
      )
    );
  };

  const handleClearAll = () => {
    setNotifications([]);
  };

  const handleMarkAllAsRead = () => {
    setNotifications(
      notifications.map(notification => ({ ...notification, isRead: true }))
    );
  };

  const filteredNotifications = notifications
    .filter(notification => showUnreadOnly ? !notification.isRead : true)
    .filter(notification => selectedFilter ? notification.type === selectedFilter : true);

  return (
    <View style={styles.container}>
      <Header 
        title="Notifiche" 
        rightComponent={
          <TouchableOpacity onPress={handleClearAll} style={styles.headerButton}>
            <Trash2 size={20} color={COLORS.white} />
          </TouchableOpacity>
        }
      />

      <View style={styles.filterSection}>
        <View style={styles.filterRow}>
          <Text style={styles.filterLabel}>Solo non lette</Text>
          <Switch
            value={showUnreadOnly}
            onValueChange={setShowUnreadOnly}
            trackColor={{ false: COLORS.lightGray, true: COLORS.primary }}
            thumbColor={COLORS.white}
          />
        </View>
        
        <View style={styles.typeFilters}>
          <TouchableOpacity 
            style={[
              styles.typeFilterButton,
              selectedFilter === null && styles.activeFilterButton
            ]}
            onPress={() => setSelectedFilter(null)}
          >
            <Text style={[
              styles.typeFilterText,
              selectedFilter === null && styles.activeFilterText
            ]}>Tutti</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.typeFilterButton,
              selectedFilter === 'warning' && styles.activeFilterButton
            ]}
            onPress={() => setSelectedFilter('warning')}
          >
            <AlertTriangle size={14} color={selectedFilter === 'warning' ? COLORS.white : COLORS.warning} style={styles.filterIcon} />
            <Text style={[
              styles.typeFilterText,
              selectedFilter === 'warning' && styles.activeFilterText
            ]}>Avvisi</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.typeFilterButton,
              selectedFilter === 'info' && styles.activeFilterButton
            ]}
            onPress={() => setSelectedFilter('info')}
          >
            <Info size={14} color={selectedFilter === 'info' ? COLORS.white : COLORS.info} style={styles.filterIcon} />
            <Text style={[
              styles.typeFilterText,
              selectedFilter === 'info' && styles.activeFilterText
            ]}>Info</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.typeFilterButton,
              selectedFilter === 'success' && styles.activeFilterButton
            ]}
            onPress={() => setSelectedFilter('success')}
          >
            <CheckCircle size={14} color={selectedFilter === 'success' ? COLORS.white : COLORS.success} style={styles.filterIcon} />
            <Text style={[
              styles.typeFilterText,
              selectedFilter === 'success' && styles.activeFilterText
            ]}>Successi</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      <View style={styles.actionRow}>
        <Text style={styles.notificationCount}>
          {filteredNotifications.length} {filteredNotifications.length === 1 ? 'notifica' : 'notifiche'}
        </Text>
        <TouchableOpacity onPress={handleMarkAllAsRead}>
          <Text style={styles.markAllAsRead}>Segna tutte come lette</Text>
        </TouchableOpacity>
      </View>
      
      {filteredNotifications.length > 0 ? (
        <FlatList
          data={filteredNotifications}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.notificationItem,
                !item.isRead && styles.unreadNotification
              ]}
              onPress={() => handleNotificationPress(item.id)}
            >
              <View style={styles.iconContainer}>
                {getNotificationIcon(item.type)}
              </View>
              <View style={styles.notificationContent}>
                <Text style={styles.notificationTitle}>{item.title}</Text>
                <Text style={styles.notificationMessage}>{item.message}</Text>
                <Text style={styles.notificationDate}>{formatDate(item.date)}</Text>
              </View>
            </TouchableOpacity>
          )}
          contentContainerStyle={styles.notificationsList}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Nessuna notifica</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  headerButton: {
    padding: 8,
  },
  filterSection: {
    backgroundColor: COLORS.white,
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  filterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  filterLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: COLORS.textPrimary,
  },
  typeFilters: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  typeFilterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    backgroundColor: COLORS.veryLightGray,
  },
  activeFilterButton: {
    backgroundColor: COLORS.primary,
  },
  filterIcon: {
    marginRight: 4,
  },
  typeFilterText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: COLORS.textPrimary,
  },
  activeFilterText: {
    color: COLORS.white,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  notificationCount: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  markAllAsRead: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: COLORS.primary,
  },
  notificationsList: {
    padding: 16,
  },
  notificationItem: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  unreadNotification: {
    borderLeftWidth: 3,
    borderLeftColor: COLORS.primary,
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
    marginBottom: 8,
  },
  notificationDate: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: COLORS.gray,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: COLORS.gray,
    fontStyle: 'italic',
  },
});