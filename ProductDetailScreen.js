import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';

const { width } = Dimensions.get('window');

export default function ProductDetailScreen({ product, onBack }) {
  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // We determine if it's a physical product based on the category (e.g., not Vaucherlar or Kuponlar)
  const isPhysical = product.category !== 'Vaucherlar' && product.category !== 'Kuponlar' && product.category !== 'Kurslar';

  // Base price parsed to number
  const basePrice = parseInt(product.price.replace(/\s/g, ''));
  const totalPrice = (basePrice * quantity).toLocaleString('uz-UZ').replace(/,/g, ' ');

  const handleIncrement = () => setQuantity(prev => prev + 1);
  const handleDecrement = () => setQuantity(prev => (prev > 1 ? prev - 1 : 1));

  // Placeholder images array (we'll just use different background colors or opacity for thumbnails)
  const productImages = [1, 2, 3, 4];

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.iconButton} activeOpacity={0.7}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        
        <Text style={styles.headerTitle} numberOfLines={1}>{product.name}</Text>
        
        <View style={{ width: 34 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* Image Gallery */}
        <View style={styles.galleryContainer}>
          {/* Main Large Image */}
          <View style={styles.mainImagePlaceholder}>
            <Ionicons name={product.icon} size={80} color="#7c3aed" style={{ opacity: 0.8 }} />
            <Text style={styles.imageOverlayText}>Rasm {activeImageIndex + 1}</Text>
          </View>
          
          {/* Thumbnails */}
          <View style={styles.thumbnailsRow}>
            {productImages.map((img, idx) => (
              <TouchableOpacity 
                key={idx} 
                style={[
                  styles.thumbnailPlaceholder, 
                  activeImageIndex === idx && styles.thumbnailActive
                ]}
                onPress={() => setActiveImageIndex(idx)}
                activeOpacity={0.7}
              >
                <Ionicons name={product.icon} size={24} color={activeImageIndex === idx ? "#7c3aed" : "#999"} />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Product Info */}
        <View style={styles.infoContainer}>
          <View style={styles.titleRow}>
            <Text style={styles.productTitle}>{product.name}</Text>
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryBadgeText}>{product.category}</Text>
            </View>
          </View>
          
          <View style={styles.priceRow}>
            <Ionicons name="logo-bitcoin" size={24} color="#FFD700" />
            <Text style={styles.productPrice}>{product.price}</Text>
          </View>

          {/* Description */}
          <Text style={styles.sectionTitle}>Mahsulot haqida</Text>
          <Text style={styles.descriptionText}>
            Ushbu mahsulot Punyo Education platformasida yig'ilgan coinlar evaziga xarid qilinadigan maxsus sovg'alardan biridir. O'qishda davom eting va ko'proq coin yig'ib ajoyib sovg'alarni yutib oling!
          </Text>

          {/* Quantity Selector */}
          <View style={styles.quantityContainer}>
            <Text style={styles.sectionTitle}>Miqdor tanlash</Text>
            <View style={styles.quantitySelector}>
              <TouchableOpacity onPress={handleDecrement} style={styles.qtyBtn} activeOpacity={0.6}>
                <Ionicons name="remove" size={20} color="#333" />
              </TouchableOpacity>
              <Text style={styles.qtyValue}>{quantity}</Text>
              <TouchableOpacity onPress={handleIncrement} style={styles.qtyBtn} activeOpacity={0.6}>
                <Ionicons name="add" size={20} color="#333" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Location for Physical items */}
          {isPhysical && (
            <View style={styles.locationContainer}>
              <Text style={styles.sectionTitle}>Olib ketish manzili</Text>
              <View style={styles.locationBox}>
                <View style={styles.locationIconBox}>
                  <Ionicons name="location-outline" size={24} color="#7c3aed" />
                </View>
                <View style={styles.locationInfo}>
                  <Text style={styles.locationTitle}>Punyo Education Bosh Ofisi</Text>
                  <Text style={styles.locationDesc}>Toshkent sh., Chilonzor tumani, 9-mavze, 2A-uy</Text>
                </View>
              </View>
            </View>
          )}

        </View>
      </ScrollView>

      {/* Fixed Checkout Bottom Bar */}
      <View style={styles.bottomBar}>
        <View style={styles.totalBox}>
          <Text style={styles.totalLabel}>Jami narx:</Text>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Ionicons name="logo-bitcoin" size={16} color="#FFD700" />
            <Text style={styles.totalPrice}>{totalPrice}</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.orderButton} activeOpacity={0.8}>
          <Text style={styles.orderButtonText}>Buyurtma berish</Text>
        </TouchableOpacity>
      </View>
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
    marginHorizontal: 15,
  },
  scrollContent: {
    paddingBottom: 180, // Leaves room for fixed bottom bar + navbar
  },
  galleryContainer: {
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  mainImagePlaceholder: {
    width: '100%',
    aspectRatio: 1.2,
    backgroundColor: '#F5F3FA',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    position: 'relative',
  },
  imageOverlayText: {
    position: 'absolute',
    bottom: 15,
    right: 15,
    backgroundColor: 'rgba(0,0,0,0.1)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    fontSize: 12,
    color: '#555',
    fontWeight: 'bold',
  },
  thumbnailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  thumbnailPlaceholder: {
    width: '23%',
    aspectRatio: 1,
    backgroundColor: '#F9F9F9',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  thumbnailActive: {
    borderColor: '#7c3aed',
    backgroundColor: '#F5F3FA',
  },
  infoContainer: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    marginTop: 10,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  productTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
    marginRight: 10,
  },
  categoryBadge: {
    backgroundColor: '#F0E6FF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  categoryBadgeText: {
    color: '#7c3aed',
    fontSize: 12,
    fontWeight: 'bold',
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 25,
  },
  productPrice: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#FFD700',
    marginLeft: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  descriptionText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 22,
    marginBottom: 25,
  },
  quantityContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },
  quantitySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 25,
    padding: 4,
  },
  qtyBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  qtyValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    paddingHorizontal: 15,
  },
  locationContainer: {
    marginBottom: 10,
  },
  locationBox: {
    flexDirection: 'row',
    backgroundColor: '#F9F9F9',
    padding: 15,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#EFEFEF',
  },
  locationIconBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F0E6FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  locationInfo: {
    flex: 1,
  },
  locationTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  locationDesc: {
    fontSize: 12,
    color: '#777',
    lineHeight: 18,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 85, // Sits exactly on top of the HomeScreen bottom navbar
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 10,
  },
  totalBox: {
    flex: 1,
  },
  totalLabel: {
    fontSize: 12,
    color: '#888',
    marginBottom: 2,
  },
  totalPrice: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 6,
  },
  orderButton: {
    backgroundColor: '#7c3aed',
    paddingHorizontal: 25,
    paddingVertical: 14,
    borderRadius: 25,
    flex: 1,
    marginLeft: 15,
    alignItems: 'center',
  },
  orderButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: 'bold',
  },
});
