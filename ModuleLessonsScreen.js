import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Dimensions, Platform, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LessonDetailScreen from './LessonDetailScreen';
import TestRunnerScreen from './TestRunnerScreen';

const { width } = Dimensions.get('window');

export default function ModuleLessonsScreen({ module, moduleId, moduleTitle = 'Darslar', onBack }) {
  const insets = useSafeAreaInsets();
  const [activeLesson, setActiveLesson] = useState(null);
  const [activeTest, setActiveTest] = useState(null);
  const [lessonsList, setLessonsList] = useState([]);
  const [completedIds, setCompletedIds] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const activeModuleId = moduleId || module?.id;
  const activeTitle = moduleTitle || module?.title || 'Darslar';

  // Load saved completed items from AsyncStorage
  useEffect(() => {
    if (!activeModuleId) return;
    const storageKey = `@punyo_module_completed_${activeModuleId}`;
    AsyncStorage.getItem(storageKey)
      .then(val => {
        if (val) {
          try {
            const parsed = JSON.parse(val);
            if (Array.isArray(parsed)) {
              setCompletedIds(parsed);
            }
          } catch (e) {
            console.log('Error parsing completed lessons cache', e);
          }
        }
      })
      .catch(() => {});
  }, [activeModuleId]);

  // Fetch real lessons and tests from backend
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
            question: t.question,
            options: t.options,
            correct_answer: t.correct_answer,
            reading_text: t.reading_text,
            audio_url: t.audio_url,
            tg_bot_link: t.tg_bot_link,
            tg_channel: t.tg_channel,
            order_index: t.order_index,
          });
        });
      }

      items.sort((a, b) => (a.order_index || 0) - (b.order_index || 0));
      setLessonsList(items);
      setIsLoading(false);
    });
  }, [activeModuleId]);

  // Mark an item as completed and move to the next item
  const handleCompleteItem = async (completedItem) => {
    let nextCompleted = [...completedIds];
    if (!nextCompleted.includes(completedItem.id)) {
      nextCompleted.push(completedItem.id);
      setCompletedIds(nextCompleted);
      try {
        await AsyncStorage.setItem(`@punyo_module_completed_${activeModuleId}`, JSON.stringify(nextCompleted));
      } catch (e) {
        console.log('Error saving completed item', e);
      }
    }

    // Advance to next item
    const currentIndex = lessonsList.findIndex(x => x.id === completedItem.id);
    const nextItem = (currentIndex >= 0 && currentIndex + 1 < lessonsList.length) ? lessonsList[currentIndex + 1] : null;

    if (nextItem) {
      if (nextItem.type === 'video') {
        setActiveTest(null);
        setActiveLesson({
          ...nextItem,
          isCompleted: nextCompleted.includes(nextItem.id),
        });
      } else if (nextItem.type === 'test') {
        setActiveLesson(null);
        setActiveTest({
          ...nextItem,
          isCompleted: nextCompleted.includes(nextItem.id),
        });
      }
    } else {
      setActiveLesson(null);
      setActiveTest(null);
      Alert.alert(
        "Tabriklaymiz! 🎉",
        "Siz ushbu modulning barcha darslik va testlarini muvaffaqiyatli yakunladingiz!",
        [{ text: "Ajoyib", style: "default" }]
      );
    }
  };

  const handleItemPress = (item, index) => {
    // First item is always unlocked. Subsequent items are locked if previous item is not completed.
    const isLocked = index > 0 && !completedIds.includes(lessonsList[index - 1]?.id);

    if (isLocked) {
      Alert.alert(
        "Material qulflangan 🔒",
        "Ushbu dars yoki testni ochish uchun avvalgi materialni to'liq yakunlashingiz kerak.",
        [{ text: "Tushundim", style: "default" }]
      );
      return;
    }

    const isItemCompleted = completedIds.includes(item.id);

    if (item.type === 'video') {
      setActiveTest(null);
      setActiveLesson({
        ...item,
        isCompleted: isItemCompleted,
      });
    } else if (item.type === 'test') {
      setActiveLesson(null);
      setActiveTest({
        ...item,
        isCompleted: isItemCompleted,
      });
    }
  };

  if (activeLesson) {
    return (
      <LessonDetailScreen 
        lesson={activeLesson}
        lessonTitle={activeLesson.title} 
        duration={activeLesson.duration} 
        youtubeUrl={activeLesson.youtube_url}
        onBack={() => setActiveLesson(null)} 
        onNext={() => handleCompleteItem(activeLesson)}
      />
    );
  }

  if (activeTest) {
    return (
      <TestRunnerScreen
        testTitle={activeTest.title}
        testData={activeTest}
        onBack={() => setActiveTest(null)}
        onComplete={() => handleCompleteItem(activeTest)}
      />
    );
  }

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
        {/* Sheet Header - Removed the circled counter badge as requested */}
        <View style={styles.sheetHeader}>
          <Text style={styles.sheetTitle}>{activeTitle}</Text>
        </View>

        {/* Lessons List */}
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          {isLoading ? (
            <View style={{ paddingVertical: 40, alignItems: 'center' }}>
              <ActivityIndicator size="large" color="#7c3aed" />
            </View>
          ) : lessonsList.length > 0 ? (
            lessonsList.map((item, index) => {
              const isCompleted = completedIds.includes(item.id);
              const isLocked = index > 0 && !completedIds.includes(lessonsList[index - 1]?.id);

              return (
                <TouchableOpacity 
                  key={item.id} 
                  style={[styles.lessonCard, isLocked && styles.lessonCardLocked]}
                  activeOpacity={0.8}
                  onPress={() => handleItemPress(item, index)}
                >
                  {/* Left Icon */}
                  <View style={[
                    styles.lessonIconBg, 
                    isCompleted && styles.lessonIconBgCompleted, 
                    isLocked && styles.lessonIconBgLocked
                  ]}>
                    <Ionicons 
                      name={item.type === 'video' ? "play" : "help-circle"} 
                      size={18} 
                      color={isLocked ? "#94A3B8" : (isCompleted ? "#059669" : "#7c3aed")} 
                    />
                  </View>

                  {/* Title & Duration */}
                  <View style={styles.lessonInfo}>
                    <Text style={[styles.lessonTitle, isLocked && styles.lessonTitleLocked]}>
                      {item.title}
                    </Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 2 }}>
                      {item.duration ? (
                        <Text style={styles.lessonDuration}>{item.duration}</Text>
                      ) : (
                        <Text style={styles.lessonDuration}>{item.type === 'video' ? "Video dars" : "Test sinovi"}</Text>
                      )}
                      {isCompleted && (
                        <View style={styles.completedTag}>
                          <Text style={styles.completedTagText}>Yakunlangan</Text>
                        </View>
                      )}
                    </View>
                  </View>

                  {/* Right Status (Checkmark, Lock, or Open circle) */}
                  {isCompleted ? (
                    <Ionicons name="checkmark-circle" size={22} color="#10B981" />
                  ) : isLocked ? (
                    <Ionicons name="lock-closed" size={19} color="#94A3B8" />
                  ) : (
                    <View style={styles.openCircle} />
                  )}
                </TouchableOpacity>
              );
            })
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
    backgroundColor: '#F8FAFC',
    borderColor: '#E2E8F0',
    opacity: 0.85,
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
  lessonIconBgCompleted: {
    backgroundColor: '#ECFDF5',
  },
  lessonIconBgLocked: {
    backgroundColor: '#F1F5F9',
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
  lessonTitleLocked: {
    color: '#64748B',
  },
  lessonDuration: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  completedTag: {
    marginLeft: 8,
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 6,
    backgroundColor: '#ECFDF5',
  },
  completedTagText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#059669',
  },
  openCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#CBD5E1',
  },
});
