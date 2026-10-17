import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Dimensions, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import AllGiftsScreen from './AllGiftsScreen';
import AllCouponsScreen from './AllCouponsScreen';
import ProductDetailScreen from './ProductDetailScreen';

const { width } = Dimensions.get('window');

export default function ShopScreen({ onBack }) {
  const [activeCategory, setActiveCategory] = useState('Barchasi');
  const [showAllGifts, setShowAllGifts] = useState(false);
  const [showAllCoupons, setShowAllCoupons] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  
  const categories = ['Barchasi', 'Trend', 'Aksessuar', 'Kurslar', 'Kuponlar'];

  const popularGifts = [
    { id: 1, name: "AirPods Pro (2nd Gen)", price: "50 000", icon: "headset", category: "Trend" },
    { id: 2, name: "Smart Watch Series 9", price: "65 000", icon: "watch", category: "Trend" },
    { id: 3, name: "Punyo futbolkasi", price: "5 000", icon: "shirt", category: "Aksessuar" },
    { id: 4, name: "Punyo kubogi", price: "10 000", icon: "trophy", category: "Aksessuar" },
    { id: 5, name: "Gift Card (100 000 so'm)", price: "15 000", icon: "card", category: "Kuponlar" },
    { id: 6, name: "Premium 1 oy (obuna)", price: "20 000", icon: "ribbon", category: "Kurslar" },
  ];

  const filteredGifts = activeCategory === 'Barchasi' 
    ? popularGifts 
    : popularGifts.filter(gift => gift.category === activeCategory);

  if (selectedProduct) {
    return <ProductDetailScreen product={selectedProduct} onBack={() => setSelectedProduct(null)} />;
  }

  if (showAllGifts) {
    return <AllGiftsScreen onBack={() => setShowAllGifts(false)} onSelectProduct={setSelectedProduct} />;
  }

  if (showAllCoupons) {
    return <AllCouponsScreen onBack={() => setShowAllCoupons(false)} onSelectProduct={setSelectedProduct} />;
  }

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.iconButton} activeOpacity={0.7}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>Shop</Text>
        
        <View style={styles.coinBalance}>
          <Ionicons name="logo-bitcoin" size={16} color="#FFD700" />
          <Text style={styles.coinText}>1 250</Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* Hero Banner */}
        <View style={styles.heroBanner}>
          <View style={styles.heroTextContent}>
            <Text style={styles.heroTitle}>Coinlaringizni{'\n'}sovg'alarga almashtiring!</Text>
            <Text style={styles.heroDesc}>
              Yig'ing, almashtiring, yutib oling!
            </Text>
          </View>
          <View style={styles.heroIconBox}>
            <Ionicons name="gift" size={60} color="#FFD700" />
          </View>
        </View>

        {/* Categories */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesScroll} contentContainerStyle={{ paddingHorizontal: 15 }}>
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

        {/* Mashhur Sovg'alar */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Mashhur sovg'alar</Text>
          <TouchableOpacity onPress={() => setShowAllGifts(true)} activeOpacity={0.7}>
            <Text style={styles.seeAllText}>Barchasini ko'rish</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.giftsGrid}>
          {filteredGifts.map((gift) => (
            <TouchableOpacity 
              key={gift.id} 
              style={styles.giftCard} 
              activeOpacity={0.8}
              onPress={() => setSelectedProduct(gift)}
            >
              <View style={styles.giftImagePlaceholder}>
                <Ionicons name={gift.icon} size={36} color="#7c3aed" />
              </View>
              <Text style={styles.giftName} numberOfLines={2} textAlign="center">{gift.name}</Text>
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

        {/* Kuponlar */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Kuponlar</Text>
          <TouchableOpacity onPress={() => setShowAllCoupons(true)} activeOpacity={0.7}>
            <Text style={styles.seeAllText}>Barchasini ko'rish</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.couponsGrid}>
          {/* Coupon 1 */}
          <TouchableOpacity 
            style={styles.couponCard} 
            activeOpacity={0.8}
          >
            <View style={[styles.couponIconBox, { backgroundColor: '#4C6FFF' }]}>
              <Ionicons name="star" size={20} color="#FFF" />
            </View>
            <View style={styles.couponInfo}>
              <Text style={styles.couponTitle}>10% Chegirma</Text>
              <Text style={styles.couponDesc}>Barcha kurslar uchun</Text>
              <View style={styles.priceRow}>
                <Ionicons name="logo-bitcoin" size={14} color="#FFD700" />
                <Text style={styles.priceText}>10 000</Text>
              </View>
            </View>
          </TouchableOpacity>

          {/* Coupon 2 */}
          <TouchableOpacity 
            style={styles.couponCard} 
            activeOpacity={0.8}
          >
            <View style={[styles.couponIconBox, { backgroundColor: '#7c3aed' }]}>
              <Ionicons name="ribbon" size={20} color="#FFF" />
            </View>
            <View style={styles.couponInfo}>
              <Text style={styles.couponTitle}>20% Chegirma</Text>
              <Text style={styles.couponDesc}>Premium obuna</Text>
              <View style={styles.priceRow}>
                <Ionicons name="logo-bitcoin" size={14} color="#FFD700" />
                <Text style={styles.priceText}>18 000</Text>
              </View>
            </View>
          </TouchableOpacity>
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
    backgroundColor: '#333', // Dark background as per design
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
  scrollContent: {
    paddingBottom: 100, // Avoid overlap with bottom nav
  },
  heroBanner: {
    flexDirection: 'row',
    backgroundColor: '#34115C', // Dark purple from design
    margin: 15,
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    overflow: 'hidden',
    shadowColor: '#34115C',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  heroTextContent: {
    flex: 1,
    zIndex: 2,
  },
  heroTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 10,
    lineHeight: 22,
  },
  heroDesc: {
    fontSize: 12,
    color: '#E0D4F5',
    lineHeight: 18,
  },
  heroIconBox: {
    position: 'absolute',
    right: 10,
    bottom: 0,
    zIndex: 1,
    opacity: 0.9,
  },
  categoriesScroll: {
    marginBottom: 20,
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
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  seeAllText: {
    fontSize: 13,
    color: '#7c3aed',
    fontWeight: '500',
  },
  giftsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 12,
    marginBottom: 20,
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
  couponsGrid: {
    flexDirection: 'row',
    paddingHorizontal: 15,
    justifyContent: 'space-between',
  },
  couponCard: {
    width: '48%',
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 12,
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
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  couponInfo: {
    flex: 1,
  },
  couponTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 2,
  },
  couponDesc: {
    fontSize: 10,
    color: '#888',
    marginBottom: 6,
  },
});
