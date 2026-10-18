import React, { useState, useEffect, useMemo } from 'react';
import { StyleSheet, Text, View, Image, ScrollView, TouchableOpacity, Dimensions, Platform, Linking, Alert, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';
import ReviewsScreen from './ReviewsScreen';

const { width } = Dimensions.get('window');

const getYouTubeVideoId = (url) => {
  if (!url || typeof url !== 'string') return null;
  const trimmed = url.trim();
  const regExp = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/|youtube\.com\/shorts\/)([^"&?\/\s]{11})/i;
  const match = trimmed.match(regExp);
  if (match && match[1]) {
    return match[1];
  }
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return trimmed;
  }
  return null;
};

export default function CourseDetailScreen({ course, onBack }) {
  const insets = useSafeAreaInsets();
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [courseData, setCourseData] = useState(course || {});

  useEffect(() => {
    setCourseData(course || {});
    if (course?.id) {
      fetch(`http://192.168.0.107:8000/api/courses/${course.id}/`)
        .then(res => res.json())
        .then(data => {
          if (data.success && data.course) {
            setCourseData(data.course);
          }
        })
        .catch(() => {});
    }
  }, [course]);

  // Dynamic course details
  const title = courseData?.name || courseData?.title || 'Kurs Ma\'lumotlari';
  const rating = courseData?.rating || '4.8';
  const description = courseData?.description || "Ushbu darslik orqali siz noldan boshlab yuqori darajagacha bilimlarga ega bo'lasiz. Har bir dars amaliy mashg'ulotlar va uy vazifalari bilan mustahkamlangan. O'z sohangizning yetuk mutaxassisi bo'lish uchun bugunoq boshlang!";
  const studentsCount = courseData?.students_count || "12k O'quvchi";
  const duration = courseData?.duration || "24 Soat video";
  const certText = courseData?.has_certificate !== undefined ? (courseData.has_certificate ? "Sertifikat bor" : "Sertifikatsiz") : "Sertifikat";
  const price = courseData?.price || "250,000 UZS/oy";

  const teachersList = (courseData?.teachers && courseData.teachers.length > 0) ? courseData.teachers : [
    { id: 1, name: 'Ali Valiyev', role: 'Senior Dasturchi', avatar_url: null },
    { id: 2, name: 'Sardor Omonov', role: 'Backend Mentor', avatar_url: null }
  ];

  const youtubeId = useMemo(() => {
    return getYouTubeVideoId(courseData?.intro_video_url);
  }, [courseData?.intro_video_url]);

  const embedHtml = useMemo(() => {
    if (!youtubeId) return '';
    return `<!DOCTYPE html>
<html>
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <style>
      * { margin: 0; padding: 0; box-sizing: border-box; }
      html, body { width: 100%; height: 100%; background-color: #000; overflow: hidden; }
      .wrapper { position: relative; width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; }
      iframe { width: 100%; height: 100%; border: none; }
    </style>
  </head>
  <body>
    <div class="wrapper">
      <iframe
        src="https://www.youtube.com/embed/${youtubeId}?playsinline=1&modestbranding=1&rel=0&controls=1"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowfullscreen
      ></iframe>
    </div>
  </body>
</html>`;
  }, [youtubeId]);

  const handlePlayVideo = () => {
    if (courseData?.intro_video_url) {
      Linking.openURL(courseData.intro_video_url).catch(() => {
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
        
        {/* Video Container (YouTube Player or Cover Image) */}
        <View style={styles.videoContainer}>
          {youtubeId ? (
            <WebView
              style={styles.webView}
              javaScriptEnabled={true}
              domStorageEnabled={true}
              allowsFullscreenVideo={true}
              allowsInlineMediaPlayback={true}
              mediaPlaybackRequiresUserAction={false}
              originWhitelist={['*']}
              source={{
                html: embedHtml,
                baseUrl: 'https://www.youtube.com'
              }}
              scrollEnabled={false}
              bounces={false}
              startInLoadingState={true}
              renderLoading={() => (
                <View style={styles.videoLoadingContainer}>
                  <ActivityIndicator size="large" color="#7c3aed" />
                </View>
              )}
            />
          ) : (
            <View style={{ flex: 1 }}>
              <Image 
                source={courseData?.icon_url ? { uri: courseData.icon_url, cache: 'force-cache' } : (courseData?.icon ? { uri: courseData.icon, cache: 'force-cache' } : require('./assets/video_bg.png'))} 
                style={styles.videoImage} 
                fadeDuration={0}
              />
              <View style={styles.playButtonOverlay}>
                <TouchableOpacity style={styles.playButton} activeOpacity={0.8} onPress={handlePlayVideo}>
                  <Ionicons name="play" size={32} color="#FFF" style={{ marginLeft: 4 }} />
                </TouchableOpacity>
              </View>
            </View>
          )}
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

          {courseData?.intro_video_url ? (
            <TouchableOpacity 
              style={styles.openInAppBadge}
              activeOpacity={0.7}
              onPress={handlePlayVideo}
            >
              <Ionicons name="logo-youtube" size={16} color="#FF0000" />
              <Text style={styles.openInAppText}>YouTube ilovasida ochish</Text>
              <Ionicons name="open-outline" size={13} color="#64748B" />
            </TouchableOpacity>
          ) : null}

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
    height: 225,
    backgroundColor: '#000000',
    position: 'relative',
    overflow: 'hidden',
  },
  webView: {
    width: '100%',
    height: '100%',
    backgroundColor: '#000000',
  },
  videoLoadingContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 5,
  },
  openInAppBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginTop: 8,
    marginBottom: 6,
  },
  openInAppText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#334155',
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
