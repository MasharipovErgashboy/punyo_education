import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Dimensions, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';

const { width } = Dimensions.get('window');

export default function AllGiftsScreen({ onBack, onSelectProduct }) {
  const insets = useSafeAreaInsets();
  const [activeCategory, setActiveCategory] = useState('Barchasi');
  
  const categories = ['Barchasi', 'Elektronika', 'Kiyim-kechak', 'Vaucherlar', 'Boshqa'];

  const allGifts = [
    { id: 1, name: "AirPods Pro (2nd Gen)", price: "50 000", icon: "headset", category: "Elektronika" },
    { id: 2, name: "Smart Watch Series 9", price: "65 000", icon: "watch", category: "Elektronika" },
    { id: 3, name: "Punyo futbolkasi", price: "5 000", icon: "shirt", category: "Kiyim-kechak" },
    { id: 4, name: "Punyo kubogi", price: "10 000", icon: "trophy", category: "Boshqa" },
    { id: 5, name: "Gift Card (100 000 so'm)", price: "15 000", icon: "card", category: "Vaucherlar" },
    { id: 6, name: "Premium 1 oy (obuna)", price: "20 000", icon: "ribbon", category: "Vaucherlar" },
    { id: 7, name: "Powerbank 10000mAh", price: "12 000", icon: "battery-charging", category: "Elektronika" },
    { id: 8, name: "Punyo ruchkasi va daftar", price: "3 000", icon: "book", category: "Boshqa" },
    { id: 9, name: "Noutbuk stend", price: "25 000", icon: "laptop", category: "Elektronika" },
  ];

  const filteredGifts = activeCategory === 'Barchasi' 
    ? allGifts 
    : allGifts.filter(gift => gift.category === activeCategory);

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      
      {/* Header */}
      <View style={[
        styles.header,
        { paddingTop: insets.top > 0 ? insets.top + 8 : (Platform.OS === 'ios' ? 50 : 35) }
      ]}>
        <TouchableOpacity onPress={onBack} style={styles.iconButton} activeOpacity={0.7}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>Barcha sovg'alar</Text>
        
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
        {/* Gifts Grid */}
        <View style={styles.giftsGrid}>
          {filteredGifts.map((gift) => (
            <TouchableOpacity 
              key={gift.id} 
              style={styles.giftCard} 
              activeOpacity={0.8}
              onPress={() => onSelectProduct && onSelectProduct(gift)}
            >
              <View style={styles.giftImagePlaceholder}>
                <Ionicons name={gift.icon} size={36} color="#7c3aed" />
              </View>
              <Text style={styles.giftName} numberOfLines={2}>{gift.name}</Text>
              <View style={styles.priceRow}>
                <Ionicons name="logo-bitcoin" size={14} color="#FFD700" />
                <Text style={styles.priceText}>{gift.price}</Text>
              </View>
            </TouchableOpacity>
          ))}
          {filteredGifts.length === 0 && (
            <Text style={{ textAlign: 'center', width: '100%', marginTop: 20, color: '#888' }}>
              Ushbu kategoriyada sovg'alar topilmadi.
            </Text>
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
  giftsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 12,
  },
  giftCard: {
    width: '31%', // Exactly fits 3 items with small margins
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 10,
    marginHorizontal: '1.1%',
    marginBottom: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F5F5F5',
  },
  giftImagePlaceholder: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: '#F8F8F8',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  giftName: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 6,
    minHeight: 32, // Ensures height matches even if 1 line
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  priceText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFD700',
    marginLeft: 4,
  },
});
