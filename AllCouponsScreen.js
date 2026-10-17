import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';

const { width } = Dimensions.get('window');

export default function AllCouponsScreen({ onBack, onSelectProduct }) {
  const [activeCategory, setActiveCategory] = useState('Barchasi');
  
  const categories = ['Barchasi', 'Kurslar', 'Premium', 'Maxsus', 'Yangi'];

  const allCoupons = [
    { id: 1, title: "10% Chegirma", desc: "Barcha kurslar uchun", price: "10 000", icon: "star", color: "#4C6FFF", category: "Kurslar" },
    { id: 2, title: "20% Chegirma", desc: "Premium obuna", price: "18 000", icon: "ribbon", color: "#7c3aed", category: "Premium" },
    { id: 3, title: "1 Oylik Bepul", desc: "Ingliz tili kursi", price: "25 000", icon: "book", color: "#E53935", category: "Kurslar" },
    { id: 4, title: "30% Chegirma", desc: "Faqat yangi obunachilar", price: "15 000", icon: "flash", color: "#FF9800", category: "Yangi" },
    { id: 5, title: "Maxsus VIP", desc: "Hamma narsaga cheksizlik", price: "50 000", icon: "diamond", color: "#009688", category: "Maxsus" },
    { id: 6, title: "15% Chegirma", desc: "IT kurslari uchun", price: "12 000", icon: "code", color: "#3F51B5", category: "Kurslar" },
  ];

  const filteredCoupons = activeCategory === 'Barchasi' 
    ? allCoupons 
    : allCoupons.filter(c => c.category === activeCategory);

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.iconButton} activeOpacity={0.7}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>Barcha kuponlar</Text>
        
        <View style={styles.coinBalance}>
          <Ionicons name="logo-bitcoin" size={16} color="#FFD700" />
          <Text style={styles.coinText}>1 250</Text>
        </View>
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
        {/* Coupons List */}
        <View style={styles.couponsGrid}>
          {filteredCoupons.map((coupon) => (
            <TouchableOpacity 
              key={coupon.id} 
              style={styles.couponCard} 
              activeOpacity={0.8}
            >
              <View style={[styles.couponIconBox, { backgroundColor: coupon.color }]}>
                <Ionicons name={coupon.icon} size={24} color="#FFF" />
              </View>
              <View style={styles.couponInfo}>
                <Text style={styles.couponTitle}>{coupon.title}</Text>
                <Text style={styles.couponDesc}>{coupon.desc}</Text>
                <View style={styles.priceRow}>
                  <Ionicons name="logo-bitcoin" size={16} color="#FFD700" />
                  <Text style={styles.priceText}>{coupon.price}</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#CCC" />
            </TouchableOpacity>
          ))}
          {filteredCoupons.length === 0 && (
            <Text style={styles.noItemsText}>Ushbu kategoriyada kuponlar topilmadi.</Text>
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
  },
  coinBalance: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#333',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  coinText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
    marginLeft: 6,
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
  couponsGrid: {
    paddingHorizontal: 15,
  },
  couponCard: {
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
  couponIconBox: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  couponInfo: {
    flex: 1,
  },
  couponTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  couponDesc: {
    fontSize: 12,
    color: '#777',
    marginBottom: 8,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  priceText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFD700',
    marginLeft: 4,
  },
  noItemsText: {
    textAlign: 'center',
    marginTop: 20,
    color: '#888',
    fontSize: 14,
  },
});
