import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { StyleSheet, Text, View, Image, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const CategoryCourseItem = React.memo(({ course, iconUri, title, subtitle, isTest, onViewCourse }) => {
  const imageSource = useMemo(() => {
    if (iconUri) {
      return typeof iconUri === 'string' ? { uri: iconUri, cache: 'force-cache' } : iconUri;
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
        <Text style={styles.courseTitle}>{title}{isTest ? " - Test" : ""}</Text>
        <Text style={styles.courseSubtitle}>{subtitle}</Text>
      </View>
      <TouchableOpacity 
        style={styles.viewButton} 
        activeOpacity={0.8} 
        onPress={() => onViewCourse && onViewCourse(course || { title: title + (isTest ? " - Test" : "") })}
      >
        <Text style={styles.viewButtonText}>{isTest ? "Test bajarish" : "Ko'rish"}</Text>
      </TouchableOpacity>
    </View>
  );
});

export default function CategoryScreen({ category, onBack, onViewCourse, isTest, courses: propCourses }) {
  const insets = useSafeAreaInsets();
  const [coursesList, setCoursesList] = useState(propCourses || []);

  const fetchCategoryCourses = useCallback(async () => {
    if (isTest) return;
    try {
      const res = await fetch(`http://192.168.0.107:8000/api/courses/?category=${encodeURIComponent(category)}`);
      const data = await res.json();
      if (data.success && Array.isArray(data.courses)) {
        setCoursesList(prev => {
          if (JSON.stringify(prev) === JSON.stringify(data.courses)) {
            return prev;
          }
          return data.courses;
        });
      }
    } catch (e) {
      // silent
    }
  }, [category, isTest]);

  useEffect(() => {
    fetchCategoryCourses();
    if (!isTest) {
      const interval = setInterval(fetchCategoryCourses, 2500);
      return () => clearInterval(interval);
    }
  }, [fetchCategoryCourses, isTest]);

  const handleViewCourse = useCallback((c) => {
    if (onViewCourse) onViewCourse(c);
  }, [onViewCourse]);

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top > 0 ? insets.top + 8 : (Platform.OS === 'ios' ? 50 : 35) }]}>
        <TouchableOpacity onPress={onBack} style={styles.backButton} activeOpacity={0.7}>
          <Ionicons name="arrow-back" size={24} color="#34115C" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{category}</Text>
        <TouchableOpacity style={styles.searchButton}>
          <Ionicons name="search" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        <View style={styles.courseList}>
          {coursesList.map((c, idx) => (
            <CategoryCourseItem 
              key={c.id || idx} 
              course={c}
              iconUri={c.icon || c.icon_url} 
              title={c.name || c.title} 
              subtitle={c.hint || c.subtitle} 
              isTest={isTest}
              onViewCourse={handleViewCourse}
            />
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
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#34115C',
  },
  searchButton: {
    padding: 5,
  },
  scrollContent: {
    paddingTop: 15,
  },
  resultText: {
    fontSize: 14,
    color: '#888',
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  courseList: {
    paddingHorizontal: 15,
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
});
