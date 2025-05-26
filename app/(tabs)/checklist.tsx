import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import { COLORS } from '@/constants/colors';
import { Plus, Filter, CircleCheck as CheckCircle, CircleCheck as CheckCircle2, Circle } from 'lucide-react-native';
import Header from '@/components/common/Header';
import Card from '@/components/common/Card';

interface ChecklistItem {
  id: string;
  title: string;
  type: string;
  date: Date;
  items: number;
  completed: number;
}

// Mock data
const checklists: ChecklistItem[] = [
  {
    id: '1',
    title: 'Sopralluogo cantiere Via Roma',
    type: 'Cantiere',
    date: new Date(2025, 3, 25),
    items: 15,
    completed: 15,
  },
  {
    id: '2',
    title: 'Ispezione dispositivi protezione individuale',
    type: 'DPI',
    date: new Date(2025, 3, 28),
    items: 12,
    completed: 5,
  },
  {
    id: '3',
    title: 'Verifica estintori sede centrale',
    type: 'Antincendio',
    date: new Date(2025, 3, 30),
    items: 8,
    completed: 0,
  },
  {
    id: '4',
    title: 'Audit sicurezza uffici',
    type: 'Audit',
    date: new Date(2025, 4, 2),
    items: 20,
    completed: 0,
  },
];

const checklistTemplates = [
  { id: '1', title: 'Sopralluogo cantiere', items: 15 },
  { id: '2', title: 'Verifica DPI', items: 12 },
  { id: '3', title: 'Ispezione antincendio', items: 8 },
  { id: '4', title: 'Audit sicurezza', items: 20 },
];

export default function ChecklistScreen() {
  const [activeTab, setActiveTab] = useState('current');

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [checklistData, setChecklistData] = useState<any>(null); // Example, adjust as needed

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate 1 second delay

        // Simulate success/failure randomly
        if (Math.random() < 0.1) { // 10% chance of error
          throw new Error("Failed to load checklist. Please try again.");
        }
        
        setChecklistData({ items: checklists, templates: checklistTemplates }); // Example data
        setIsLoading(false);
      } catch (e: any) {
        setError(e.message || "An unexpected error occurred.");
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);
  
  const formatDate = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = { day: '2-digit', month: '2-digit', year: 'numeric' };
    return date.toLocaleDateString('it-IT', options);
  };

  const getStatusIcon = (checklist: ChecklistItem) => {
    if (checklist.completed === 0) {
      return <Circle size={18} color={COLORS.gray} />;
    } else if (checklist.completed < checklist.items) {
      return <CheckCircle2 size={18} color={COLORS.warning} />;
    } else {
      return <CheckCircle size={18} color={COLORS.success} />;
    }
  };

  const renderChecklistItem = ({ item }: { item: ChecklistItem }) => (
    <TouchableOpacity style={styles.checklistItem}>
      <View style={styles.checklistItemHeader}>
        <View style={styles.titleContainer}>
          {getStatusIcon(item)}
          <Text style={styles.checklistTitle}>{item.title}</Text>
        </View>
        <View style={styles.typeBadge}>
          <Text style={styles.typeText}>{item.type}</Text>
        </View>
      </View>
      <View style={styles.checklistItemFooter}>
        <Text style={styles.dateText}>{formatDate(item.date)}</Text>
        <Text style={styles.progressText}>
          {item.completed}/{item.items} completati
        </Text>
      </View>
    </TouchableOpacity>
  );

  const renderTemplateItem = ({ item }: { item: { id: string; title: string; items: number } }) => (
    <TouchableOpacity style={styles.templateItem}>
      <Text style={styles.templateTitle}>{item.title}</Text>
      <Text style={styles.templateInfo}>{item.items} elementi</Text>
    </TouchableOpacity>
  );

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.background }}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={{ marginTop: 10, color: COLORS.textSecondary, fontFamily: 'Inter-Regular' }}>Loading Checklist...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20, backgroundColor: COLORS.background }}>
        <Text style={{ color: COLORS.danger, fontSize: 16, textAlign: 'center', fontFamily: 'Inter-Medium' }}>{error}</Text>
        {/* Optional: Add a retry button */}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header 
        title="Checklist"
        rightComponent={
          <TouchableOpacity style={styles.filterButton}>
            <Filter size={20} color={COLORS.white} />
          </TouchableOpacity>
        }
      />

      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tabButton, activeTab === 'current' && styles.activeTabButton]}
          onPress={() => setActiveTab('current')}
        >
          <Text style={[styles.tabButtonText, activeTab === 'current' && styles.activeTabButtonText]}>
            Attive
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tabButton, activeTab === 'templates' && styles.activeTabButton]}
          onPress={() => setActiveTab('templates')}
        >
          <Text style={[styles.tabButtonText, activeTab === 'templates' && styles.activeTabButtonText]}>
            Modelli
          </Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'current' ? (
        <>
          <FlatList
            data={checklists}
            renderItem={renderChecklistItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
          
          <TouchableOpacity style={styles.fab}>
            <Plus size={24} color={COLORS.white} />
          </TouchableOpacity>
        </>
      ) : (
        <FlatList
          data={checklistTemplates}
          renderItem={renderTemplateItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  filterButton: {
    padding: 8,
  },
  tabContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
    backgroundColor: COLORS.white,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  activeTabButton: {
    borderBottomWidth: 2,
    borderBottomColor: COLORS.primary,
  },
  tabButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: COLORS.gray,
  },
  activeTabButtonText: {
    color: COLORS.primary,
  },
  listContent: {
    padding: 16,
  },
  checklistItem: {
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
  checklistItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  checklistTitle: {
    fontFamily: 'Inter-Medium',
    fontSize: 15,
    color: COLORS.textPrimary,
    marginLeft: 8,
    flex: 1,
  },
  typeBadge: {
    backgroundColor: COLORS.veryLightGray,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  typeText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: COLORS.textSecondary,
  },
  checklistItemFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateText: {
    fontFamily: 'Inter-Regular',
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  progressText: {
    fontFamily: 'Inter-Medium',
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  templateItem: {
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
  templateTitle: {
    fontFamily: 'Inter-Medium',
    fontSize: 15,
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  templateInfo: {
    fontFamily: 'Inter-Regular',
    fontSize: 13,
    color: COLORS.textSecondary,
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