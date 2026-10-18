import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, Image, ScrollView, TouchableOpacity, Dimensions, Platform, StatusBar as RNStatusBar, Keyboard } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import CoursesScreen from './CoursesScreen';
import CategoryScreen from './CategoryScreen';
import CourseDetailScreen from './CourseDetailScreen';
import AiChatScreen from './AiChatScreen';
import ProfileScreen from './ProfileScreen';
import NotificationsScreen from './NotificationsScreen';
import TestsScreen from './TestsScreen';
import TestIntroScreen from './TestIntroScreen';
import TestRunnerScreen from './TestRunnerScreen';
import LoginScreen from './LoginScreen';
import RegisterScreen from './RegisterScreen';

const { width, height } = Dimensions.get('window');

export default function HomeScreen({ lang, onLogout, initialIsAuthenticated = false }) {
  const insets = useSafeAreaInsets();
  const [isAuthenticated, setIsAuthenticated] = useState(initialIsAuthenticated);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'register'
  const [userData, setUserData] = useState(null);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

  useEffect(() => {
    if (Platform.OS === 'android') {
      RNStatusBar.setTranslucent(true);
      RNStatusBar.setBackgroundColor('transparent');
      RNStatusBar.setBarStyle('dark-content');
    }
  }, []);

  useEffect(() => {
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const onShow = () => setIsKeyboardVisible(true);
    const onHide = () => setIsKeyboardVisible(false);

    const showSub = Keyboard.addListener(showEvent, onShow);
    const hideSub = Keyboard.addListener(hideEvent, onHide);
    const didShowSub = Keyboard.addListener('keyboardDidShow', onShow);
    const didHideSub = Keyboard.addListener('keyboardDidHide', onHide);

    return () => {
      showSub.remove();
      hideSub.remove();
      didShowSub.remove();
      didHideSub.remove();
    };
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      AsyncStorage.getItem('userData').then(val => {
        if (val) setUserData(JSON.parse(val));
      });
    } else {
      setUserData(null);
    }
  }, [isAuthenticated]);
  const [activeTab, setActiveTab] = useState('home');
  const [activeCategory, setActiveCategory] = useState(null);
  const [activeCategoryCourses, setActiveCategoryCourses] = useState(null);
  const [activeCourse, setActiveCourse] = useState(null);
  const [activeTestIntro, setActiveTestIntro] = useState(null);
  const [activeTestRun, setActiveTestRun] = useState(null);
  const [coursesInitialFilter, setCoursesInitialFilter] = useState('Barcha kurslar');
  const [testsInitialFilter, setTestsInitialFilter] = useState('Barcha testlar');
  const [showNotifications, setShowNotifications] = useState(false);
  const [isSubScreenOpen, setIsSubScreenOpen] = useState(false);
  const [activeBannerIndex, setActiveBannerIndex] = useState(0);
  const bannerRef = useRef(null);

  const triggerAuth = () => {
    if (!isAuthenticated) {
      setAuthMode('login');
      setShowAuthModal(true);
      return true;
    }
    return false;
  };

  const [banners, setBanners] = useState([]);

  useEffect(() => {
    const fetchBanners = () => {
      fetch('http://192.168.0.107:8000/api/admin/ads/')
        .then(res => res.json())
        .then(data => {
          if (data.success && data.ads) {
            setBanners(data.ads);
          }
        })
        .catch(err => console.log("Failed to load banners", err));
    };

    fetchBanners(); // Initial fetch
    
    // Poll every 5 seconds for real-time updates
    const interval = setInterval(fetchBanners, 5000);
    return () => clearInterval(interval);
  }, []);

  const popularCourses = [
    {
      id: 1,
      title: "Python va AI Dasturlash",
      category: "IT & Sun'iy Intellekt",
      rating: "4.9",
      students: "1,250 o'quvchi",
      lessons: "36 ta dars",
      icon: require('./assets/python.png'),
      headerBg: '#0F766E',
      tag: 'Top 1 🔥'
    },
    {
      id: 2,
      title: "English A1 – Beginner",
      category: "Chet Tillari",
      rating: "4.8",
      students: "3,450 o'quvchi",
      lessons: "42 ta dars",
      icon: require('./assets/uk.png'),
      headerBg: '#1D4ED8',
      tag: 'Eng Mashhur ⭐️'
    },
    {
      id: 3,
      title: "IELTS 8.0+ Masterclass",
      category: "Imtihonga Tayyorlov",
      rating: "4.9",
      students: "2,100 o'quvchi",
      lessons: "50 ta dars",
      icon: require('./assets/uk.png'),
      headerBg: '#7C3AED',
      tag: 'Intensiv 🚀'
    },
    {
      id: 4,
      title: "Korean A1 – Hangul va Grammatika",
      category: "Chet Tillari",
      rating: "4.7",
      students: "890 o'quvchi",
      lessons: "28 ta dars",
      icon: require('./assets/kr.png'),
      headerBg: '#BE123C',
      tag: 'Yangi ✨'
    }
  ];

  useEffect(() => {
    if (banners.length === 0) return;
    
    const timer = setInterval(() => {
      setActiveBannerIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % banners.length;
        if (bannerRef.current) {
          bannerRef.current.scrollTo({
            x: nextIndex * (width - 30),
            animated: true,
          });
        }
        return nextIndex;
      });
    }, 3000);
    return () => clearInterval(timer);
  }, [banners.length]);

  const handleScroll = (event) => {
    const slideWidth = width - 30;
    const slideIndex = Math.round(event.nativeEvent.contentOffset.x / slideWidth);
    if (slideIndex !== activeBannerIndex && slideIndex >= 0 && slideIndex < banners.length) {
      setActiveBannerIndex(slideIndex);
    }
  };

  const userNameFirst = userData?.name?.split(' ')[0] || userData?.first_name || "";
  
  const t = {
    uz: {
      greeting: isAuthenticated ? `Salom, ${userNameFirst}!` : "Xush kelibsiz! 👋",
      heroDesc: "Bugun yangi bilimlar kuni! Maqsadingizga bir qadam yaqinlashing.",
      resumeBtn: "Kurs davom ettirish",
      courses: "Kurslarim",
      coursesCount: "12 ta kurs",
      tests: "Testlar",
      testsCount: "48 ta test",
      games: "O'yinlar",
      gamesCount: "5 ta o'yin",
      ai: "AI Yordamchi",
      aiDesc: "24/7 yordam",
      ongoing: "Davom etayotgan kurslar",
      seeAll: "Barchasini ko'rish >",
      resume: "Davom etish",
      dailyGoal: "Kundalik maqsad",
      edit: "Tahrirlash",
      goalTitle: "Bugungi maqsad",
      goalDesc: "5 ta dars yakunlang",
    }
  }[lang] || {
      greeting: isAuthenticated ? `Salom, ${userNameFirst}!` : "Xush kelibsiz! 👋",
      heroDesc: "Bugun yangi bilimlar kuni! Maqsadingizga bir qadam yaqinlashing.",
      resumeBtn: "Kurs davom ettirish",
      courses: "Kurslarim",
      coursesCount: "12 ta kurs",
      tests: "Testlar",
      testsCount: "48 ta test",
      games: "O'yinlar",
      gamesCount: "5 ta o'yin",
      ai: "AI Yordamchi",
      aiDesc: "24/7 yordam",
      ongoing: "Davom etayotgan kurslar",
      seeAll: "Barchasini ko'rish >",
      resume: "Davom etish",
      dailyGoal: "Kundalik maqsad",
      edit: "Tahrirlash",
      goalTitle: "Bugungi maqsad",
      goalDesc: "5 ta dars yakunlang",
    };

  // Auth screen modal view
  if (showAuthModal) {
    if (authMode === 'register') {
      return (
        <RegisterScreen 
          onBack={() => setShowAuthModal(false)}
          onNavigateToLogin={() => setAuthMode('login')}
          onRegisterSuccess={(user) => {
            AsyncStorage.setItem('isLoggedIn', 'true');
            if (user) {
              AsyncStorage.setItem('userData', JSON.stringify(user));
              setUserData(user);
            }
            setIsAuthenticated(true);
            setShowAuthModal(false);
          }}
        />
      );
    }
    return (
      <LoginScreen 
        onBack={() => setShowAuthModal(false)}
        onNavigateToRegister={() => setAuthMode('register')}
        onLoginSuccess={(user) => {
          AsyncStorage.setItem('isLoggedIn', 'true');
          if (user) {
            AsyncStorage.setItem('userData', JSON.stringify(user));
            setUserData(user);
          }
          setIsAuthenticated(true);
          setShowAuthModal(false);
        }}
      />
    );
  }

  const renderHomeContent = () => (
    <>
      <StatusBar style="dark" backgroundColor="transparent" translucent={true} />
      
      {/* Header */}
      <View style={[
        styles.header,
        { paddingTop: insets.top > 0 ? insets.top + 8 : (Platform.OS === 'ios' ? 50 : 35) }
      ]}>
        <View style={styles.logoRow}>
          <Image source={require('./assets/logo.png')} style={styles.headerLogo} />
          <Text style={styles.headerTitle}>PUNYO{'\n'}<Text style={styles.headerSubtitle}>EDUCATION</Text></Text>
        </View>
        <View style={styles.headerRight}>
          <View style={styles.coinBadge}>
            <Ionicons name="cash" size={16} color="#FDB100" />
            <Text style={styles.coinText}>{isAuthenticated ? "1 250" : "0"}</Text>
          </View>

          <TouchableOpacity 
            style={styles.bellButton} 
            activeOpacity={0.8} 
            onPress={() => {
              if (!isAuthenticated) triggerAuth();
              else setShowNotifications(true);
            }}
          >
            <Ionicons name="notifications" size={20} color="#7c3aed" />
            {isAuthenticated && <View style={styles.bellDot} />}
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* Advertising Swiper Banner */}
        <View style={styles.swiperContainer}>
          <ScrollView
            ref={bannerRef}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={handleScroll}
            scrollEventThrottle={16}
            decelerationRate="fast"
            snapToInterval={width - 30}
            snapToAlignment="center"
          >
            {banners.map((banner) => (
              <View key={banner.id} style={[styles.adCard, { backgroundColor: '#f0f0f0', padding: 0 }]}>
                <Image source={{ uri: banner.image_url }} style={{ width: '100%', height: '100%', borderRadius: 24 }} resizeMode="cover" />
              </View>
            ))}
          </ScrollView>

          {/* Swiper Pagination Dots */}
          <View style={styles.paginationRow}>
            {banners.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.paginationDot,
                  index === activeBannerIndex ? styles.paginationDotActive : styles.paginationDotInactive
                ]}
              />
            ))}
          </View>
        </View>

        {/* Quick Stats Row */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.quickStatsRow}>
          <TouchableOpacity 
            style={styles.statCard}
            activeOpacity={0.8}
            onPress={() => {
              if (!isAuthenticated) triggerAuth();
              else {
                setActiveTab('courses');
                setCoursesInitialFilter('Mening kurslarim');
              }
            }}
          >
            <View style={[styles.statIconBox, { backgroundColor: '#E8F5E9' }]}>
              <Ionicons name="book" size={24} color="#4CAF50" />
            </View>
            <View>
              <Text style={styles.statTitle}>{t.courses}</Text>
              <Text style={styles.statDesc}>{t.coursesCount}</Text>
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.statCard}
            activeOpacity={0.8}
            onPress={() => {
              if (!isAuthenticated) triggerAuth();
              else setActiveTab('tests');
            }}
          >
            <View style={[styles.statIconBox, { backgroundColor: '#E3F2FD' }]}>
              <Ionicons name="clipboard" size={24} color="#2196F3" />
            </View>
            <View>
              <Text style={styles.statTitle}>{t.tests}</Text>
              <Text style={styles.statDesc}>{t.testsCount}</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.statCard}
            activeOpacity={0.8}
            onPress={() => {
              if (!isAuthenticated) triggerAuth();
            }}
          >
            <View style={[styles.statIconBox, { backgroundColor: '#FFF3E0' }]}>
              <Ionicons name="game-controller" size={24} color="#FF9800" />
            </View>
            <View>
              <Text style={styles.statTitle}>{t.games}</Text>
              <Text style={styles.statDesc}>{t.gamesCount}</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.statCard}
            activeOpacity={0.8}
            onPress={() => {
              if (!isAuthenticated) triggerAuth();
              else setActiveTab('ai');
            }}
          >
            <View style={[styles.statIconBox, { backgroundColor: '#F3E5F5' }]}>
              <Ionicons name="hardware-chip" size={24} color="#9C27B0" />
            </View>
            <View>
              <Text style={styles.statTitle}>{t.ai}</Text>
              <Text style={styles.statDesc}>{t.aiDesc}</Text>
            </View>
          </TouchableOpacity>
        </ScrollView>

        {/* Content Section: Authenticated vs Guest Mode */}
        {isAuthenticated ? (
          <>
            {/* Ongoing Courses (Only for Authenticated Users) */}
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>{t.ongoing}</Text>
              <TouchableOpacity activeOpacity={0.7}>
                <Text style={styles.seeAllText}>{t.seeAll}</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.courseList}>
              {/* Item 1 */}
              <View style={styles.courseItem}>
                <Image source={require('./assets/uk.png')} style={styles.courseIcon} resizeMode="contain" />
                <View style={styles.courseInfo}>
                  <Text style={styles.courseName}>English A1 – Beginner</Text>
                  <View style={styles.progressRow}>
                    <Text style={styles.progressLabel}>Progress</Text>
                    <Text style={styles.progressPercent}>60%</Text>
                  </View>
                  <View style={styles.progressBarBg}>
                    <View style={[styles.progressBarFill, { width: '60%' }]} />
                  </View>
                </View>
                <TouchableOpacity style={styles.courseButton} activeOpacity={0.8}>
                  <Text style={styles.courseButtonText}>{t.resume}</Text>
                </TouchableOpacity>
              </View>

              {/* Item 2 */}
              <View style={styles.courseItem}>
                <Image source={require('./assets/kr.png')} style={styles.courseIcon} resizeMode="contain" />
                <View style={styles.courseInfo}>
                  <Text style={styles.courseName}>Korean A1 – Beginner</Text>
                  <View style={styles.progressRow}>
                    <Text style={styles.progressLabel}>Progress</Text>
                    <Text style={styles.progressPercent}>35%</Text>
                  </View>
                  <View style={styles.progressBarBg}>
                    <View style={[styles.progressBarFill, { width: '35%' }]} />
                  </View>
                </View>
                <TouchableOpacity style={styles.courseButton} activeOpacity={0.8}>
                  <Text style={styles.courseButtonText}>{t.resume}</Text>
                </TouchableOpacity>
              </View>

              {/* Item 3 */}
              <View style={styles.courseItem}>
                <Image source={require('./assets/python.png')} style={styles.courseIcon} resizeMode="contain" />
                <View style={styles.courseInfo}>
                  <Text style={styles.courseName}>Python Basics</Text>
                  <View style={styles.progressRow}>
                    <Text style={styles.progressLabel}>Progress</Text>
                    <Text style={styles.progressPercent}>45%</Text>
                  </View>
                  <View style={styles.progressBarBg}>
                    <View style={[styles.progressBarFill, { width: '45%' }]} />
                  </View>
                </View>
                <TouchableOpacity style={styles.courseButton} activeOpacity={0.8}>
                  <Text style={styles.courseButtonText}>{t.resume}</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Daily Goal (Only for Authenticated Users) */}
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>{t.dailyGoal}</Text>
              <TouchableOpacity activeOpacity={0.7}>
                <Text style={styles.seeAllText}>{t.edit}</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.goalCard}>
              <View style={styles.goalIconBox}>
                <Ionicons name="flag" size={30} color="#E53935" />
              </View>
              <View style={styles.goalInfo}>
                <Text style={styles.goalTitle}>{t.goalTitle}</Text>
                <Text style={styles.goalDesc}>{t.goalDesc}</Text>
                <View style={styles.goalProgressBg}>
                  <View style={[styles.goalProgressFill, { width: '60%' }]} />
                </View>
                <Text style={styles.goalFraction}>3/5</Text>
              </View>
              <Image source={require('./assets/gift.png')} style={styles.giftIcon} resizeMode="contain" />
            </View>
          </>
        ) : (
          <>
            {/* Newly Redesigned Mashhur Kurslar Section (For Guest Users) */}
            <View style={styles.sectionHeader}>
              <View>
                <Text style={styles.sectionTitle}>Mashhur Kurslar 🔥</Text>
                <Text style={styles.sectionSubtitle}>Eng ommabop ta'lim dasturlari</Text>
              </View>
              <TouchableOpacity activeOpacity={0.7} onPress={() => triggerAuth()}>
                <Text style={styles.seeAllText}>Barchasi {'>'}</Text>
              </TouchableOpacity>
            </View>

            <ScrollView 
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.popularCoursesList}
              snapToInterval={296} // 280 width + 16 gap
              decelerationRate="fast"
              snapToAlignment="start"
            >
              {popularCourses.map((course) => (
                <TouchableOpacity 
                  key={course.id} 
                  style={styles.popularCourseCard}
                  activeOpacity={0.95}
                  onPress={() => triggerAuth()}
                >
                  {/* Banner Header */}
                  <View style={[styles.popularCardBanner, { backgroundColor: course.headerBg }]}>
                    <View style={styles.popularCardBannerOverlay} />
                    <View style={styles.popularTagBadge}>
                      <Ionicons name="flame" size={12} color="#F59E0B" style={{ marginRight: 4 }} />
                      <Text style={styles.popularTagBadgeText}>{course.tag.replace(' 🔥', '').replace(' ⭐️', '').replace(' 🚀', '').replace(' ✨', '')}</Text>
                    </View>
                    <View style={styles.popularIconWrapper}>
                      <Image source={course.icon} style={styles.popularCardIcon} resizeMode="contain" />
                    </View>
                  </View>

                  {/* Card Body */}
                  <View style={styles.popularCardBody}>
                    <Text style={styles.popularCategoryText}>{course.category}</Text>
                    <Text style={styles.popularTitleText} numberOfLines={2}>{course.title}</Text>


                    {/* Full Width Action Button */}
                    <View style={styles.popularActionButton}>
                      <Text style={styles.popularActionButtonText}>Kursni boshlash</Text>
                      <View style={styles.popularActionIconBox}>
                        <Ionicons name="arrow-forward" size={16} color="#7C3AED" />
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>
    </>
  );

  return (
    <View style={styles.container}>
      <StatusBar style="dark" backgroundColor="transparent" translucent={true} />
      
      {showNotifications ? (
        <NotificationsScreen onBack={() => setShowNotifications(false)} />
      ) : activeTestRun ? (
        <TestRunnerScreen testTitle={activeTestRun?.title} onBack={() => setActiveTestRun(null)} />
      ) : activeTestIntro ? (
        <TestIntroScreen test={activeTestIntro} onBack={() => setActiveTestIntro(null)} onStart={() => { setActiveTestRun(activeTestIntro); setActiveTestIntro(null); }} />
      ) : activeCourse ? (
        <CourseDetailScreen course={activeCourse} userData={userData} onBack={() => setActiveCourse(null)} />
      ) : activeCategory ? (
        <CategoryScreen 
          category={activeCategory} 
          courses={activeCategoryCourses}
          onBack={() => { setActiveCategory(null); setActiveCategoryCourses(null); }} 
          onViewCourse={(course) => activeTab === 'tests' ? setActiveTestIntro(course) : setActiveCourse(course)}
          isTest={activeTab === 'tests'}
        />
      ) : (
        <>
          {activeTab === 'home' ? renderHomeContent() : null}
          {activeTab === 'courses' ? <CoursesScreen lang={lang} userData={userData} onViewAll={(cat, catCourses) => { setActiveCategory(cat); setActiveCategoryCourses(catCourses || null); }} onViewCourse={(course) => setActiveCourse(course)} initialFilter={coursesInitialFilter} onSubScreenToggle={setIsSubScreenOpen} /> : null}

          {activeTab === 'tests' ? <TestsScreen lang={lang} onViewAll={(cat) => setActiveCategory(cat)} onViewTest={(course) => setActiveTestIntro(course)} /> : null}
          {activeTab === 'ai' ? <AiChatScreen onKeyboardToggle={setIsKeyboardVisible} /> : null}
          {activeTab === 'profile' ? <ProfileScreen userData={userData} onNavigateToMyCourses={() => {
            setCoursesInitialFilter('Mening kurslarim');
            setActiveCategory(null);
            setActiveCourse(null);
            setActiveTab('courses');
          }} onNavigateToMyTests={() => {
            setTestsInitialFilter('Mening testlarim');
            setActiveCategory(null);
            setActiveCourse(null);
            setActiveTab('tests');
          }} onLogout={() => {
            AsyncStorage.removeItem('isLoggedIn');
            setIsAuthenticated(false);
            setActiveTab('home');
            if (onLogout) onLogout();
          }} onOpenNotifications={() => setShowNotifications(true)} /> : null}
        </>
      )}

      {/* Bottom Navigation */}
      {(!activeCourse && !showNotifications && !activeTestIntro && !activeTestRun && (!isSubScreenOpen || activeTab === 'profile') && !isKeyboardVisible) && (
        <View style={styles.bottomNav}>
          <TouchableOpacity 
            style={styles.navItem} 
            activeOpacity={0.7} 
            onPress={() => { 
              setActiveTab('home'); 
              setActiveCategory(null); 
              setIsSubScreenOpen(false); 
            }}
          >
            <Ionicons name="home" size={24} color={activeTab === 'home' ? "#7c3aed" : "#888"} />
            <Text style={[styles.navText, { color: activeTab === 'home' ? '#7c3aed' : '#888' }]}>Bosh sahifa</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.navItem} 
            activeOpacity={0.7} 
            onPress={() => { 
              if (!isAuthenticated) {
                triggerAuth();
              } else {
                setActiveTab('courses'); 
                setActiveCategory(null); 
                setCoursesInitialFilter('Barcha kurslar'); 
                setIsSubScreenOpen(false); 
              }
            }}
          >
            <Ionicons name={activeTab === 'courses' ? "book" : "book-outline"} size={24} color={activeTab === 'courses' ? "#7c3aed" : "#888"} />
            <Text style={[styles.navText, { color: activeTab === 'courses' ? '#7c3aed' : '#888' }]}>Kurslar</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.navItem} 
            activeOpacity={0.7} 
            onPress={() => { 
              if (!isAuthenticated) {
                triggerAuth();
              } else {
                setActiveTab('tests'); 
                setActiveCategory(null); 
                setIsSubScreenOpen(false); 
              }
            }}
          >
            <Ionicons name={activeTab === 'tests' ? "clipboard" : "clipboard-outline"} size={24} color={activeTab === 'tests' ? "#7c3aed" : "#888"} />
            <Text style={[styles.navText, { color: activeTab === 'tests' ? '#7c3aed' : '#888' }]}>Testlar</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.navItem} 
            activeOpacity={0.7} 
            onPress={() => { 
              if (!isAuthenticated) {
                triggerAuth();
              } else {
                setActiveTab('ai'); 
                setActiveCategory(null); 
                setIsSubScreenOpen(false); 
              }
            }}
          >
            <Ionicons name={activeTab === 'ai' ? "hardware-chip" : "hardware-chip-outline"} size={24} color={activeTab === 'ai' ? "#7c3aed" : "#888"} />
            <Text style={[styles.navText, { color: activeTab === 'ai' ? '#7c3aed' : '#888' }]}>AI Yordamchi</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.navItem} 
            activeOpacity={0.7} 
            onPress={() => { 
              if (!isAuthenticated) {
                triggerAuth();
              } else {
                setActiveTab('profile'); 
                setActiveCategory(null); 
                setIsSubScreenOpen(false); 
              }
            }}
          >
            <Ionicons name={activeTab === 'profile' ? "person" : "person-outline"} size={24} color={activeTab === 'profile' ? "#7c3aed" : "#888"} />
            <Text style={[styles.navText, { color: activeTab === 'profile' ? '#7c3aed' : '#888' }]}>Profil</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 15,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerLogo: {
    width: 38,
    height: 38,
    marginRight: 8,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#FDB100',
    lineHeight: 16,
  },
  headerSubtitle: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FDB100',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  coinBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFBEB',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  coinText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#D97706',
    marginLeft: 4,
  },
  bellButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3E8FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bellDot: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EF4444',
  },
  scrollContent: {
    paddingHorizontal: 15,
    paddingTop: 15,
  },
  swiperContainer: {
    marginBottom: 20,
  },
  adCard: {
    width: width - 30,
    borderRadius: 24,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 160,
    overflow: 'hidden',
  },
  adContent: {
    flex: 1,
    paddingRight: 10,
  },
  adBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 8,
  },
  adBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: 'bold',
  },
  adTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  adSubtitle: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 12,
  },
  adButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 14,
    alignSelf: 'flex-start',
  },
  adButtonText: {
    color: '#1E293B',
    fontWeight: '800',
    fontSize: 12,
  },
  adImage: {
    width: 100,
    height: 100,
  },
  paginationRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    gap: 6,
  },
  paginationDot: {
    height: 6,
    borderRadius: 3,
  },
  paginationDotActive: {
    width: 20,
    backgroundColor: '#7C3AED',
  },
  paginationDotInactive: {
    width: 6,
    backgroundColor: '#CBD5E1',
  },
  quickStatsRow: {
    marginBottom: 20,
  },
  statCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 18,
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 3,
    elevation: 1,
  },
  statIconBox: {
    width: 42,
    height: 42,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  statTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
  },
  statDesc: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '500',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
    marginTop: 6,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
  },
  sectionSubtitle: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
    marginTop: 2,
  },
  seeAllText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#7C3AED',
  },
  courseList: {
    marginBottom: 20,
    gap: 12,
  },
  courseItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 14,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  courseIcon: {
    width: 44,
    height: 44,
    marginRight: 12,
  },
  courseInfo: {
    flex: 1,
  },
  courseName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 6,
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  progressLabel: {
    fontSize: 11,
    color: '#64748B',
  },
  progressPercent: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#7C3AED',
  },
  progressBarBg: {
    height: 6,
    backgroundColor: '#F1F5F9',
    borderRadius: 3,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#7C3AED',
    borderRadius: 3,
  },
  courseButton: {
    backgroundColor: '#F3E8FF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 14,
    marginLeft: 10,
  },
  courseButtonText: {
    color: '#7C3AED',
    fontWeight: '700',
    fontSize: 12,
  },
  goalCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  goalIconBox: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FEF2F2',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  goalInfo: {
    flex: 1,
  },
  goalTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 2,
  },
  goalDesc: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 8,
  },
  goalProgressBg: {
    height: 6,
    backgroundColor: '#F1F5F9',
    borderRadius: 3,
    width: '80%',
  },
  goalProgressFill: {
    height: '100%',
    backgroundColor: '#10B981',
    borderRadius: 3,
  },
  goalFraction: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    fontSize: 12,
    fontWeight: '800',
    color: '#0F172A',
  },
  giftIcon: {
    width: 56,
    height: 56,
    marginLeft: 10,
  },
  /* Premium Redesigned Mashhur Kurslar Styles */
  popularCoursesList: {
    marginBottom: 24,
    paddingRight: 15,
    gap: 16,
  },
  popularCourseCard: {
    width: 280,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.04,
    shadowRadius: 16,
    elevation: 4,
  },
  popularCardBanner: {
    height: 90,
    paddingHorizontal: 16,
    paddingTop: 16,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    position: 'relative',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: 'hidden',
  },
  popularCardBannerOverlay: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  popularTagBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  popularTagBadgeText: {
    color: '#1E293B',
    fontSize: 11,
    fontWeight: '800',
  },
  popularIconWrapper: {
    width: 56,
    height: 56,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    position: 'absolute',
    right: 20,
    bottom: -20,
    zIndex: 10,
  },
  popularCardIcon: {
    width: 34,
    height: 34,
  },
  popularCardBody: {
    padding: 20,
    paddingTop: 30,
  },
  popularCategoryText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#7C3AED',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 6,
  },
  popularTitleText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
    lineHeight: 24,
    marginBottom: 16,
    height: 48,
  },
  popularMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F8FAFC',
    padding: 12,
    borderRadius: 16,
    marginBottom: 20,
  },
  popularMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  popularMetaDivider: {
    width: 1,
    height: 16,
    backgroundColor: '#E2E8F0',
  },
  popularMetaItemText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#475569',
  },
  popularActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#0F172A',
    paddingLeft: 20,
    paddingRight: 6,
    height: 52,
    borderRadius: 16,
  },
  popularActionButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  popularActionIconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 14,
    paddingBottom: 22,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    zIndex: 9999,
    elevation: 20,
  },
  navItem: {
    alignItems: 'center',
  },
  navText: {
    fontSize: 10,
    color: '#888',
    marginTop: 4,
    fontWeight: '600',
  },
});
