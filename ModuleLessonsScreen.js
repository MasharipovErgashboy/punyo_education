import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Dimensions, Platform, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import LessonDetailScreen from './LessonDetailScreen';

const { width } = Dimensions.get('window');

export default function ModuleLessonsScreen({ module, moduleId, moduleTitle = 'Darslar', onBack }) {
  const insets = useSafeAreaInsets();
  const [activeLesson, setActiveLesson] = useState(null);
  const [lessonsList, setLessonsList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const activeModuleId = moduleId || module?.id;
  const activeTitle = moduleTitle || module?.title || 'Darslar';

  useEffect(() => {
    if (!activeModuleId) {
      setIsLoading(false);
      return;
    }

    Promise.all([
      fetch(`http://192.168.0.107:8000/api/course-lessons/?module_id=${activeModuleId}`).then(r => r.json()).catch(() => ({ lessons: [] })),
      fetch(`http://192.168.0.107:8000/api/course-tests/?module_id=${activeModuleId}`).then(r => r.json()).catch(() => ({ tests: [] })),
    ]).then(([lessonsData, testsData]) => {
      const items = [];
      if (Array.isArray(lessonsData.lessons)) {
        lessonsData.lessons.forEach(l => {
          items.push({
            id: `l_${l.id}`,
            realId: l.id,
            type: 'video',
            title: l.title,
            duration: l.duration,
            youtube_url: l.youtube_url,
            description: l.description,
            order_index: l.order_index,
            isLocked: false,
          });
        });
      }
      if (Array.isArray(testsData.tests)) {
        testsData.tests.forEach(t => {
          items.push({
            id: `t_${t.id}`,
            realId: t.id,
            type: 'test',
            title: t.title,
            test_type: t.test_type,
            order_index: t.order_index,
            isLocked: false,
          });
        });
      }

      items.sort((a, b) => (a.order_index || 0) - (b.order_index || 0));
      setLessonsList(items);
      setIsLoading(false);
    });
  }, [activeModuleId]);

  if (activeLesson) {
    return (
      <LessonDetailScreen 
        lesson={activeLesson}
        lessonTitle={activeLesson.title} 
        duration={activeLesson.duration} 
        youtubeUrl={activeLesson.youtube_url}
        onBack={() => setActiveLesson(null)} 
      />
    );
  }

  const videoCount = lessonsList.filter(i => i.type === 'video').length;
  const testCount = lessonsList.filter(i => i.type === 'test').length;

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      {/* Top Banner / Header Area */}
      <View style={[styles.topArea, { paddingTop: insets.top > 0 ? insets.top + 8 : (Platform.OS === 'ios' ? 50 : 35) }]}>
        {/* Navigation Buttons */}
        <View style={styles.headerRow}>
          <TouchableOpacity style={styles.circleBtn} activeOpacity={0.8} onPress={onBack}>
            <Ionicons name="chevron-back" size={22} color="#333" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.circleBtn} activeOpacity={0.8}>
            <Ionicons name="share-social-outline" size={20} color="#333" />
          </TouchableOpacity>
        </View>

        {/* Center Silver Medal Graphic */}
        <View style={styles.medalWrapper}>
          <View style={styles.medalCircle}>
            <Ionicons name="ribbon-outline" size={44} color="#A3AED0" />
          </View>
        </View>
      </View>

      {/* Main Sheet (Rounded Top) */}
      <View style={styles.sheetContainer}>
        {/* Sheet Header */}
        <View style={styles.sheetHeader}>
          <Text style={styles.sheetTitle}>{activeTitle}</Text>
          <View style={styles.sheetHeaderMeta}>
            <View style={styles.metaBadge}>
              <Ionicons name="play-outline" size={14} color="#10B981" />
              <Text style={styles.metaBadgeText}>{videoCount} ta video</Text>
            </View>
            <View style={[styles.metaBadge, { marginLeft: 12 }]}>
              <Ionicons name="help-circle-outline" size={14} color="#10B981" />
              <Text style={styles.metaBadgeText}>{testCount} ta test</Text>
            </View>
          </View>
        </View>

        {/* Lessons List */}
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          {isLoading ? (
            <View style={{ paddingVertical: 40, alignItems: 'center' }}>
              <ActivityIndicator size="large" color="#7c3aed" />
            </View>
          ) : lessonsList.length > 0 ? (
            lessonsList.map((item) => (
              <TouchableOpacity 
                key={item.id} 
                style={[styles.lessonCard, item.isLocked && styles.lessonCardLocked]}
                activeOpacity={0.8}
                onPress={() => setActiveLesson(item)}
              >
                {/* Left Icon */}
                <View style={styles.lessonIconBg}>
                  <Ionicons 
                    name={item.type === 'video' ? "play" : "help-circle"} 
                    size={18} 
                    color="#7c3aed" 
                  />
                </View>

                {/* Title & Duration */}
                <View style={styles.lessonInfo}>
                  <Text style={styles.lessonTitle}>{item.title}</Text>
                  {item.duration && (
                    <Text style={styles.lessonDuration}>{item.duration}</Text>
                  )}
                </View>

                {/* Right Status (Open circle or Lock) */}
                {item.isLocked ? (
                  <Ionicons name="lock-closed" size={18} color="#7c3aed" />
                ) : (
                  <View style={styles.openCircle} />
                )}
              </TouchableOpacity>
            ))
          ) : (
            <View style={{ paddingVertical: 40, alignItems: 'center', paddingHorizontal: 20 }}>
              <Ionicons name="film-outline" size={44} color="#C4B5FD" />
              <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#34115C', marginTop: 12, textAlign: 'center' }}>
                Hozircha darsliklar mavjud emas
              </Text>
              <Text style={{ fontSize: 13, color: '#6B7280', marginTop: 6, textAlign: 'center' }}>
                Admin panelning Kurs ichki bo'limi orqali video darsliklar va testlar qo'shilganda shu yerda chiqadi.
              </Text>
            </View>
          )}

          <View style={{ height: 40 }} />
        </ScrollView>
      </View>
    </View>
  );

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  topArea: {
    paddingTop: 15,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  circleBtn: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 3,
  },
  medalWrapper: {
    alignItems: 'center',
    marginVertical: 10,
  },
  medalCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#E2E8F0',
  },
  sheetContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingTop: 24,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 8,
  },
  sheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  sheetTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  sheetHeaderMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaBadgeText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#10B981',
    marginLeft: 4,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  lessonCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 5,
    elevation: 2,
  },
  lessonCardLocked: {
    backgroundColor: '#FAFAFA',
  },
  lessonIconBg: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#F5E6FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  lessonInfo: {
    flex: 1,
    marginRight: 10,
  },
  lessonTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 3,
  },
  lessonDuration: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  openCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#CBD5E1',
  },
});
