import React, { useState } from 'react';
import { StyleSheet, Text, View, Image, ScrollView, TouchableOpacity, Dimensions, Platform, Linking, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ReviewsScreen from './ReviewsScreen';

const { width } = Dimensions.get('window');

export default function CourseDetailScreen({ course, onBack }) {
  const insets = useSafeAreaInsets();
  const [showAllReviews, setShowAllReviews] = useState(false);

  // Dynamic course details
  const title = course?.name || course?.title || 'Kurs Ma\'lumotlari';
  const rating = course?.rating || '4.8';
  const description = course?.description || "Ushbu darslik orqali siz noldan boshlab yuqori darajagacha bilimlarga ega bo'lasiz. Har bir dars amaliy mashg'ulotlar va uy vazifalari bilan mustahkamlangan. O'z sohangizning yetuk mutaxassisi bo'lish uchun bugunoq boshlang!";
  const studentsCount = course?.students_count || "12k O'quvchi";
  const duration = course?.duration || "24 Soat video";
  const certText = course?.has_certificate !== undefined ? (course.has_certificate ? "Sertifikat bor" : "Sertifikatsiz") : "Sertifikat";
  const price = course?.price || "250,000 UZS/oy";

  const teachersList = (course?.teachers && course.teachers.length > 0) ? course.teachers : [
    { id: 1, name: 'Ali Valiyev', role: 'Senior Dasturchi', avatar_url: null },
    { id: 2, name: 'Sardor Omonov', role: 'Backend Mentor', avatar_url: null }
  ];

  const handlePlayVideo = () => {
    if (course?.intro_video_url) {
      Linking.openURL(course.intro_video_url).catch(() => {
        Alert.alert("Xatolik", "Video havolasini ochishda muammo bo'ldi");
      });
    } else {
      Alert.alert("Ma'lumot", "Ushbu kurs uchun intro video havolasi biriktirilmagan.");
    }
  };

  if (showAllReviews) {
    return <ReviewsScreen onBack={() => setShowAllReviews(false)} />;
  }

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top > 0 ? insets.top + 8 : (Platform.OS === 'ios' ? 50 : 35) }]}>
        <TouchableOpacity onPress={onBack} style={styles.iconButton} activeOpacity={0.7}>
          <Ionicons name="arrow-back" size={24} color="#34115C" />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>{title}</Text>
        <View style={{ width: 34 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* Video Placeholder */}
        <View style={styles.videoContainer}>
          <Image 
            source={course?.icon_url ? { uri: course.icon_url, cache: 'force-cache' } : (course?.icon ? { uri: course.icon, cache: 'force-cache' } : require('./assets/video_bg.png'))} 
            style={styles.videoImage} 
            fadeDuration={0}
          />
          <View style={styles.playButtonOverlay}>
            <TouchableOpacity style={styles.playButton} activeOpacity={0.8} onPress={handlePlayVideo}>
              <Ionicons name="play" size={32} color="#FFF" style={{ marginLeft: 4 }} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Main Info */}
        <View style={styles.infoSection}>
          <View style={styles.titleRow}>
            <Text style={styles.courseTitle}>{title}</Text>
            <View style={styles.ratingBadge}>
              <Ionicons name="star" size={14} color="#FDB100" />
              <Text style={styles.ratingText}>{rating}</Text>
            </View>
          </View>
          <Text style={styles.courseDescription}>
            {description}
          </Text>
          
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Ionicons name="people-outline" size={18} color="#7c3aed" />
              <Text style={styles.statText}>{studentsCount}</Text>
            </View>
            <View style={styles.statItem}>
              <Ionicons name="time-outline" size={18} color="#7c3aed" />
              <Text style={styles.statText}>{duration}</Text>
            </View>
            <View style={styles.statItem}>
              <Ionicons name="document-text-outline" size={18} color="#7c3aed" />
              <Text style={styles.statText}>{certText}</Text>
            </View>
          </View>
        </View>

        {/* Teachers Section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>O'qituvchilar</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.teachersScroll} contentContainerStyle={{ paddingRight: 20 }}>
            {teachersList.map((t, idx) => (
              <View key={t.id || idx} style={styles.teacherCardMulti}>
                <Image 
                  source={t.avatar_url ? { uri: t.avatar_url, cache: 'force-cache' } : (t.avatar ? { uri: t.avatar, cache: 'force-cache' } : require('./assets/teacher.png'))} 
                  style={styles.teacherAvatar} 
                  fadeDuration={0}
                />
                <View style={styles.teacherInfo}>
                  <Text style={styles.teacherName}>{t.name}</Text>
                  <Text style={styles.teacherRole}>{t.role}</Text>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Reviews Section */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Mijozlar Fikri</Text>
            <TouchableOpacity onPress={() => setShowAllReviews(true)}>
              <Text style={styles.seeAllText}>Barchasi {'>'}</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.reviewsScroll} contentContainerStyle={{ paddingRight: 20 }}>
            {/* Review 1 */}
            <View style={styles.reviewCard}>
              <View style={styles.reviewHeader}>
                <Image source={require('./assets/user1.png')} style={styles.reviewAvatar} />
                <View style={styles.reviewUserInfo}>
                  <Text style={styles.reviewName}>Sardor Bekmurodov</Text>
                  <View style={styles.reviewStars}>
                    <Ionicons name="star" size={12} color="#FDB100" />
                    <Ionicons name="star" size={12} color="#FDB100" />
                    <Ionicons name="star" size={12} color="#FDB100" />
                    <Ionicons name="star" size={12} color="#FDB100" />
                    <Ionicons name="star" size={12} color="#FDB100" />
                  </View>
                </View>
              </View>
              <Text style={styles.reviewText}>
                Juda ajoyib kurs! Menga darslarning sifati va o'qituvchining tushuntirish uslubi juda yoqdi.
              </Text>
            </View>

            {/* Review 2 */}
            <View style={styles.reviewCard}>
              <View style={styles.reviewHeader}>
                <Image source={require('./assets/user2.png')} style={styles.reviewAvatar} />
                <View style={styles.reviewUserInfo}>
                  <Text style={styles.reviewName}>Zarina Aliyeva</Text>
                  <View style={styles.reviewStars}>
                    <Ionicons name="star" size={12} color="#FDB100" />
                    <Ionicons name="star" size={12} color="#FDB100" />
                    <Ionicons name="star" size={12} color="#FDB100" />
                    <Ionicons name="star" size={12} color="#FDB100" />
                    <Ionicons name="star-half" size={12} color="#FDB100" />
                  </View>
                </View>
              </View>
              <Text style={styles.reviewText}>
                Uy vazifalari biroz qiyin, lekin aynan shuning uchun ko'p narsa o'rgandim. Rahmat!
              </Text>
            </View>
          </ScrollView>
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Fixed Bottom Footer */}
      <View style={styles.bottomFooter}>
        <View style={styles.priceContainer}>
          <Text style={styles.priceLabel}>Kurs narxi</Text>
          <Text style={styles.priceValue}>{price}</Text>
        </View>
        <TouchableOpacity style={styles.enrollButton} activeOpacity={0.8}>
          <Text style={styles.enrollButtonText}>Kursga yozilish</Text>
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
    marginHorizontal: 10,
  },
  headerRight: {
    flexDirection: 'row',
  },
  scrollContent: {
    paddingBottom: 20,
  },
  videoContainer: {
    width: '100%',
    height: 220,
    backgroundColor: '#EEE',
    position: 'relative',
  },
  videoImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  playButtonOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(124, 58, 237, 0.9)', // Purple transparent
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  infoSection: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
    marginBottom: 15,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  courseTitle: {
    flex: 1,
    fontSize: 22,
    fontWeight: 'bold',
    color: '#222',
    marginRight: 10,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF8E1',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  ratingText: {
    marginLeft: 4,
    fontWeight: 'bold',
    color: '#FDB100',
    fontSize: 14,
  },
  courseDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 22,
    marginBottom: 20,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    paddingTop: 15,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statText: {
    marginLeft: 6,
    fontSize: 12,
    color: '#555',
    fontWeight: '500',
  },
  sectionContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 12,
  },
  teachersScroll: {
    marginHorizontal: -20,
    paddingHorizontal: 20,
  },
  teacherCardMulti: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 16,
    marginRight: 15,
    minWidth: 200,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  teacherAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  teacherInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  teacherName: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 2,
  },
  teacherRole: {
    fontSize: 12,
    color: '#7c3aed',
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  seeAllText: {
    fontSize: 14,
    color: '#7c3aed',
    fontWeight: '500',
  },
  reviewsScroll: {
    marginHorizontal: -20,
    paddingHorizontal: 20,
  },
  reviewCard: {
    width: width * 0.75,
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 16,
    marginRight: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  reviewAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  reviewUserInfo: {
    flex: 1,
  },
  reviewName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 2,
  },
  reviewStars: {
    flexDirection: 'row',
  },
  reviewText: {
    fontSize: 13,
    color: '#666',
    lineHeight: 20,
  },
  bottomFooter: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    paddingBottom: 25, // safe area padding
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 10,
  },
  priceContainer: {
    flex: 1,
  },
  priceLabel: {
    fontSize: 12,
    color: '#888',
    marginBottom: 2,
  },
  priceValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222',
  },
  priceCurrency: {
    fontSize: 14,
    color: '#555',
    fontWeight: '500',
  },
  enrollButton: {
    backgroundColor: '#34115C', // dark purple
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 25,
    shadowColor: '#34115C',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  enrollButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: 'bold',
  },
});
