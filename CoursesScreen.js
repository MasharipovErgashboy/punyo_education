import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { StyleSheet, Text, View, Image, ScrollView, TouchableOpacity, Platform, RefreshControl, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import CourseModulesScreen from './CourseModulesScreen';

// Standalone memoized CourseItem to prevent re-mounting and flickering on iOS
const CourseItem = React.memo(({ course, iconUri, title, subtitle, onViewCourse }) => {
  const imageSource = useMemo(() => {
    if (iconUri) {
      return { uri: iconUri, cache: 'force-cache' };
    }
    return require('./assets/uk.png');
  }, [iconUri]);

  return (
    <View style={styles.courseItem}>
      <Image 
        source={imageSource} 
        style={styles.courseIcon} 
        resizeMode="contain"
        fadeDuration={0}
      />
      <View style={styles.courseInfo}>
        <Text style={styles.courseTitle}>{title}</Text>
        <Text style={styles.courseSubtitle}>{subtitle}</Text>
      </View>
      <TouchableOpacity 
        style={styles.viewButton} 
        activeOpacity={0.8} 
        onPress={() => onViewCourse && onViewCourse(course || { title })}
      >
        <Text style={styles.viewButtonText}>Ko'rish</Text>
      </TouchableOpacity>
    </View>
  );
});

// Standalone memoized MyCourseItem
const MyCourseItem = React.memo(({ icon, title, level, progress, onSelect }) => (
  <TouchableOpacity 
    style={styles.myCourseCard} 
    activeOpacity={0.8}
    onPress={onSelect}
  >
    <Image source={icon} style={styles.myCourseIcon} resizeMode="contain" fadeDuration={0} />
    
    <View style={styles.myCourseInfo}>
      <Text style={styles.myCourseTitle}>{title}</Text>
      <Text style={styles.myCourseLevel}>{level}</Text>
      
      {/* Progress Bar Row */}
      <View style={styles.myProgressRow}>
        <View style={styles.myProgressBarBg}>
          <View style={[styles.myProgressBarFill, { width: `${progress}%` }]} />
        </View>
        <Text style={styles.myProgressPercent}>{progress}%</Text>
      </View>
    </View>

    {/* Right Arrow Button (>) */}
    <View style={styles.arrowBtnContainer}>
      <Ionicons name="chevron-forward" size={20} color="#666" />
    </View>
  </TouchableOpacity>
));

export default function CoursesScreen({ lang, onViewAll, onViewCourse, initialFilter = 'Barcha kurslar', onSubScreenToggle }) {
  const insets = useSafeAreaInsets();
  const [activeFilter, setActiveFilter] = useState(initialFilter);
  const [selectedCourseModule, setSelectedCourseModule] = useState(null);
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const filters = ['Barcha kurslar', 'Mening kurslarim'];

  const fetchCourses = useCallback(async (silent = false) => {
    try {
      const res = await fetch('http://192.168.0.107:8000/api/courses/');
      const data = await res.json();
      if (data.success && Array.isArray(data.courses)) {
        setCourses(prev => {
          // Compare content to avoid re-rendering if unchanged
          if (JSON.stringify(prev) === JSON.stringify(data.courses)) {
            return prev;
          }
          return data.courses;
        });
      }
    } catch (err) {
      if (!silent) console.log('Error fetching courses:', err);
    } finally {
      if (!silent) {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    }
  }, []);

  useEffect(() => {
    fetchCourses();

    // Real-time polling every 2.5 seconds to sync with admin panel changes
    const interval = setInterval(() => {
      fetchCourses(true);
    }, 2500);

    return () => clearInterval(interval);
  }, [fetchCourses]);

  const onRefresh = () => {
    setIsRefreshing(true);
    fetchCourses();
  };

  useEffect(() => {
    if (onSubScreenToggle) {
      onSubScreenToggle(!!selectedCourseModule);
    }
  }, [selectedCourseModule]);

  const handleViewCourse = useCallback((c) => {
    if (onViewCourse) onViewCourse(c);
  }, [onViewCourse]);

  const handleSelectModule = useCallback((title) => {
    setSelectedCourseModule({ title });
  }, []);

  // Group dynamic backend courses by category (memoized for performance)
  const categoryMap = useMemo(() => {
    const map = {};
    courses.forEach(c => {
      const catName = c.category_name || 'Boshqa kurslar';
      if (!map[catName]) {
        map[catName] = [];
      }
      map[catName].push(c);
    });
    return map;
  }, [courses]);

  const categoryNames = useMemo(() => Object.keys(categoryMap), [categoryMap]);

  if (selectedCourseModule) {
    return (
      <CourseModulesScreen 
        courseTitle={selectedCourseModule.title} 
        onBack={() => setSelectedCourseModule(null)} 
      />
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[
        styles.header,
        { paddingTop: insets.top > 0 ? insets.top + 8 : (Platform.OS === 'ios' ? 50 : 35) }
      ]}>
        <Text style={styles.headerTitle}>Kurslar</Text>
        <TouchableOpacity>
          <Ionicons name="search" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} colors={['#7c3aed']} tintColor="#7c3aed" />
        }
      >
        
        {/* Filters */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtersContainer} contentContainerStyle={styles.filtersContent}>
          {filters.map((filter, index) => {
            const isActive = activeFilter === filter;
            return (
              <TouchableOpacity 
                key={index} 
                style={[styles.filterTab, isActive && styles.filterTabActive]}
                onPress={() => setActiveFilter(filter)}
                activeOpacity={0.8}
              >
                <Text style={[styles.filterText, isActive && styles.filterTextActive]}>{filter}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {activeFilter === 'Barcha kurslar' ? (
          <>
            {isLoading && !isRefreshing ? (
              <View style={{ paddingVertical: 40, alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#7c3aed" />
              </View>
            ) : categoryNames.length > 0 ? (
              categoryNames.map(categoryName => (
                <View key={categoryName} style={{ marginBottom: 15 }}>
                  <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>{categoryName}</Text>
                    <TouchableOpacity 
                      activeOpacity={0.7} 
                      onPress={() => onViewAll && onViewAll(categoryName, categoryMap[categoryName])}
                    >
                      <Text style={styles.seeAllText}>Barchasini ko'rish {'>'}</Text>
                    </TouchableOpacity>
                  </View>

                  <View style={styles.courseList}>
                    {categoryMap[categoryName].map(c => (
                      <CourseItem 
                        key={c.id} 
                        course={c}
                        iconUri={c.icon || c.icon_url} 
                        title={c.name || c.title} 
                        subtitle={c.hint} 
                        onViewCourse={handleViewCourse}
                      />
                    ))}
                  </View>
                </View>
              ))
            ) : (
              <View style={styles.emptyContainer}>
                <Ionicons name="book-outline" size={48} color="#C4B5FD" />
                <Text style={styles.emptyTitle}>Hozircha kurslar mavjud emas</Text>
                <Text style={styles.emptySubtitle}>Admin panel orqali yangi kurslar qo'shilganda bu yerda ko'rinadi.</Text>
              </View>
            )}
          </>
        ) : (
          <View style={styles.myCoursesList}>
            <MyCourseItem 
              icon={require('./assets/html.png')} 
              title="HTML & CSS" 
              level="Boshlang'ich daraja" 
              progress={30}
              onSelect={() => handleSelectModule("HTML & CSS")}
            />
            <MyCourseItem 
              icon={require('./assets/uk.png')} 
              title="English A1 – Beginner" 
              level="Boshlang'ich daraja" 
              progress={60}
              onSelect={() => handleSelectModule("English A1 – Beginner")}
            />
            <MyCourseItem 
              icon={require('./assets/python.png')} 
              title="Python Basics" 
              level="Boshlang'ich daraja" 
              progress={45}
              onSelect={() => handleSelectModule("Python Basics")}
            />
          </View>
        )}

        <View style={{ height: 100 }} />
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
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 15,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#34115C',
  },
  scrollContent: {
    paddingTop: 15,
  },
  filtersContainer: {
    marginBottom: 20,
  },
  filtersContent: {
    paddingHorizontal: 15,
  },
  filterTab: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  filterTabActive: {
    backgroundColor: '#34115C',
    borderColor: '#34115C',
  },
  filterText: {
    color: '#555',
    fontWeight: '600',
    fontSize: 14,
  },
  filterTextActive: {
    color: '#FFFFFF',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222',
  },
  seeAllText: {
    fontSize: 14,
    color: '#7c3aed',
    fontWeight: '500',
  },
  courseList: {
    paddingHorizontal: 15,
    marginBottom: 20,
  },
  courseItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  courseIcon: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    marginRight: 15,
  },
  courseInfo: {
    flex: 1,
  },
  courseTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 2,
  },
  courseSubtitle: {
    fontSize: 12,
    color: '#888',
    marginBottom: 8,
  },
  viewButton: {
    backgroundColor: '#F3E5F5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  viewButtonText: {
    color: '#7c3aed',
    fontSize: 12,
    fontWeight: 'bold',
  },
  myCoursesList: {
    paddingHorizontal: 15,
    marginBottom: 20,
  },
  myCourseCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  myCourseIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    marginRight: 14,
  },
  myCourseInfo: {
    flex: 1,
    marginRight: 10,
  },
  myCourseTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 3,
  },
  myCourseLevel: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 8,
  },
  myProgressRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  myProgressBarBg: {
    flex: 1,
    height: 6,
    backgroundColor: '#E5E7EB',
    borderRadius: 3,
    marginRight: 10,
    overflow: 'hidden',
  },
  myProgressBarFill: {
    height: '100%',
    backgroundColor: '#7c3aed',
    borderRadius: 3,
  },
  myProgressPercent: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#4B5563',
    width: 32,
  },
  arrowBtnContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    paddingVertical: 60,
    paddingHorizontal: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#34115C',
    marginTop: 14,
    marginBottom: 6,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 13,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 19,
  },
});
