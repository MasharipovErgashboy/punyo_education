import React, { useState, useMemo } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Dimensions, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

export default function TestAnalysisScreen({ 
  onBack, 
  questions = [], 
  userAnswers = {}, 
  testTitle = "Natijani tahlil qilish" 
}) {
  const insets = useSafeAreaInsets();
  const [activeFilter, setActiveFilter] = useState('all'); // 'all', 'correct', 'wrong', 'skipped'
  const [expandedItems, setExpandedItems] = useState({});

  const toggleExplanation = (id) => {
    setExpandedItems(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const analysisQuestions = useMemo(() => {
    if (!questions || !Array.isArray(questions) || questions.length === 0) {
      return [];
    }

    return questions.map((q, idx) => {
      const qNum = idx + 1;
      const userAnsKey = userAnswers[idx];
      const rawCorrect = (q.correctOption || q.correct_answer || 'A').toString().toUpperCase().trim();

      let userAnsText = null;
      let correctAnsText = rawCorrect;

      if (Array.isArray(q.options) && q.options.length > 0) {
        const letters = ['A', 'B', 'C', 'D', 'E'];
        q.options.forEach((opt, optIdx) => {
          const optLetter = typeof opt === 'object' ? (opt.id || letters[optIdx]) : letters[optIdx];
          const optText = typeof opt === 'object' ? (opt.text || opt.title || '') : String(opt);

          if (userAnsKey && String(optLetter).toUpperCase() === String(userAnsKey).toUpperCase()) {
            userAnsText = `${optLetter}) ${optText}`;
          }
          if (String(optLetter).toUpperCase() === rawCorrect) {
            correctAnsText = `${optLetter}) ${optText}`;
          }
        });
      }

      let status = 'skipped';
      if (userAnsKey !== undefined && userAnsKey !== null) {
        if (String(userAnsKey).toUpperCase() === rawCorrect) {
          status = 'correct';
        } else {
          status = 'wrong';
        }
      }

      return {
        id: qNum,
        status,
        category: q.category || (q.test_type ? q.test_type.toUpperCase() : 'Grammar'),
        points: q.points || 10,
        questionText: q.question || q.questionText || `Savol #${qNum}`,
        userAnswer: userAnsText || (userAnsKey ? String(userAnsKey) : null),
        correctAnswer: correctAnsText,
        explanation: q.explanation || q.reading_text || `To'g'ri javob: ${correctAnsText}`
      };
    });
  }, [questions, userAnswers]);

  const correctCount = analysisQuestions.filter(q => q.status === 'correct').length;
  const wrongCount = analysisQuestions.filter(q => q.status === 'wrong').length;
  const skippedCount = analysisQuestions.filter(q => q.status === 'skipped').length;
  const totalCount = analysisQuestions.length;

  const filteredQuestions = analysisQuestions.filter(q => {
    if (activeFilter === 'correct') return q.status === 'correct';
    if (activeFilter === 'wrong') return q.status === 'wrong';
    if (activeFilter === 'skipped') return q.status === 'skipped';
    return true;
  });

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top > 0 ? insets.top + 8 : (Platform.OS === 'ios' ? 50 : 35) }]}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn} activeOpacity={0.7}>
          <Ionicons name="arrow-back" size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>{testTitle}</Text>
        <View style={{ width: 32 }} />
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
          <TouchableOpacity 
            style={[styles.filterChip, activeFilter === 'all' && styles.filterChipActive]}
            activeOpacity={0.8}
            onPress={() => setActiveFilter('all')}
          >
            <Text style={[styles.filterChipText, activeFilter === 'all' && styles.filterChipTextActive]}>
              Barchasi ({totalCount})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.filterChip, activeFilter === 'correct' && styles.filterChipActive]}
            activeOpacity={0.8}
            onPress={() => setActiveFilter('correct')}
          >
            <Text style={[styles.filterChipText, activeFilter === 'correct' && styles.filterChipTextActive]}>
              To'g'ri ({correctCount})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.filterChip, activeFilter === 'wrong' && styles.filterChipActive]}
            activeOpacity={0.8}
            onPress={() => setActiveFilter('wrong')}
          >
            <Text style={[styles.filterChipText, activeFilter === 'wrong' && styles.filterChipTextActive]}>
              Noto'g'ri ({wrongCount})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.filterChip, activeFilter === 'skipped' && styles.filterChipActive]}
            activeOpacity={0.8}
            onPress={() => setActiveFilter('skipped')}
          >
            <Text style={[styles.filterChipText, activeFilter === 'skipped' && styles.filterChipTextActive]}>
              Belgilanmagan ({skippedCount})
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* Questions List */}
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {filteredQuestions.length > 0 ? (
          filteredQuestions.map((q) => {
            const isExpanded = !!expandedItems[q.id];

            return (
              <View key={q.id} style={styles.questionCard}>
                {/* Top Row */}
                <View style={styles.cardHeaderRow}>
                  <View style={styles.cardHeaderLeft}>
                    {/* Circle Badge */}
                    {q.status === 'correct' && (
                      <View style={[styles.badgeCircle, { backgroundColor: '#10B981' }]}>
                        <Text style={styles.badgeCircleText}>{q.id}</Text>
                      </View>
                    )}
                    {q.status === 'wrong' && (
                      <View style={[styles.badgeCircle, { backgroundColor: '#EF4444' }]}>
                        <Ionicons name="close" size={16} color="#FFF" />
                      </View>
                    )}
                    {q.status === 'skipped' && (
                      <View style={[styles.badgeCircle, { backgroundColor: '#F59E0B' }]}>
                        <Text style={styles.badgeCircleText}>{q.id}</Text>
                      </View>
                    )}

                    {/* Category & Points */}
                    <Text style={styles.categoryText}>
                      {q.category} <Text style={styles.dotSeparator}>•</Text> {q.points} ball
                    </Text>
                  </View>

                  {/* Status Label */}
                  {q.status === 'correct' && (
                    <View style={styles.statusBadgeGreen}>
                      <Text style={styles.statusBadgeGreenText}>To'g'ri</Text>
                    </View>
                  )}
                  {q.status === 'wrong' && (
                    <View style={styles.statusBadgeRed}>
                      <Text style={styles.statusBadgeRedText}>Noto'g'ri</Text>
                    </View>
                  )}
                  {q.status === 'skipped' && (
                    <View style={styles.statusBadgeYellow}>
                      <Text style={styles.statusBadgeYellowText}>Belgilanmagan</Text>
                    </View>
                  )}
                </View>

                {/* Question Text */}
                <Text style={styles.questionText}>{q.questionText}</Text>

                {/* User Answer (if wrong) */}
                {q.status === 'wrong' && q.userAnswer && (
                  <View style={styles.answerRow}>
                    <Text style={styles.userAnswerLabel}>Sizning javobingiz: </Text>
                    <Text style={styles.userAnswerValue}>{q.userAnswer}</Text>
                  </View>
                )}

                {/* Correct Answer */}
                <View style={styles.answerRow}>
                  <Text style={styles.correctAnswerLabel}>To'g'ri javob: </Text>
                  <Text style={styles.correctAnswerValue}>{q.correctAnswer}</Text>
                </View>

                {/* Toggle Explanation Button */}
                <View style={styles.cardFooterRow}>
                  <View style={{ flex: 1 }} />
                  <TouchableOpacity 
                    style={styles.expToggleBtn}
                    activeOpacity={0.7}
                    onPress={() => toggleExplanation(q.id)}
                  >
                    <Ionicons name="eye-outline" size={15} color="#4B5563" style={{ marginRight: 5 }} />
                    <Text style={styles.expToggleBtnText}>
                      {isExpanded ? "Izohni yopish" : "Izohni ko'rish"}
                    </Text>
                  </TouchableOpacity>
                </View>

                {/* Explanation Content */}
                {isExpanded && (
                  <View style={styles.explanationBox}>
                    <View style={styles.expHeader}>
                      <Ionicons name="bulb-outline" size={16} color="#7c3aed" />
                      <Text style={styles.expTitle}>Izoh:</Text>
                    </View>
                    <Text style={styles.expText}>{q.explanation}</Text>
                  </View>
                )}
              </View>
            );
          })
        ) : (
          <View style={{ paddingVertical: 40, alignItems: 'center' }}>
            <Ionicons name="document-text-outline" size={40} color="#94A3B8" />
            <Text style={{ fontSize: 14, color: '#64748B', marginTop: 10 }}>Ushbu filtr bo'yicha savollar mavjud emas</Text>
          </View>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 14,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  backBtn: {
    padding: 6,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#1F2937',
    maxWidth: width * 0.7,
  },
  filterContainer: {
    backgroundColor: '#FFF',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  filterScroll: {
    paddingHorizontal: 16,
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  filterChipActive: {
    backgroundColor: '#7c3aed',
    borderColor: '#7c3aed',
  },
  filterChipText: {
    fontSize: 13,
    color: '#4B5563',
    fontWeight: '600',
  },
  filterChipTextActive: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  scrollContent: {
    padding: 16,
  },
  questionCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 5,
    elevation: 2,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  cardHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  badgeCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  badgeCircleText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  categoryText: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '500',
  },
  dotSeparator: {
    color: '#9CA3AF',
  },
  statusBadgeGreen: {
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusBadgeGreenText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#059669',
  },
  statusBadgeRed: {
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusBadgeRedText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#DC2626',
  },
  statusBadgeYellow: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusBadgeYellowText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#D97706',
  },
  questionText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 10,
    lineHeight: 22,
  },
  answerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    flexWrap: 'wrap',
  },
  userAnswerLabel: {
    fontSize: 13,
    color: '#EF4444',
    fontWeight: '500',
  },
  userAnswerValue: {
    fontSize: 13,
    color: '#EF4444',
    fontWeight: 'bold',
  },
  correctAnswerLabel: {
    fontSize: 13,
    color: '#10B981',
    fontWeight: '500',
  },
  correctAnswerValue: {
    fontSize: 13,
    color: '#10B981',
    fontWeight: 'bold',
  },
  cardFooterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  expToggleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  expToggleBtnText: {
    fontSize: 12,
    color: '#374151',
    fontWeight: '600',
  },
  explanationBox: {
    marginTop: 10,
    backgroundColor: '#FAFAFA',
    borderWidth: 1,
    borderColor: '#E0D4F5',
    borderRadius: 12,
    padding: 12,
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
    fontSize: 12,
    color: '#4B5563',
    lineHeight: 18,
  },
});
