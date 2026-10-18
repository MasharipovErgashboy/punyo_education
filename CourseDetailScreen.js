import React, { useState, useEffect, useMemo } from 'react';
import { StyleSheet, Text, View, Image, ScrollView, TouchableOpacity, Dimensions, Platform, Linking, Alert, ActivityIndicator, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import YoutubePlayer from 'react-native-youtube-iframe';
import AsyncStorage from '@react-native-async-storage/async-storage';
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

export default function CourseDetailScreen({ course, userData, onBack }) {
  const insets = useSafeAreaInsets();
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [courseData, setCourseData] = useState(course || {});
  const [playerError, setPlayerError] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [enrollInfo, setEnrollInfo] = useState(null);

  const handleEnrollCourse = async () => {
    if (isEnrolling) return;
    setIsEnrolling(true);

    try {
      let currentUser = userData;
      if (!currentUser) {
        try {
          const val = await AsyncStorage.getItem('userData');
          if (val) {
            currentUser = JSON.parse(val);
          }
        } catch (e) {}
      }

      const currentCourseTitle = courseData?.name || courseData?.title || course?.title || 'Kurs';
      const payload = {
        course_id: courseData?.id || course?.id,
        user_id: currentUser?.id || currentUser?.user_id || null,
        user_name: currentUser?.name || 'Talaba',
        user_phone: currentUser?.phone || '+998 90 123 45 67',
        user_email: currentUser?.email || '',
      };

      const res = await fetch('http://192.168.0.107:8000/api/course-applications/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();

      setEnrollInfo({
        courseTitle: currentCourseTitle,
        userName: currentUser?.name || 'Talaba',
        userPhone: currentUser?.phone || '+998 90 123 45 67'
      });
      setShowSuccessModal(true);
    } catch (err) {
      console.log('Error applying for course:', err);
      setEnrollInfo({
        courseTitle: courseData?.name || courseData?.title || course?.title || 'Kurs',
        userName: 'Talaba',
        userPhone: '+998 90 123 45 67'
      });
      setShowSuccessModal(true);
    } finally {
      setIsEnrolling(false);
    }
  };


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

  useEffect(() => {
    setPlayerError(false);
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
        
        {/* Video Container (YouTube Player, Error Fallback, or Cover Image) */}
        <View style={styles.videoContainer}>
          {youtubeId && !playerError ? (
            <YoutubePlayer
              height={225}
              width={width}
              videoId={youtubeId}
              play={isPlaying}
              onChangeState={(state) => {
                if (state === 'ended') {
                  setIsPlaying(false);
                }
              }}
              onError={(e) => {
                console.log("YouTube Player Error:", e);
                setPlayerError(true);
              }}
              webViewProps={{
                androidLayerType: 'hardware',
                allowsInlineMediaPlayback: true,
              }}
              initialPlayerParams={{
                preventFullScreen: false,
                controls: true,
                modestbranding: true,
                rel: false,
              }}
            />
          ) : playerError ? (
            <View style={styles.errorContainer}>
              <Ionicons name="alert-circle-outline" size={38} color="#F59E0B" />
              <Text style={styles.errorTitle}>Video ilova ichida cheklangan</Text>
              <Text style={styles.errorSub}>
                Muallif ushbu videoni boshqa ilovalarda ko'rsatishni cheklagan bo'lishi mumkin.
              </Text>
              <TouchableOpacity style={styles.errorWatchBtn} onPress={handlePlayVideo} activeOpacity={0.8}>
                <Ionicons name="logo-youtube" size={18} color="#FFF" style={{ marginRight: 6 }} />
                <Text style={styles.errorWatchText}>YouTube ilovasida ko'rish</Text>
              </TouchableOpacity>
            </View>
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
        <TouchableOpacity 
          style={[styles.enrollButton, isEnrolling && { opacity: 0.7 }]} 
          activeOpacity={0.8}
          onPress={handleEnrollCourse}
          disabled={isEnrolling}
        >
          {isEnrolling ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Text style={styles.enrollButtonText}>Kursga yozilish</Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Premium Application Success Modal */}
      <Modal
        visible={showSuccessModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowSuccessModal(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.successModalCard}>
            {/* Close Button */}
            <TouchableOpacity 
              style={styles.modalCloseBtn}
              onPress={() => setShowSuccessModal(false)}
              activeOpacity={0.7}
            >
              <Ionicons name="close" size={18} color="#64748B" />
            </TouchableOpacity>

            {/* Glowing Icon Badge */}
            <View style={styles.successIconWrapper}>
              <View style={styles.successIconOuter}>
                <View style={styles.successIconInner}>
                  <Ionicons name="checkmark-done" size={34} color="#FFFFFF" />
                </View>
              </View>
              <View style={styles.sparkleBadge}>
                <Ionicons name="sparkles" size={14} color="#F59E0B" />
              </View>
            </View>

            {/* Title & Description */}
            <Text style={styles.successModalTitle}>
              Arizangiz qabul qilindi! 🎉
            </Text>
            <Text style={styles.successModalSub}>
              Siz ushbu kursga muvaffaqiyatli ariza berdingiz! Tez orada operatorlarimiz siz bilan bog'lanib, o'quv jarayoni bo'yicha to'liq ma'lumot berishadi.
            </Text>

            {/* Summary Info Card */}
            <View style={styles.modalInfoCard}>
              <View style={styles.infoCardRow}>
                <View style={styles.infoCardIconBox}>
                  <Ionicons name="book-outline" size={18} color="#7C3AED" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.infoCardLabel}>Tanlangan kurs</Text>
                  <Text style={styles.infoCardValue} numberOfLines={1}>
                    {enrollInfo?.courseTitle || title}
                  </Text>
                </View>
              </View>

              <View style={styles.infoCardDivider} />

              <View style={styles.infoCardBottomRow}>
                <View style={styles.statusPill}>
                  <View style={styles.statusPillDot} />
                  <Text style={styles.statusPillText}>Ko'rib chiqilmoqda</Text>
                </View>

                <View style={styles.operatorPill}>
                  <Ionicons name="call-outline" size={12} color="#475569" style={{ marginRight: 4 }} />
                  <Text style={styles.operatorPillText}>Operator aloqasi</Text>
                </View>
              </View>
            </View>

            {/* Confirm Button */}
            <TouchableOpacity
              style={styles.modalActionBtn}
              activeOpacity={0.85}
              onPress={() => setShowSuccessModal(false)}
            >
              <Ionicons name="checkmark-circle-outline" size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
              <Text style={styles.modalActionBtnText}>Tushundim, rahmat</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  errorContainer: {
    flex: 1,
    backgroundColor: '#0F172A',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  errorTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#F8FAFC',
    marginTop: 8,
    textAlign: 'center',
  },
  errorSub: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 4,
    marginBottom: 12,
    textAlign: 'center',
    lineHeight: 17,
  },
  errorWatchBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DC2626',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginTop: 4,
  },
  errorWatchText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
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
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 22,
  },
  successModalCard: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    paddingTop: 32,
    paddingBottom: 24,
    paddingHorizontal: 22,
    alignItems: 'center',
    position: 'relative',
    shadowColor: '#34115C',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.18,
    shadowRadius: 24,
    elevation: 12,
  },
  modalCloseBtn: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  successIconWrapper: {
    position: 'relative',
    marginBottom: 18,
  },
  successIconOuter: {
    width: 82,
    height: 82,
    borderRadius: 41,
    backgroundColor: '#ECFDF5',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#D1FAE5',
  },
  successIconInner: {
    width: 62,
    height: 62,
    borderRadius: 31,
    backgroundColor: '#10B981',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 6,
  },
  sparkleBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#FEF3C7',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  successModalTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0F172A',
    textAlign: 'center',
    marginBottom: 8,
  },
  successModalSub: {
    fontSize: 13.5,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
    paddingHorizontal: 6,
  },
  modalInfoCard: {
    width: '100%',
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 14,
    marginBottom: 20,
  },
  infoCardRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoCardIconBox: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: '#EDE9FE',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  infoCardLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#94A3B8',
    marginBottom: 2,
  },
  infoCardValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E293B',
  },
  infoCardDivider: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: 10,
  },
  infoCardBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: '#FEF3C7',
  },
  statusPillDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#D97706',
    marginRight: 5,
  },
  statusPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#B45309',
  },
  operatorPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
  },
  operatorPillText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#475569',
  },
  modalActionBtn: {
    width: '100%',
    height: 48,
    borderRadius: 14,
    backgroundColor: '#34115C',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#34115C',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.28,
    shadowRadius: 8,
    elevation: 4,
  },
  modalActionBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
