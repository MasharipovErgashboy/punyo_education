import React, { useState } from 'react';
import { StyleSheet, Text, View, Image, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

export default function TestsScreen({ lang, onViewAll, onViewTest }) {
  const insets = useSafeAreaInsets();
  const TestItem = ({ icon, title, subtitle }) => (
    <View style={styles.courseItem}>
      <Image source={icon} style={styles.courseIcon} resizeMode="contain" />
      <View style={styles.courseInfo}>
        <Text style={styles.courseTitle}>{title}</Text>
        <Text style={styles.courseSubtitle}>{subtitle}</Text>
      </View>
      <TouchableOpacity style={styles.viewButton} activeOpacity={0.8} onPress={() => onViewTest && onViewTest({ title })}>
        <Text style={styles.viewButtonText}>Test bajarish</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[
        styles.header,
        Platform.OS === 'ios' && { paddingTop: insets.top > 0 ? insets.top + 8 : 50 }
      ]}>
        <Text style={styles.headerTitle}>Testlar</Text>
        <TouchableOpacity>
          <Ionicons name="search" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* Chet tillari Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Chet tillari</Text>
          <TouchableOpacity activeOpacity={0.7} onPress={() => onViewAll && onViewAll('Chet tillari')}>
            <Text style={styles.seeAllText}>Barchasini ko'rish {'>'}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.courseList}>
          <TestItem 
            icon={require('./assets/uk.png')} 
            title="English A1 - Test" 
            subtitle="Beginner" 
          />
          <TestItem 
            icon={require('./assets/kr.png')} 
            title="Korean A1 - Test" 
            subtitle="Beginner" 
          />
          <TestItem 
            icon={require('./assets/tr.png')} 
            title="Turkish A1 - Test" 
            subtitle="Beginner" 
          />
          <TestItem 
            icon={require('./assets/de.png')} 
            title="German A1 - Test" 
            subtitle="Beginner" 
          />
          <TestItem 
            icon={require('./assets/es.png')} 
            title="Spanish A1 - Test" 
            subtitle="Beginner" 
          />
        </View>

        {/* IT kurslari Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>IT kurslari</Text>
          <TouchableOpacity activeOpacity={0.7} onPress={() => onViewAll && onViewAll('IT kurslari')}>
            <Text style={styles.seeAllText}>Barchasini ko'rish {'>'}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.courseList}>
          <TestItem 
            icon={require('./assets/python.png')} 
            title="Python Basics - Test" 
            subtitle="Beginner • 40 ta savol" 
          />
          <TestItem 
            icon={require('./assets/html.png')} 
            title="HTML & CSS - Test" 
            subtitle="Beginner • 30 ta savol" 
          />
          <TestItem 
            icon={require('./assets/js.png')} 
            title="JavaScript Basics - Test" 
            subtitle="Beginner • 50 ta savol" 
          />
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 15,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#34115C',
  },
  scrollContent: {
    paddingTop: 15,
  },
  filtersContainer: {
    marginBottom: 20,
  },
  filtersContent: {
    paddingHorizontal: 15,
  },
  filterTab: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  filterTabActive: {
    backgroundColor: '#34115C',
    borderColor: '#34115C',
  },
  filterText: {
    color: '#555',
    fontWeight: '600',
    fontSize: 14,
  },
  filterTextActive: {
    color: '#FFFFFF',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222',
  },
  seeAllText: {
    fontSize: 14,
    color: '#7c3aed',
    fontWeight: '500',
  },
  courseList: {
    paddingHorizontal: 15,
    marginBottom: 20,
  },
  courseItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  courseIcon: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    marginRight: 15,
  },
  courseInfo: {
    flex: 1,
  },
  courseTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 2,
  },
  courseSubtitle: {
    fontSize: 12,
    color: '#888',
    marginBottom: 8,
  },
  viewButton: {
    backgroundColor: '#F3E5F5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  viewButtonText: {
    color: '#7c3aed',
    fontSize: 12,
    fontWeight: 'bold',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 50,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#999',
    marginTop: 15,
  }
});
