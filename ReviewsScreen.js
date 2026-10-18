import React from 'react';
import { StyleSheet, Text, View, Image, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function ReviewsScreen({ onBack }) {
  const insets = useSafeAreaInsets();
  // Mock data for all reviews
  const allReviews = [
    { id: 1, name: 'Sardor Bekmurodov', avatar: require('./assets/user1.png'), rating: 5, date: '2 kun oldin', text: 'Juda ajoyib kurs! Menga darslarning sifati va o\'qituvchining tushuntirish uslubi juda yoqdi.' },
    { id: 2, name: 'Zarina Aliyeva', avatar: require('./assets/user2.png'), rating: 4, date: '1 hafta oldin', text: 'Uy vazifalari biroz qiyin, lekin aynan shuning uchun ko\'p narsa o\'rgandim. Rahmat!' },
    { id: 3, name: 'Alisher Qodirov', avatar: require('./assets/user1.png'), rating: 5, date: '2 hafta oldin', text: 'Eng zo\'r IT kurslardan biri! Hamma narsa juda tushunarli tilda yozilgan va amaliyotga boy.' },
    { id: 4, name: 'Malika To\'rayeva', avatar: require('./assets/user2.png'), rating: 5, date: '1 oy oldin', text: 'Noldan boshlagan edim, hozir o\'zim kichik proyektlarni yoza olyapman. O\'qituvchilarga rahmat.' },
    { id: 5, name: 'Javohir Tursunov', avatar: require('./assets/user1.png'), rating: 4, date: '1 oy oldin', text: 'Yaxshi kurs, lekin ba\'zi videolarning ovozi sal pastroq. Qolgan hamma narsa alo darajada.' },
  ];

  const renderStars = (rating) => {
    let stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Ionicons 
          key={i} 
          name={i <= rating ? "star" : "star-outline"} 
          size={14} 
          color="#FDB100" 
        />
      );
    }
    return stars;
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top > 0 ? insets.top + 8 : (Platform.OS === 'ios' ? 50 : 35) }]}>
        <TouchableOpacity onPress={onBack} style={styles.iconButton} activeOpacity={0.7}>
          <Ionicons name="arrow-back" size={24} color="#34115C" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mijozlar Fikri</Text>
        <View style={{ width: 34 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* Overall Rating Section */}
        <View style={styles.overallStats}>
          <Text style={styles.ratingBigNumber}>4.8</Text>
          <View style={styles.ratingInfo}>
            <View style={styles.starsRow}>
              {renderStars(5)}
            </View>
            <Text style={styles.totalReviewsText}>{allReviews.length} ta sharhlar asosida</Text>
          </View>
        </View>

        {/* Filters */}
        <View style={styles.filterContainer}>
          <TouchableOpacity style={[styles.filterButton, styles.filterButtonActive]}>
            <Text style={[styles.filterText, styles.filterTextActive]}>Barchasi</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.filterButton}>
            <Ionicons name="star" size={12} color="#888" />
            <Text style={styles.filterText}> 5</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.filterButton}>
            <Ionicons name="star" size={12} color="#888" />
            <Text style={styles.filterText}> 4</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.filterButton}>
            <Ionicons name="star" size={12} color="#888" />
            <Text style={styles.filterText}> 3</Text>
          </TouchableOpacity>
        </View>

        {/* Reviews List */}
        <View style={styles.reviewsList}>
          {allReviews.map((item) => (
            <View key={item.id} style={styles.reviewCardFull}>
              <View style={styles.reviewHeader}>
                <Image source={item.avatar} style={styles.reviewAvatar} />
                <View style={styles.reviewUserInfo}>
                  <Text style={styles.reviewName}>{item.name}</Text>
                  <Text style={styles.reviewDate}>{item.date}</Text>
                </View>
                <View style={styles.reviewStars}>
                  {renderStars(item.rating)}
                </View>
              </View>
              <Text style={styles.reviewText}>{item.text}</Text>
            </View>
          ))}
        </View>

        <View style={{ height: 50 }} />
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
    flex: 1,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#34115C',
    textAlign: 'center',
  },
  scrollContent: {
    paddingTop: 10,
  },
  overallStats: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: '#FFFFFF',
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  ratingBigNumber: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#34115C',
    marginRight: 15,
  },
  ratingInfo: {
    justifyContent: 'center',
  },
  starsRow: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  totalReviewsText: {
    fontSize: 13,
    color: '#666',
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  filterButtonActive: {
    backgroundColor: '#7c3aed',
    borderColor: '#7c3aed',
  },
  filterText: {
    fontSize: 13,
    color: '#666',
    fontWeight: '500',
  },
  filterTextActive: {
    color: '#FFFFFF',
  },
  reviewsList: {
    paddingHorizontal: 15,
  },
  reviewCardFull: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 16,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 5,
    elevation: 2,
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  reviewAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: 12,
  },
  reviewUserInfo: {
    flex: 1,
  },
  reviewName: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 2,
  },
  reviewDate: {
    fontSize: 12,
    color: '#999',
  },
  reviewStars: {
    flexDirection: 'row',
  },
  reviewText: {
    fontSize: 14,
    color: '#555',
    lineHeight: 22,
  },
});
