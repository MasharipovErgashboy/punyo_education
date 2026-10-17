import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';

const { width } = Dimensions.get('window');

export default function CertificatesScreen({ onBack }) {
  const [activeCategory, setActiveCategory] = useState('Barchasi');
  
  const categories = ['Barchasi', 'Chet tillari', 'IT', 'Boshqa'];

  const allCertificates = [
    { id: 1, title: "English A1 - Beginner", date: "12 May, 2026", icon: "ribbon", category: "Chet tillari", color: "#4C6FFF" },
    { id: 2, title: "Python Basics", date: "05 Iyun, 2026", icon: "code-slash", category: "IT", color: "#7c3aed" },
    { id: 3, title: "Korean A1 - Beginner", date: "22 Avgust, 2026", icon: "ribbon", category: "Chet tillari", color: "#009688" },
  ];

  const filteredCerts = activeCategory === 'Barchasi' 
    ? allCertificates 
    : allCertificates.filter(c => c.category === activeCategory);

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.iconButton} activeOpacity={0.7}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>Mening sertifikatlarim</Text>
        
        <View style={{ width: 34 }} />
      </View>

      {/* Horizontal Categories */}
      <View style={styles.categoriesContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 15 }}>
          {categories.map((cat, idx) => (
            <TouchableOpacity 
              key={idx} 
              style={[styles.categoryChip, activeCategory === cat && styles.categoryChipActive]}
              onPress={() => setActiveCategory(cat)}
              activeOpacity={0.7}
            >
              <Text style={[styles.categoryText, activeCategory === cat && styles.categoryTextActive]}>{cat}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Certificates List */}
        <View style={styles.certsGrid}>
          {filteredCerts.map((cert) => (
            <TouchableOpacity key={cert.id} style={styles.certCard} activeOpacity={0.8}>
              <View style={[styles.certIconBox, { backgroundColor: cert.color }]}>
                <Ionicons name={cert.icon} size={28} color="#FFF" />
              </View>
              <View style={styles.certInfo}>
                <Text style={styles.certTitle}>{cert.title}</Text>
                <View style={styles.dateRow}>
                  <Ionicons name="calendar-outline" size={14} color="#777" />
                  <Text style={styles.certDate}>{cert.date}</Text>
                </View>
              </View>
              <View style={styles.downloadBtn}>
                <Ionicons name="download-outline" size={20} color="#7c3aed" />
              </View>
            </TouchableOpacity>
          ))}
          {filteredCerts.length === 0 && (
            <Text style={styles.noItemsText}>Ushbu kategoriyada sertifikatlar topilmadi.</Text>
          )}
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
  categoriesContainer: {
    paddingVertical: 15,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
    backgroundColor: '#F0F0F0',
  },
  categoryChipActive: {
    backgroundColor: '#7c3aed',
  },
  categoryText: {
    fontSize: 14,
    color: '#555',
    fontWeight: '500',
  },
  categoryTextActive: {
    color: '#FFFFFF',
  },
  scrollContent: {
    paddingTop: 15,
    paddingBottom: 100, // Avoid overlap with bottom nav
  },
  certsGrid: {
    paddingHorizontal: 15,
  },
  certCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 15,
    marginBottom: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F5F5F5',
  },
  certIconBox: {
    width: 50,
    height: 50,
    borderRadius: 12, // slightly squarish for certificate look
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  certInfo: {
    flex: 1,
  },
  certTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 6,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  certDate: {
    fontSize: 12,
    color: '#777',
    marginLeft: 4,
  },
  downloadBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F5F3FA',
    justifyContent: 'center',
    alignItems: 'center',
  },
  noItemsText: {
    textAlign: 'center',
    marginTop: 20,
    color: '#888',
    fontSize: 14,
  },
});
