import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Dimensions, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

export default function StatisticsScreen({ onBack }) {
  const insets = useSafeAreaInsets();
  
  const weekDays = [
    { day: 'Du', progress: 0.8, active: false },
    { day: 'Se', progress: 0.5, active: false },
    { day: 'Ch', progress: 1.0, active: false },
    { day: 'Pa', progress: 0.3, active: false },
    { day: 'Ju', progress: 0.9, active: true },
    { day: 'Sh', progress: 0.2, active: false },
    { day: 'Ya', progress: 0.0, active: false },
  ];

  const StatCard = ({ icon, title, value, color }) => (
    <View style={styles.statCard}>
      <View style={[styles.iconBox, { backgroundColor: color + '20' }]}>
        <Ionicons name={icon} size={24} color={color} />
      </View>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statTitle}>{title}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top > 0 ? insets.top + 8 : (Platform.OS === 'ios' ? 50 : 35) }]}>
        <TouchableOpacity onPress={onBack} style={styles.iconButton} activeOpacity={0.7}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>Statistika</Text>
        
        <View style={{ width: 34 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* Top Grid */}
        <View style={styles.gridContainer}>
          <StatCard icon="book" title="O'qilgan darslar" value="45 ta" color="#4C6FFF" />
          <StatCard icon="school" title="Tugatilgan kurslar" value="2 ta" color="#009688" />
          <StatCard icon="time" title="O'rganilgan vaqt" value="120 soat" color="#FF9800" />
          <StatCard icon="logo-bitcoin" title="Jami coinlar" value="1 250" color="#FFD700" />
        </View>

        {/* Weekly Activity */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Haftalik faollik</Text>
            <Text style={styles.sectionSubtitle}>Bu hafta: 5 soat</Text>
          </View>
          
          <View style={styles.chartContainer}>
            {weekDays.map((item, index) => (
              <View key={index} style={styles.barWrapper}>
                <View style={styles.barBackground}>
                  <View style={[
                    styles.barFill, 
                    { height: `${item.progress * 100}%`, backgroundColor: item.active ? '#7c3aed' : '#D1C4E9' }
                  ]} />
                </View>
                <Text style={[styles.dayText, item.active && styles.dayTextActive]}>{item.day}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Streak */}
        <View style={styles.sectionContainer}>
          <View style={styles.streakBox}>
            <View style={styles.streakIconBox}>
              <Ionicons name="flame" size={36} color="#FF5722" />
            </View>
            <View style={styles.streakInfo}>
              <Text style={styles.streakTitle}>Davomiylik (Streak)</Text>
              <Text style={styles.streakDesc}>Siz ketma-ket 7 kundan beri to'xtovsiz o'qiyapsiz! Ajoyib natija.</Text>
            </View>
            <Text style={styles.streakDays}>7 kun</Text>
          </View>
        </View>

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
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingTop: 15,
    paddingBottom: 15,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  iconButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
    textAlign: 'center',
  },
  scrollContent: {
    paddingTop: 20,
    paddingBottom: 100, // Avoid overlap with bottom nav
    paddingHorizontal: 15,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  statCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 16,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 5,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F5F5F5',
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  statTitle: {
    fontSize: 12,
    color: '#777',
    fontWeight: '500',
  },
  sectionContainer: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 5,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F5F5F5',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#7c3aed',
    fontWeight: '600',
  },
  chartContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 140,
  },
  barWrapper: {
    alignItems: 'center',
    width: 30,
  },
  barBackground: {
    width: 14,
    height: 100,
    backgroundColor: '#F0F0F0',
    borderRadius: 7,
    justifyContent: 'flex-end',
    marginBottom: 10,
  },
  barFill: {
    width: '100%',
    borderRadius: 7,
  },
  dayText: {
    fontSize: 12,
    color: '#999',
    fontWeight: '500',
  },
  dayTextActive: {
    color: '#333',
    fontWeight: 'bold',
  },
  streakBox: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  streakIconBox: {
    width: 60,
    height: 60,
    borderRadius: 16,
    backgroundColor: '#FFF0ED',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  streakInfo: {
    flex: 1,
    paddingRight: 10,
  },
  streakTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  streakDesc: {
    fontSize: 12,
    color: '#777',
    lineHeight: 18,
  },
  streakDays: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF5722',
  },
});
