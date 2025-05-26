import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, FlatList, TextInput } from 'react-native';
import { COLORS } from '@/constants/colors';
import { File, FolderOpen, Plus, Search, Filter, Download, CreditCard as Edit, Share2 } from 'lucide-react-native';
import Header from '@/components/common/Header';

interface Document {
  id: string;
  title: string;
  type: string;
  date: Date;
  size: string;
  category: string;
}

// Mock data
const documents: Document[] = [
  {
    id: '1',
    title: 'DVR Generale 2024',
    type: 'PDF',
    date: new Date(2025, 2, 15),
    size: '2.4 MB',
    category: 'Valutazione Rischi',
  },
  {
    id: '2',
    title: 'DUVRI Cantiere Via Roma',
    type: 'PDF',
    date: new Date(2025, 3, 20),
    size: '1.8 MB',
    category: 'DUVRI',
  },
  {
    id: '3',
    title: 'Piano di Emergenza Sede',
    type: 'DOCX',
    date: new Date(2025, 1, 10),
    size: '3.2 MB',
    category: 'Emergenza',
  },
  {
    id: '4',
    title: 'Nomina RSPP',
    type: 'PDF',
    date: new Date(2025, 0, 5),
    size: '0.5 MB',
    category: 'Nomine',
  },
  {
    id: '5',
    title: 'Registro Formazione',
    type: 'XLSX',
    date: new Date(2025, 3, 15),
    size: '1.1 MB',
    category: 'Formazione',
  },
  {
    id: '6',
    title: 'Verbale sopralluogo Marzo 2024',
    type: 'PDF',
    date: new Date(2025, 2, 25),
    size: '0.8 MB',
    category: 'Verbali',
  },
];

const categories = [
  'Tutti',
  'Valutazione Rischi',
  'DUVRI',
  'Emergenza',
  'Nomine',
  'Formazione',
  'Verbali',
];

export default function DocumentsScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tutti');
  
  const formatDate = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = { day: '2-digit', month: '2-digit', year: 'numeric' };
    return date.toLocaleDateString('it-IT', options);
  };

  const getFileIcon = (type: string) => {
    let color = COLORS.primary;
    
    switch (type) {
      case 'PDF':
        color = COLORS.danger;
        break;
      case 'DOCX':
        color = COLORS.info;
        break;
      case 'XLSX':
        color = COLORS.success;
        break;
      default:
        color = COLORS.primary;
    }
    
    return <File size={20} color={color} />;
  };

  const filteredDocuments = documents
    .filter(doc => 
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.category.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .filter(doc => 
      selectedCategory === 'Tutti' ? true : doc.category === selectedCategory
    );

  return (
    <View style={styles.container}>
      <Header 
        title="Documenti" 
        rightComponent={
          <TouchableOpacity style={styles.headerButton}>
            <Filter size={20} color={COLORS.white} />
          </TouchableOpacity>
        }
      />

      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Search size={18} color={COLORS.gray} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Cerca documenti..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor={COLORS.gray}
          />
        </View>
      </View>
      
      <View style={styles.categoriesContainer}>
        <FlatList
          data={categories}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.categoryChip,
                selectedCategory === item && styles.selectedCategoryChip
              ]}
              onPress={() => setSelectedCategory(item)}
            >
              <Text
                style={[
                  styles.categoryChipText,
                  selectedCategory === item && styles.selectedCategoryChipText
                ]}
              >
                {item}
              </Text>
            </TouchableOpacity>
          )}
          contentContainerStyle={styles.categoriesList}
        />
      </View>
      
      <View style={styles.folderContainer}>
        <View style={styles.folderHeader}>
          <FolderOpen size={18} color={COLORS.primary} />
          <Text style={styles.folderTitle}>
            {selectedCategory === 'Tutti' ? 'Tutti i documenti' : selectedCategory}
          </Text>
          <Text style={styles.documentCount}>
            {filteredDocuments.length} {filteredDocuments.length === 1 ? 'documento' : 'documenti'}
          </Text>
        </View>
        
        {filteredDocuments.length > 0 ? (
          <FlatList
            data={filteredDocuments}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.documentItem}>
                <View style={styles.documentInfo}>
                  {getFileIcon(item.type)}
                  <View style={styles.documentDetails}>
                    <Text style={styles.documentTitle}>{item.title}</Text>
                    <View style={styles.documentMeta}>
                      <View style={styles.typeBadge}>
                        <Text style={styles.typeText}>{item.type}</Text>
                      </View>
                      <Text style={styles.documentDate}>{formatDate(item.date)}</Text>
                      <Text style={styles.documentSize}>{item.size}</Text>
                    </View>
                  </View>
                </View>
                <View style={styles.documentActions}>
                  <TouchableOpacity style={styles.actionButton}>
                    <Download size={18} color={COLORS.primary} />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.actionButton}>
                    <Edit size={18} color={COLORS.gray} />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.actionButton}>
                    <Share2 size={18} color={COLORS.gray} />
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            )}
            contentContainerStyle={styles.documentsList}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Nessun documento trovato</Text>
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
  headerButton: {
    padding: 8,
  },
  searchContainer: {
    backgroundColor: COLORS.white,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.veryLightGray,
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: COLORS.textPrimary,
  },
  categoriesContainer: {
    backgroundColor: COLORS.white,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  categoriesList: {
    paddingHorizontal: 16,
  },
  categoryChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: COLORS.veryLightGray,
    marginRight: 8,
  },
  selectedCategoryChip: {
    backgroundColor: COLORS.primary,
  },
  categoryChipText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: COLORS.textPrimary,
  },
  selectedCategoryChipText: {
    color: COLORS.white,
  },
  folderContainer: {
    flex: 1,
    padding: 16,
  },
  folderHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  folderTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    color: COLORS.textPrimary,
    marginLeft: 8,
    flex: 1,
  },
  documentCount: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: COLORS.gray,
  },
  documentsList: {
    paddingBottom: 16,
  },
  documentItem: {
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
  documentInfo: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  documentDetails: {
    marginLeft: 12,
    flex: 1,
  },
  documentTitle: {
    fontFamily: 'Inter-Medium',
    fontSize: 15,
    color: COLORS.textPrimary,
    marginBottom: 6,
  },
  documentMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  typeBadge: {
    backgroundColor: COLORS.veryLightGray,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginRight: 8,
  },
  typeText: {
    fontSize: 11,
    fontFamily: 'Inter-Medium',
    color: COLORS.textSecondary,
  },
  documentDate: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: COLORS.gray,
    marginRight: 8,
  },
  documentSize: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: COLORS.gray,
  },
  documentActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    borderTopWidth: 1,
    borderTopColor: COLORS.lightGray,
    paddingTop: 12,
  },
  actionButton: {
    padding: 8,
    marginLeft: 16,
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