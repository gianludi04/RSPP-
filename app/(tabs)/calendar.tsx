import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, FlatList } from 'react-native';
import { COLORS } from '@/constants/colors';
import { ChevronLeft, ChevronRight, Plus, FileText, Users, Clock, MapPin } from 'lucide-react-native';
import Header from '@/components/common/Header';
import Card from '@/components/common/Card';

interface Event {
  id: string;
  title: string;
  date: Date;
  time?: string;
  location?: string;
  type: 'deadline' | 'meeting' | 'task';
  category: string;
}

// Mock data
const events: Event[] = [
  {
    id: '1',
    title: 'Scadenza corso antincendio',
    date: new Date(2025, 3, 25),
    type: 'deadline',
    category: 'Formazione',
  },
  {
    id: '2',
    title: 'Riunione periodica',
    date: new Date(2025, 3, 25),
    time: '14:30 - 16:00',
    location: 'Sala riunioni A',
    type: 'meeting',
    category: 'Riunione',
  },
  {
    id: '3',
    title: 'Sopralluogo cantiere Via Roma',
    date: new Date(2025, 3, 26),
    time: '10:00 - 12:00',
    location: 'Via Roma 123',
    type: 'task',
    category: 'Sopralluogo',
  },
  {
    id: '4',
    title: 'Aggiornamento DVR',
    date: new Date(2025, 3, 28),
    type: 'deadline',
    category: 'Documento',
  },
];

// Generate calendar days
const generateCalendarDays = (year: number, month: number) => {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  
  // Adjust for Sunday as 0
  const startDay = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;
  
  const days = [];
  
  // Add empty spaces for days before the 1st of the month
  for (let i = 0; i < startDay; i++) {
    days.push({ day: '', date: null });
  }
  
  // Add days of the month
  for (let i = 1; i <= daysInMonth; i++) {
    const date = new Date(year, month, i);
    days.push({ day: i.toString(), date });
  }
  
  return days;
};

export default function CalendarScreen() {
  const now = new Date();
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth());
  const [selectedYear, setSelectedYear] = useState(now.getFullYear());
  const [selectedDate, setSelectedDate] = useState(now);

  const calendarDays = generateCalendarDays(selectedYear, selectedMonth);
  const weekDays = ['Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab', 'Dom'];
  const monthNames = [
    'Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno',
    'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'
  ];

  const prevMonth = () => {
    if (selectedMonth === 0) {
      setSelectedMonth(11);
      setSelectedYear(selectedYear - 1);
    } else {
      setSelectedMonth(selectedMonth - 1);
    }
  };

  const nextMonth = () => {
    if (selectedMonth === 11) {
      setSelectedMonth(0);
      setSelectedYear(selectedYear + 1);
    } else {
      setSelectedMonth(selectedMonth + 1);
    }
  };

  const isSameDay = (date1: Date, date2: Date) => {
    return date1 && date2 && 
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate();
  };

  const isToday = (date: Date | null) => {
    if (!date) return false;
    const today = new Date();
    return isSameDay(date, today);
  };

  const hasEvents = (date: Date | null) => {
    if (!date) return false;
    return events.some(event => isSameDay(event.date, date));
  };

  const filteredEvents = events.filter(event => isSameDay(event.date, selectedDate));

  const getEventIcon = (type: Event['type']) => {
    switch (type) {
      case 'deadline':
        return <FileText size={16} color={COLORS.warning} />;
      case 'meeting':
        return <Users size={16} color={COLORS.info} />;
      case 'task':
        return <Clock size={16} color={COLORS.primary} />;
      default:
        return <FileText size={16} color={COLORS.warning} />;
    }
  };

  return (
    <View style={styles.container}>
      <Header title="Scadenze" />
      
      <View style={styles.calendarContainer}>
        <View style={styles.monthSelector}>
          <TouchableOpacity onPress={prevMonth} style={styles.monthButton}>
            <ChevronLeft size={24} color={COLORS.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.monthTitle}>
            {monthNames[selectedMonth]} {selectedYear}
          </Text>
          <TouchableOpacity onPress={nextMonth} style={styles.monthButton}>
            <ChevronRight size={24} color={COLORS.textPrimary} />
          </TouchableOpacity>
        </View>
        
        <View style={styles.weekDays}>
          {weekDays.map((day, index) => (
            <Text key={index} style={styles.weekDay}>{day}</Text>
          ))}
        </View>
        
        <View style={styles.daysGrid}>
          {calendarDays.map((day, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.dayCell,
                day.date && isSameDay(day.date, selectedDate) && styles.selectedDay,
              ]}
              onPress={() => day.date && setSelectedDate(day.date)}
              disabled={!day.date}
            >
              <Text
                style={[
                  styles.dayText,
                  isToday(day.date) && styles.todayText,
                  day.date && isSameDay(day.date, selectedDate) && styles.selectedDayText,
                ]}
              >
                {day.day}
              </Text>
              {hasEvents(day.date) && <View style={styles.eventDot} />}
            </TouchableOpacity>
          ))}
        </View>
      </View>
      
      <View style={styles.eventsSection}>
        <View style={styles.eventsSectionHeader}>
          <Text style={styles.eventsSectionTitle}>
            {selectedDate.toLocaleDateString('it-IT', { 
              weekday: 'long', 
              day: 'numeric', 
              month: 'long' 
            })}
          </Text>
          <Text style={styles.eventCount}>
            {filteredEvents.length} {filteredEvents.length === 1 ? 'evento' : 'eventi'}
          </Text>
        </View>
        
        {filteredEvents.length > 0 ? (
          <FlatList
            data={filteredEvents}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.eventItem}>
                <View style={styles.eventIconContainer}>
                  {getEventIcon(item.type)}
                </View>
                <View style={styles.eventContent}>
                  <Text style={styles.eventTitle}>{item.title}</Text>
                  <View style={styles.eventDetails}>
                    <View style={styles.categoryBadge}>
                      <Text style={styles.categoryText}>{item.category}</Text>
                    </View>
                    {item.time && (
                      <View style={styles.eventDetailItem}>
                        <Clock size={14} color={COLORS.gray} style={styles.detailIcon} />
                        <Text style={styles.detailText}>{item.time}</Text>
                      </View>
                    )}
                    {item.location && (
                      <View style={styles.eventDetailItem}>
                        <MapPin size={14} color={COLORS.gray} style={styles.detailIcon} />
                        <Text style={styles.detailText}>{item.location}</Text>
                      </View>
                    )}
                  </View>
                </View>
              </TouchableOpacity>
            )}
            contentContainerStyle={styles.eventsList}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <View style={styles.noEventsContainer}>
            <Text style={styles.noEventsText}>Nessun evento per questa data</Text>
          </View>
        )}
      </View>
      
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
  calendarContainer: {
    backgroundColor: COLORS.white,
    paddingBottom: 16,
  },
  monthSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  monthButton: {
    padding: 8,
  },
  monthTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    color: COLORS.textPrimary,
  },
  weekDays: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  weekDay: {
    flex: 1,
    textAlign: 'center',
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: COLORS.gray,
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayCell: {
    width: '14.28%',
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedDay: {
    backgroundColor: COLORS.primary,
    borderRadius: 20,
  },
  dayText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: COLORS.textPrimary,
  },
  todayText: {
    fontFamily: 'Inter-Bold',
    color: COLORS.primary,
  },
  selectedDayText: {
    color: COLORS.white,
    fontFamily: 'Inter-Medium',
  },
  eventDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.primary,
    position: 'absolute',
    bottom: 6,
  },
  eventsSection: {
    flex: 1,
    padding: 16,
  },
  eventsSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  eventsSectionTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    color: COLORS.textPrimary,
  },
  eventCount: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: COLORS.gray,
  },
  eventsList: {
    paddingBottom: 16,
  },
  eventItem: {
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
  eventIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.veryLightGray,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  eventContent: {
    flex: 1,
  },
  eventTitle: {
    fontFamily: 'Inter-Medium',
    fontSize: 15,
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  eventDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  categoryBadge: {
    backgroundColor: COLORS.veryLightGray,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    marginRight: 8,
    marginBottom: 4,
  },
  categoryText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: COLORS.textSecondary,
  },
  eventDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
    marginBottom: 4,
  },
  detailIcon: {
    marginRight: 4,
  },
  detailText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: COLORS.gray,
  },
  noEventsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noEventsText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: COLORS.gray,
    fontStyle: 'italic',
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