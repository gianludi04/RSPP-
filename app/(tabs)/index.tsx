import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { COLORS } from '@/constants/colors';
import { Plus, Search } from 'lucide-react-native';
import Header from '@/components/common/Header';
import StatsCard from '@/components/dashboard/StatsCard';
import DeadlineCard from '@/components/dashboard/DeadlineCard';
import ActivityList from '@/components/dashboard/ActivityList';
import NotificationCard from '@/components/dashboard/NotificationCard';

// Mock data
const stats = [
  { label: 'Scadenze', value: 12, color: COLORS.primary },
  { label: 'Verifiche', value: 8, color: COLORS.info },
  { label: 'Documenti', value: 45, color: COLORS.success },
  { label: 'Segnalazioni', value: 3, color: COLORS.warning },
];

const deadlines = [
  { 
    id: '1', 
    title: 'Rinnovo corso primo soccorso', 
    date: new Date(2025, 5, 15), 
    type: 'Formazione', 
    isUrgent: false 
  },
  { 
    id: '2', 
    title: 'Verifica estintori', 
    date: new Date(2025, 4, 10), 
    type: 'Verifica', 
    isUrgent: true 
  },
  { 
    id: '3', 
    title: 'Aggiornamento DVR', 
    date: new Date(2025, 4, 5), 
    type: 'Documento', 
    isUrgent: false 
  },
];

const activities = [
  {
    id: '1',
    title: 'Sopralluogo cantiere via Roma',
    description: 'Sopralluogo periodico per verifica misure di sicurezza',
    date: new Date(2025, 3, 28),
    status: 'completed' as const,
  },
  {
    id: '2',
    title: 'Aggiornamento piano di emergenza',
    description: 'Revisione del piano di emergenza per la sede centrale',
    date: new Date(2025, 3, 29),
    status: 'in-progress' as const,
  },
];

const notifications = [
  {
    id: '1',
    title: 'Nuova segnalazione',
    message: 'Giovanni Rossi ha segnalato un rischio nel reparto produzione',
    date: new Date(2025, 3, 29, 10, 30),
    type: 'warning' as const,
    isRead: false,
  },
  {
    id: '2',
    title: 'Documento approvato',
    message: 'Il DUVRI per il cantiere di Via Roma è stato approvato',
    date: new Date(2025, 3, 28, 15, 45),
    type: 'success' as const,
    isRead: true,
  },
];

export default function DashboardScreen() {
  const handleViewAllDeadlines = () => {
    console.log('View all deadlines');
  };

  const handleViewAllActivities = () => {
    console.log('View all activities');
  };

  const handleViewAllNotifications = () => {
    console.log('View all notifications');
  };

  const handleNotificationPress = (id: string) => {
    console.log(`Notification pressed: ${id}`);
  };

  return (
    <View style={styles.container}>
      <Header 
        title="RSPP+"
        subtitle="La tua sicurezza sempre con te"
        rightComponent={
          <TouchableOpacity style={styles.searchButton}>
            <Search size={22} color={COLORS.white} />
          </TouchableOpacity>
        }
      />
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeText}>Benvenuto, Mario</Text>
          <Text style={styles.dateText}>
            {new Date().toLocaleDateString('it-IT', { 
              weekday: 'long', 
              day: 'numeric', 
              month: 'long', 
              year: 'numeric' 
            })}
          </Text>
        </View>
        
        <StatsCard title="Panoramica" stats={stats} />
        <DeadlineCard items={deadlines} onViewAll={handleViewAllDeadlines} />
        <ActivityList activities={activities} onViewAll={handleViewAllActivities} />
        <NotificationCard 
          notifications={notifications} 
          onViewAll={handleViewAllNotifications}
          onNotificationPress={handleNotificationPress}
        />
      </ScrollView>
      
      <TouchableOpacity style={styles.fab}>
        <Plus size={24} color={COLORS.white} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  welcomeSection: {
    marginBottom: 16,
  },
  welcomeText: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: COLORS.textPrimary,
  },
  dateText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  searchButton: {
    padding: 8,
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});