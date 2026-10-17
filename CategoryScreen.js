import React from 'react';
import { StyleSheet, Text, View, Image, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';

export default function CategoryScreen({ category, onBack, onViewCourse, isTest }) {
  // Course mock data based on the category
  const getCourses = () => {
    if (category === 'Chet tillari') {
      return [
        { icon: require('./assets/uk.png'), title: "English A1", subtitle: "Beginner" },
        { icon: require('./assets/kr.png'), title: "Korean A1", subtitle: "Beginner" },
        { icon: require('./assets/tr.png'), title: "Turkish A1", subtitle: "Beginner" },
        { icon: require('./assets/de.png'), title: "German A1", subtitle: "Beginner" },
        { icon: require('./assets/es.png'), title: "Spanish A1", subtitle: "Beginner" },
        { icon: require('./assets/uk.png'), title: "English A2", subtitle: "Elementary" },
      ];
    }
    if (category === 'IT kurslari') {
      return [
        { icon: require('./assets/python.png'), title: "Python Basics", subtitle: "Beginner • 20 dars" },
        { icon: require('./assets/html.png'), title: "HTML & CSS", subtitle: "Beginner • 18 dars" },
        { icon: require('./assets/js.png'), title: "JavaScript Basics", subtitle: "Beginner • 22 dars" },
        { icon: require('./assets/python.png'), title: "Python Advanced", subtitle: "Advanced • 30 dars" },
      ];
    }
    return [];
  };

  const courses = getCourses();

  const CourseItem = ({ icon, title, subtitle }) => (
    <View style={styles.courseItem}>
      <Image source={icon} style={styles.courseIcon} resizeMode="contain" />
      <View style={styles.courseInfo}>
        <Text style={styles.courseTitle}>{title}{isTest ? " - Test" : ""}</Text>
        <Text style={styles.courseSubtitle}>{subtitle}</Text>
      </View>
      <TouchableOpacity style={styles.viewButton} activeOpacity={0.8} onPress={() => onViewCourse && onViewCourse({ title: title + (isTest ? " - Test" : "") })}>
        <Text style={styles.viewButtonText}>{isTest ? "Test bajarish" : "Ko'rish"}</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      
      {/* Header */}
      <View style={styles.header}>
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
          {courses.map((c, idx) => (
            <CourseItem key={idx} icon={c.icon} title={c.title} subtitle={c.subtitle} />
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
