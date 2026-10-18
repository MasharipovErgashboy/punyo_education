import React, { useState, useEffect, useMemo } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Dimensions, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import TestResultScreen from './TestResultScreen';

const { width } = Dimensions.get('window');

// Generate 50 mock questions
const TOTAL_QUESTIONS = 50;
const mockQuestions = Array.from({ length: TOTAL_QUESTIONS }).map((_, index) => ({
  id: index + 1,
  category: index < 15 ? 'Grammar' : index < 30 ? 'Vocabulary' : 'Reading',
  points: 10,
  question: index === 11 ? "I ___________ to school every day." : `This is a sample question number ${index + 1}. Choose the correct option below.`,
  options: [
    { id: 'A', text: index === 11 ? 'go' : 'Option A' },
    { id: 'B', text: index === 11 ? 'goes' : 'Option B' },
    { id: 'C', text: index === 11 ? 'going' : 'Option C' },
    { id: 'D', text: index === 11 ? 'went' : 'Option D' },
    { id: 'E', text: index === 11 ? 'gone' : 'Option E' }
  ],
  correctOption: 'A',
  explanation: index === 11 ? "\"I\" olmoshi uchun hozirgi oddiy zamonda fe'lning asosiy shakli ishlatiladi." : "Batafsil izoh bu yerda yoziladi."
}));

export default function TestRunnerScreen({ testTitle, testData, onBack, onComplete }) {
  const insets = useSafeAreaInsets();

  const questionsList = useMemo(() => {
    if (testData?.questions && Array.isArray(testData.questions) && testData.questions.length > 0) {
      return testData.questions;
    }
    if (testData?.question) {
      const rawOpts = testData.options || [];
      const letters = ['A', 'B', 'C', 'D', 'E'];
      const formattedOpts = rawOpts.map((opt, i) => {
        if (typeof opt === 'string') {
          return { id: letters[i] || String(i + 1), text: opt };
        }
        return { id: opt.id || letters[i] || String(i + 1), text: opt.text || String(opt) };
      });

      return [{
        id: 1,
        category: testData.test_type ? testData.test_type.toUpperCase() : 'Grammar',
        points: 10,
        question: testData.question,
        options: formattedOpts,
        correctOption: (testData.correct_answer || 'A').toUpperCase().trim(),
        explanation: testData.reading_text || '',
        audioUrl: testData.audio_url || null,
      }];
    }
    return mockQuestions;
  }, [testData]);

  const isRealData = !!(testData?.question || (testData?.questions && testData.questions.length > 0));
  const totalCount = questionsList.length;

  const [currentIdx, setCurrentIdx] = useState(isRealData ? 0 : 11);
  const [answers, setAnswers] = useState(isRealData ? {} : { 11: 'A' });
  const [bookmarks, setBookmarks] = useState(isRealData ? [] : [13, 16]);
  const [timeLeft, setTimeLeft] = useState(35 * 60 + 42); // 35:42 in seconds
  const [isPaused, setIsPaused] = useState(false);
  const [isGridExpanded, setIsGridExpanded] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    let timer;
    if (!isPaused && timeLeft > 0 && !isCompleted) {
      timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isPaused, timeLeft, isCompleted]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleSelectOption = (optionId) => {
    setAnswers(prev => ({ ...prev, [currentIdx]: optionId }));
  };

  const toggleBookmark = () => {
    setBookmarks(prev => {
      if (prev.includes(currentIdx)) {
        return prev.filter(idx => idx !== currentIdx);
      } else {
        return [...prev, currentIdx];
      }
    });
  };

  const goToPrev = () => {
    if (currentIdx > 0) setCurrentIdx(currentIdx - 1);
  };

  const goToNext = () => {
    if (currentIdx < totalCount - 1) {
      setCurrentIdx(currentIdx + 1);
    } else {
      setIsCompleted(true);
    }
  };

  if (isCompleted) {
    let correctCount = 0;
    questionsList.forEach((q, idx) => {
      const userAns = answers[idx];
      const correct = q.correctOption;
      if (userAns && String(userAns).toUpperCase() === String(correct).toUpperCase()) {
        correctCount++;
      }
    });

    const calculatedScore = isRealData ? correctCount * 10 : 18;
    const totalScore = isRealData ? totalCount * 10 : 25;
    const passThreshold = isRealData ? Math.ceil(totalCount * 0.6) * 10 : 15;

    return (
      <TestResultScreen
        score={calculatedScore}
        total={totalScore}
        passingScore={passThreshold}
        correctCount={isRealData ? correctCount : 18}
        wrongCount={isRealData ? totalCount - correctCount : 5}
        skippedCount={isRealData ? totalCount - Object.keys(answers).length : 2}
        timeTaken="02:15"
        totalTime="10:00"
        onRetry={() => {
          setAnswers({});
          setCurrentIdx(0);
          setIsCompleted(false);
        }}
        onOtherTests={() => {
          if (onComplete) onComplete();
          else onBack();
        }}
      />
    );
  }

  const question = questionsList[currentIdx] || questionsList[0] || mockQuestions[0];
  const selectedAnswer = answers[currentIdx];
  const isBookmarked = bookmarks.includes(currentIdx);

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top > 0 ? insets.top + 8 : (Platform.OS === 'ios' ? 50 : 35) }]}>
        <TouchableOpacity onPress={onBack} style={styles.iconBtn} activeOpacity={0.7}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>{testTitle || "English A1 - Full Test"}</Text>
        <View style={styles.headerRight}>
          <TouchableOpacity 
            style={styles.finishHeaderBtn} 
            activeOpacity={0.8}
            onPress={() => setIsCompleted(true)}
          >
            <Text style={styles.finishHeaderBtnText}>Yakunlash</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.pauseBtn} 
            activeOpacity={0.7} 
            onPress={() => setIsPaused(!isPaused)}
          >
            <Ionicons name={isPaused ? "play" : "pause"} size={16} color="#333" />
          </TouchableOpacity>
          <View style={styles.timerBox}>
            <Ionicons name="time-outline" size={16} color="#7c3aed" style={{ marginRight: 4 }} />
            <Text style={styles.timerText}>{formatTime(timeLeft)}</Text>
          </View>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* Progress */}
        <View style={styles.progressHeader}>
          <Text style={styles.progressText}>{currentIdx + 1} / {totalCount}</Text>
          <View style={styles.progressBarBg}>
            <View style={[styles.progressBarFill, { width: `${((currentIdx + 1) / totalCount) * 100}%` }]} />
          </View>
        </View>

        {/* Question Card */}
        <View style={styles.questionCard}>
          <View style={styles.qMetaRow}>
            <Text style={styles.qCategory}>{question.category}</Text>
            <View style={styles.qPointsBadge}>
              <Text style={styles.qPointsText}>{question.points} ball</Text>
            </View>
          </View>
          
          <Text style={styles.questionText}>{question.question}</Text>

          {/* Options */}
          <View style={styles.optionsList}>
            {question.options.map((opt) => {
              const isSelected = selectedAnswer === opt.id;
              return (
                <TouchableOpacity 
                  key={opt.id}
                  style={[
                    styles.optionItem,
                    isSelected && styles.optionItemSelected
                  ]}
                  activeOpacity={0.8}
                  onPress={() => handleSelectOption(opt.id)}
                >
                  <Text style={[styles.optionLetter, isSelected && styles.optionLetterSelected]}>{opt.id}</Text>
                  <Text style={[styles.optionText, isSelected && styles.optionTextSelected]}>{opt.text}</Text>
                  {isSelected && (
                    <Ionicons name="checkmark" size={18} color="#4CAF50" />
                  )}
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Explanation (Shows if answered) */}
          {selectedAnswer && (
            <View style={styles.explanationBox}>
              <View style={styles.expHeader}>
                <Ionicons name="bulb-outline" size={16} color="#7c3aed" />
                <Text style={styles.expTitle}>Izoh:</Text>
              </View>
              <Text style={styles.expText}>{question.explanation}</Text>
            </View>
          )}
        </View>

        <View style={{ height: 20 }} />
      </ScrollView>

      {/* Fixed Bottom Container (Navigation Buttons + Collapsible Question Grid) */}
      <View style={[styles.gridContainer, !isGridExpanded && styles.gridContainerCollapsed]}>
        {/* Navigation Buttons (Oldingi, Belgilangan, Keyingisi) */}
        <View style={styles.actionsRow}>
          <TouchableOpacity style={styles.actionBtn} onPress={goToPrev} disabled={currentIdx === 0}>
            <Ionicons name="arrow-back" size={16} color={currentIdx === 0 ? "#CCC" : "#333"} />
            <Text style={[styles.actionBtnText, currentIdx === 0 && { color: "#CCC" }]}>Oldingi</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionBtn} onPress={toggleBookmark}>
            <Ionicons name={isBookmarked ? "bookmark" : "bookmark-outline"} size={16} color={isBookmarked ? "#FDB100" : "#333"} />
            <Text style={styles.actionBtnText}>{isBookmarked ? "Belgilangan" : "Belgilang"}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.nextBtn} onPress={goToNext}>
            <Text style={styles.nextBtnText}>{currentIdx === totalCount - 1 ? "Yakunlash" : "Keyingi"}</Text>
            <Ionicons name={currentIdx === totalCount - 1 ? "checkmark-circle" : "arrow-forward"} size={16} color="#FFF" />
          </TouchableOpacity>
        </View>

        {/* Toggle Bar for Grid */}
        <TouchableOpacity 
          style={styles.gridToggleBar} 
          onPress={() => setIsGridExpanded(!isGridExpanded)}
          activeOpacity={0.7}
        >
          <View style={styles.gridToggleLeft}>
            <View style={styles.gridToggleBadge}>
              <Text style={styles.gridToggleBadgeText}>{currentIdx + 1}</Text>
            </View>
            <Text style={styles.gridToggleTitle}>
              {isGridExpanded ? "Savollar ro'yxatini yopish" : `Savollar ro'yxati (${currentIdx + 1}/${totalCount})`}
            </Text>
          </View>
          <Ionicons 
            name={isGridExpanded ? "chevron-down" : "chevron-up"} 
            size={20} 
            color="#7c3aed" 
          />
        </TouchableOpacity>

        {/* Collapsible Content */}
        {isGridExpanded && (
          <>
            <View style={styles.grid}>
              {questionsList.map((q, idx) => {
                const num = idx + 1;
                const hasAnswer = answers[idx] !== undefined;
                const isMarked = bookmarks.includes(idx);
                const isCurrent = currentIdx === idx;

                let cellStyle = styles.gridCell;
                let textStyle = styles.gridCellText;

                if (hasAnswer) {
                  cellStyle = [cellStyle, styles.gridCellAnswered];
                  textStyle = [textStyle, styles.gridCellTextAnswered];
                } else if (isMarked) {
                  cellStyle = [cellStyle, styles.gridCellMarked];
                  textStyle = [textStyle, styles.gridCellTextMarked];
                }

                if (isCurrent) {
                  cellStyle = [cellStyle, styles.gridCellCurrent];
                }

                return (
                  <TouchableOpacity 
                    key={idx} 
                    style={cellStyle}
                    onPress={() => setCurrentIdx(idx)}
                  >
                    <Text style={textStyle}>{num}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
            
            {/* Legend */}
            <View style={styles.legendRow}>
              <View style={styles.legendItem}>
                <View style={[styles.legendBox, { backgroundColor: '#4CAF50' }]} />
                <Text style={styles.legendText}>Javob berilgan</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendBox, { backgroundColor: '#FDB100' }]} />
                <Text style={styles.legendText}>Belgilangan</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendBox, { backgroundColor: '#F0F0F0' }]} />
                <Text style={styles.legendText}>Javob berilmagan</Text>
              </View>
            </View>
          </>
        )}
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
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingTop: 15,
    paddingBottom: 15,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  iconBtn: {
    padding: 5,
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 10,
    marginRight: 10,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  finishHeaderBtn: {
    backgroundColor: '#F5E6FF',
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 14,
    marginRight: 6,
    borderWidth: 1,
    borderColor: '#E0D4F5',
  },
  finishHeaderBtnText: {
    color: '#7c3aed',
    fontSize: 12,
    fontWeight: 'bold',
  },
  pauseBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  timerBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5E6FF',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
  },
  timerText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#7c3aed',
  },
  scrollContent: {
    padding: 15,
  },
  progressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  progressText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#7c3aed',
    marginRight: 15,
    width: 55,
  },
  progressBarBg: {
    flex: 1,
    height: 6,
    backgroundColor: '#E0D4F5',
    borderRadius: 3,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#7c3aed',
    borderRadius: 3,
  },
  questionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
    marginBottom: 12,
  },
  qMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  qCategory: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#7c3aed',
  },
  qPointsBadge: {
    backgroundColor: '#F5E6FF',
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 10,
  },
  qPointsText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#7c3aed',
  },
  questionText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
    lineHeight: 22,
    marginBottom: 12,
  },
  optionsList: {
    marginBottom: 10,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 11,
    paddingVertical: 11,
    paddingHorizontal: 14,
    marginBottom: 8,
    backgroundColor: '#FAFAFA',
  },
  optionItemSelected: {
    borderColor: '#4CAF50',
    backgroundColor: '#E8F5E9',
  },
  optionLetter: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#666',
    marginRight: 10,
    width: 20,
  },
  optionLetterSelected: {
    color: '#4CAF50',
  },
  optionText: {
    flex: 1,
    fontSize: 15,
    color: '#333',
  },
  optionTextSelected: {
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  explanationBox: {
    backgroundColor: '#FAFAFA',
    borderWidth: 1,
    borderColor: '#E0D4F5',
    borderRadius: 11,
    padding: 12,
    marginBottom: 10,
  },
  expHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  expTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#7c3aed',
    marginLeft: 6,
  },
  expText: {
    fontSize: 13,
    color: '#555',
    lineHeight: 19,
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FAFAFA',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    paddingHorizontal: 10,
    paddingVertical: 9,
    borderRadius: 10,
    flex: 1,
    justifyContent: 'center',
    marginRight: 6,
  },
  actionBtnText: {
    marginLeft: 5,
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
  },
  nextBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#7c3aed',
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 10,
    flex: 1.1,
    justifyContent: 'center',
    shadowColor: '#7c3aed',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  nextBtnText: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: 'bold',
    marginRight: 5,
  },
  gridContainer: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 15,
    paddingTop: 12,
    paddingBottom: 35,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 5,
  },
  gridContainerCollapsed: {
    paddingBottom: 25,
  },
  gridToggleBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F5E6FF',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E0D4F5',
  },
  gridToggleLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  gridToggleBadge: {
    width: 26,
    height: 26,
    borderRadius: 7,
    backgroundColor: '#7c3aed',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  gridToggleBadgeText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  gridToggleTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#7c3aed',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  gridCell: {
    width: 33,
    height: 33,
    borderRadius: 8,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 2,
  },
  gridCellAnswered: {
    backgroundColor: '#4CAF50',
  },
  gridCellMarked: {
    backgroundColor: '#FDB100',
  },
  gridCellCurrent: {
    borderWidth: 2,
    borderColor: '#7c3aed',
  },
  gridCellText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#666',
  },
  gridCellTextAnswered: {
    color: '#FFF',
  },
  gridCellTextMarked: {
    color: '#FFF',
  },
  legendRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 8,
    marginBottom: 4,
  },
  legendBox: {
    width: 12,
    height: 12,
    borderRadius: 3,
    marginRight: 6,
  },
  legendText: {
    fontSize: 11,
    color: '#666',
  },
});
