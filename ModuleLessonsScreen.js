import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Dimensions, Platform, ActivityIndicator, Alert, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LessonDetailScreen from './LessonDetailScreen';
import TestRunnerScreen from './TestRunnerScreen';
import TestAnalysisScreen from './TestAnalysisScreen';

const { width } = Dimensions.get('window');

export default function ModuleLessonsScreen({ course, courseId, module, moduleId, moduleTitle = 'Darslar', onBack }) {
  const insets = useSafeAreaInsets();
  const [activeLesson, setActiveLesson] = useState(null);
  const [activeTest, setActiveTest] = useState(null);
  const [viewingAnalysisTest, setViewingAnalysisTest] = useState(null);
  const [viewingAnalysisAttempt, setViewingAnalysisAttempt] = useState(null);
  const [selectedHistoryTest, setSelectedHistoryTest] = useState(null);
  const [testHistories, setTestHistories] = useState({});
  const [lessonsList, setLessonsList] = useState([]);
  const [completedIds, setCompletedIds] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const activeModuleId = moduleId || module?.id;
  const activeCourseId = courseId || course?.id || course?.course_id || module?.course_id;
  const activeTitle = moduleTitle || module?.title || 'Darslar';

  // Load progress directly from backend database (ensures wiped progress after unenrollment)
  const fetchProgress = useCallback(async () => {
    if (!activeModuleId) return;

    let currentUser = null;
    try {
      const uVal = await AsyncStorage.getItem('userData');
      if (uVal) currentUser = JSON.parse(uVal);
    } catch (e) {}

    const params = new URLSearchParams();
    if (activeCourseId) params.append('course_id', activeCourseId);
    if (activeModuleId) params.append('module_id', activeModuleId);
    if (currentUser?.id || currentUser?.user_id) params.append('user_id', currentUser.id || currentUser.user_id);
    if (currentUser?.email) params.append('email', currentUser.email);
    if (currentUser?.phone) params.append('phone', currentUser.phone);

    try {
      const res = await fetch(`http://192.168.0.107:8000/api/course-progress/?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        if (data.enrolled === false) {
          // Student was unenrolled / expelled by admin: clear everything immediately
          setCompletedIds([]);
          setTestHistories({});
          await AsyncStorage.removeItem(`@punyo_module_completed_${activeModuleId}`);
          await AsyncStorage.removeItem(`@punyo_module_histories_${activeModuleId}`);
          if (onBack) onBack();
          return;
        }

        if (Array.isArray(data.completed_ids) && data.completed_ids.length === 0) {
          // Re-enrolled student: reset everything completely so they start fresh from zero!
          setCompletedIds([]);
          setTestHistories({});
          await AsyncStorage.removeItem(`@punyo_module_completed_${activeModuleId}`);
          await AsyncStorage.removeItem(`@punyo_module_histories_${activeModuleId}`);
        } else {
          setCompletedIds(data.completed_ids || []);
          setTestHistories(data.test_histories || {});
          await AsyncStorage.setItem(`@punyo_module_completed_${activeModuleId}`, JSON.stringify(data.completed_ids || []));
          await AsyncStorage.setItem(`@punyo_module_histories_${activeModuleId}`, JSON.stringify(data.test_histories || {}));
        }
      }
    } catch (e) {
      // Local fallback
      try {
        const completedVal = await AsyncStorage.getItem(`@punyo_module_completed_${activeModuleId}`);
        const historiesVal = await AsyncStorage.getItem(`@punyo_module_histories_${activeModuleId}`);
        if (completedVal) setCompletedIds(JSON.parse(completedVal));
        if (historiesVal) setTestHistories(JSON.parse(historiesVal));
      } catch (err) {}
    }
  }, [activeCourseId, activeModuleId, onBack]);

  useEffect(() => {
    fetchProgress();

    // Check enrollment and progress periodically to respond to admin expulsion
    const progressInterval = setInterval(() => {
      fetchProgress();
    }, 3000);

    return () => clearInterval(progressInterval);
  }, [fetchProgress]);

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
            duration_minutes: t.duration_minutes || 15,
            passing_percentage: t.passing_percentage || 60,
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
  const handleCompleteItem = async (completedItem, resultData) => {
    let isTestFailed = false;
    let updatedHistories = { ...testHistories };

    // 1. If it's a test, save test history (append to list of all attempts)
    if (completedItem.type === 'test' && resultData) {
      const prevData = testHistories[completedItem.id];
      const prevList = Array.isArray(prevData)
        ? prevData
        : (prevData ? [prevData] : []);

      const newAttempt = {
        ...resultData,
        attemptNumber: prevList.length + 1,
        completedAt: resultData.completedAt || new Date().toLocaleDateString('uz-UZ', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })
      };

      const updatedList = [...prevList, newAttempt];
      updatedHistories = {
        ...testHistories,
        [completedItem.id]: updatedList,
      };
      setTestHistories(updatedHistories);
      try {
        await AsyncStorage.setItem(`@punyo_module_histories_${activeModuleId}`, JSON.stringify(updatedHistories));
      } catch (e) {
        console.log('Error saving test history', e);
      }

      if (resultData.isPassed === false) {
        isTestFailed = true;
      }
    }

    // 2. Only add to completedIds if NOT a failed test
    let nextCompleted = [...completedIds];
    if (!isTestFailed && !nextCompleted.includes(completedItem.id)) {
      nextCompleted.push(completedItem.id);
      setCompletedIds(nextCompleted);
      try {
        await AsyncStorage.setItem(`@punyo_module_completed_${activeModuleId}`, JSON.stringify(nextCompleted));
      } catch (e) {
        console.log('Error saving completed item', e);
      }
    }

    // 3. Persist completed item and test history to backend database (ALWAYS, including failed test history!)
    try {
      let currentUser = null;
      try {
        const uVal = await AsyncStorage.getItem('userData');
        if (uVal) currentUser = JSON.parse(uVal);
      } catch (e) {}

      await fetch('http://192.168.0.107:8000/api/course-progress/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          course_id: activeCourseId,
          module_id: activeModuleId,
          user_id: currentUser?.id || currentUser?.user_id,
          email: currentUser?.email,
          phone: currentUser?.phone,
          item_id: completedItem.id,
          test_history: (completedItem.type === 'test' && updatedHistories[completedItem.id]) ? updatedHistories[completedItem.id] : null,
          completed_ids: nextCompleted,
        })
      });
    } catch (err) {
      console.log('Error saving progress to backend:', err);
    }

    // 4. If test failed, return to lessons list
    if (isTestFailed) {
      setActiveTest(null);
      return;
    }

    // 5. Advance to next item if passed
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

    // If test has history (whether passed or failed previously), OPEN HISTORY MODAL FIRST!
    if (item.type === 'test' && testHistories && testHistories[item.id]) {
      setSelectedHistoryTest(item);
      return;
    }

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

  if (viewingAnalysisAttempt) {
    return (
      <TestAnalysisScreen 
        questions={viewingAnalysisAttempt.questions || []}
        userAnswers={viewingAnalysisAttempt.answers || {}}
        testTitle={`${viewingAnalysisAttempt.testTitle || 'Test'} (${viewingAnalysisAttempt.attemptNumber ? viewingAnalysisAttempt.attemptNumber + '-urinish' : 'Tahlil'})`}
        onBack={() => setViewingAnalysisAttempt(null)}
      />
    );
  }

  if (viewingAnalysisTest) {
    const rawH = testHistories[viewingAnalysisTest.id];
    const attempts = Array.isArray(rawH) ? rawH : (rawH ? [rawH] : []);
    const lastAttempt = attempts.length > 0 ? attempts[attempts.length - 1] : rawH;
    return (
      <TestAnalysisScreen 
        questions={lastAttempt?.questions || []}
        userAnswers={lastAttempt?.answers || {}}
        testTitle={viewingAnalysisTest.title}
        onBack={() => setViewingAnalysisTest(null)}
      />
    );
  }

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
        onComplete={(resultData) => handleCompleteItem(activeTest, resultData)}
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
        {/* Sheet Header - Clean Title */}
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
              const rawHistory = testHistories[item.id];
              const attempts = Array.isArray(rawHistory) ? rawHistory : (rawHistory ? [rawHistory] : []);
              const latestHistory = attempts.length > 0 ? attempts[attempts.length - 1] : null;
              const hasHistory = attempts.length > 0;

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
                    (!isCompleted && item.type === 'test' && hasHistory) && { backgroundColor: '#FEE2E2' },
                    isLocked && styles.lessonIconBgLocked
                  ]}>
                    <Ionicons 
                      name={item.type === 'video' ? "play" : "help-circle"} 
                      size={18} 
                      color={isLocked ? "#94A3B8" : (isCompleted ? "#059669" : ((!isCompleted && item.type === 'test' && hasHistory) ? "#DC2626" : "#7c3aed"))} 
                    />
                  </View>

                  {/* Title & Duration */}
                  <View style={styles.lessonInfo}>
                    <Text style={[styles.lessonTitle, isLocked && styles.lessonTitleLocked]}>
                      {item.title}
                    </Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 2, flexWrap: 'wrap' }}>
                      {item.duration ? (
                        <Text style={styles.lessonDuration}>{item.duration}</Text>
                      ) : (
                        <Text style={styles.lessonDuration}>
                          {item.type === 'video' ? "Video dars" : `Test (${item.duration_minutes || 15} daq)`}
                        </Text>
                      )}
                      {isCompleted ? (
                        <View style={styles.completedTag}>
                          <Text style={styles.completedTagText}>
                            {item.type === 'test' && latestHistory ? `${latestHistory.percentage}% (${attempts.length > 1 ? attempts.length + ' urinish' : 'Topshirilgan'})` : "Yakunlangan"}
                          </Text>
                        </View>
                      ) : (item.type === 'test' && hasHistory) ? (
                        <View style={[styles.completedTag, { backgroundColor: '#FEE2E2' }]}>
                          <Text style={[styles.completedTagText, { color: '#DC2626' }]}>
                            {latestHistory?.percentage}% ({attempts.length}-urinish, O'tolmagan)
                          </Text>
                        </View>
                      ) : null}
                    </View>
                  </View>

                  {/* Right Status */}
                  {isCompleted ? (
                    <Ionicons name="checkmark-circle" size={22} color="#10B981" />
                  ) : (item.type === 'test' && hasHistory) ? (
                    <Ionicons name="alert-circle" size={22} color="#EF4444" />
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

      {/* Test Submission History Modal */}
      <Modal
        visible={!!selectedHistoryTest}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setSelectedHistoryTest(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.historyModalCard}>
            {/* Header */}
            <View style={styles.modalHeaderRow}>
              <View style={styles.modalIconWrap}>
                <Ionicons name="ribbon-outline" size={24} color="#7C3AED" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.modalTestTitle} numberOfLines={1}>
                  {selectedHistoryTest?.title}
                </Text>
                <Text style={styles.modalSubtitle}>Topshirilgan barcha natijalar tarixi</Text>
              </View>
              <TouchableOpacity 
                style={styles.modalCloseBtn} 
                onPress={() => setSelectedHistoryTest(null)}
              >
                <Ionicons name="close" size={20} color="#64748B" />
              </TouchableOpacity>
            </View>

            {/* List of all attempts */}
            <ScrollView 
              style={{ maxHeight: 380 }} 
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 6 }}
            >
              {selectedHistoryTest && (() => {
                const rawH = testHistories[selectedHistoryTest.id];
                const attempts = Array.isArray(rawH) ? rawH : (rawH ? [rawH] : []);
                if (attempts.length === 0) {
                  return (
                    <View style={{ paddingVertical: 24, alignItems: 'center' }}>
                      <Text style={{ fontSize: 13, color: '#64748B' }}>Natijalar tarixi mavjud emas</Text>
                    </View>
                  );
                }

                // Show attempts newest first (so latest is on top)
                const reversed = [...attempts].reverse();

                return reversed.map((h, revIdx) => {
                  const attemptNum = h.attemptNumber || (attempts.length - revIdx);
                  const isLatest = revIdx === 0;

                  return (
                    <View key={revIdx} style={styles.attemptCard}>
                      <View style={styles.attemptCardTop}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                          <View style={styles.attemptNumBadge}>
                            <Text style={styles.attemptNumText}>{attemptNum}-urinish</Text>
                          </View>
                          {isLatest && (
                            <View style={styles.latestBadge}>
                              <Text style={styles.latestBadgeText}>Oxirgi</Text>
                            </View>
                          )}
                        </View>

                        <View style={[styles.historyStatusPill, h.isPassed ? styles.pillPassed : styles.pillFailed]}>
                          <Ionicons 
                            name={h.isPassed ? "checkmark-circle" : "close-circle"} 
                            size={14} 
                            color={h.isPassed ? "#059669" : "#DC2626"} 
                            style={{ marginRight: 4 }} 
                          />
                          <Text style={[styles.historyStatusPillText, h.isPassed ? styles.textPassed : styles.textFailed]}>
                            {h.isPassed ? "O'tdingiz" : "O'tolmadingiz"}
                          </Text>
                        </View>
                      </View>

                      <View style={styles.attemptBodyRow}>
                        <View>
                          <Text style={[styles.attemptScoreBig, !h.isPassed && { color: '#EF4444' }]}>
                            {h.percentage}%
                          </Text>
                          <Text style={styles.attemptScoreSub}>
                            {h.score} / {h.total} ball ({h.correctCount} ta to'g'ri)
                          </Text>
                        </View>

                        <TouchableOpacity 
                          style={styles.attemptReviewBtn}
                          activeOpacity={0.8}
                          onPress={() => {
                            setSelectedHistoryTest(null);
                            setViewingAnalysisAttempt({
                              ...h,
                              testTitle: selectedHistoryTest.title,
                              attemptNumber: attemptNum
                            });
                          }}
                        >
                          <Ionicons name="eye-outline" size={15} color="#7C3AED" style={{ marginRight: 5 }} />
                          <Text style={styles.attemptReviewBtnText}>Natijani ko'rish</Text>
                        </TouchableOpacity>
                      </View>

                      <View style={styles.attemptFooterRow}>
                        <View style={styles.attemptMetaItem}>
                          <Ionicons name="time-outline" size={13} color="#64748B" style={{ marginRight: 3 }} />
                          <Text style={styles.attemptMetaText}>{h.timeTaken || '—'}</Text>
                        </View>
                        <View style={styles.attemptMetaItem}>
                          <Ionicons name="calendar-outline" size={13} color="#64748B" style={{ marginRight: 3 }} />
                          <Text style={styles.attemptMetaText}>{h.completedAt || 'Yaqinda'}</Text>
                        </View>
                        <View style={styles.attemptMetaItem}>
                          <Text style={styles.attemptMetaText}>O'tish: {h.passingPercentage || 60}%</Text>
                        </View>
                      </View>
                    </View>
                  );
                });
              })()}
            </ScrollView>

            {/* Bottom Full Action - Retake Test */}
            <TouchableOpacity 
              style={styles.modalRetakeFullBtn} 
              activeOpacity={0.8}
              onPress={() => {
                const testToRetake = selectedHistoryTest;
                setSelectedHistoryTest(null);
                setActiveTest(testToRetake);
              }}
            >
              <Ionicons name="refresh" size={18} color="#FFFFFF" style={{ marginRight: 6 }} />
              <Text style={styles.modalRetakeFullBtnText}>Testni qayta ishlash</Text>
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

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  historyModalCard: {
    backgroundColor: '#FFFFFF',
    width: '100%',
    maxWidth: 400,
    borderRadius: 24,
    padding: 22,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
  },
  modalHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#F3E8FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  modalTestTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
  },
  modalSubtitle: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  modalCloseBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  historyStatsCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 16,
  },
  historyTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  historyScoreBig: {
    fontSize: 32,
    fontWeight: '800',
    color: '#10B981',
  },
  historyScoreSub: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 2,
  },
  historyStatusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  pillPassed: {
    backgroundColor: '#ECFDF5',
  },
  pillFailed: {
    backgroundColor: '#FEF2F2',
  },
  historyStatusPillText: {
    fontSize: 12,
    fontWeight: '700',
  },
  textPassed: {
    color: '#059669',
  },
  textFailed: {
    color: '#DC2626',
  },
  historyDivider: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: 12,
  },
  historyGrid: {
    gap: 6,
  },
  historyGridItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  historyItemLabel: {
    fontSize: 12,
    color: '#64748B',
  },
  historyItemVal: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1E293B',
  },
  modalActionsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  modalActionReview: {
    flex: 1,
    height: 46,
    borderRadius: 12,
    backgroundColor: '#F3E8FF',
    borderWidth: 1,
    borderColor: '#E0D4F5',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalActionReviewText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#7C3AED',
  },
  modalActionRetake: {
    flex: 1,
    height: 46,
    borderRadius: 12,
    backgroundColor: '#7C3AED',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalActionRetakeText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  attemptCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 10,
  },
  attemptCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  attemptNumBadge: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    marginRight: 6,
  },
  attemptNumText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#4F46E5',
  },
  latestBadge: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
  },
  latestBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#D97706',
  },
  attemptBodyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 4,
  },
  attemptScoreBig: {
    fontSize: 24,
    fontWeight: '800',
    color: '#10B981',
  },
  attemptScoreSub: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 1,
  },
  attemptReviewBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3E8FF',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E0D4F5',
  },
  attemptReviewBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#7C3AED',
  },
  attemptFooterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  attemptMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  attemptMetaText: {
    fontSize: 11,
    color: '#64748B',
  },
  modalRetakeFullBtn: {
    height: 48,
    borderRadius: 14,
    backgroundColor: '#7C3AED',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#7C3AED',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 3,
  },
  modalRetakeFullBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
