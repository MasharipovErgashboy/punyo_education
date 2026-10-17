import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';

const { width } = Dimensions.get('window');

const mockAnalysisQuestions = [
  {
    id: 1,
    status: 'correct',
    category: 'Grammar',
    points: 1,
    questionText: 'I ___________ a student.',
    userAnswer: 'am',
    correctAnswer: 'am',
    explanation: `"I" (men) olmoshi bilan hozirgi zamonda "am" fe'li ishlatiladi.`
  },
  {
    id: 2,
    status: 'wrong',
    category: 'Vocabulary',
    points: 1,
    questionText: 'What is the meaning of "happy"?',
    userAnswer: 'Angry',
    correctAnswer: 'B) Joyful',
    explanation: `"Happy" so'zi baxtiyor, xursand ma'nosini anglatadi. "Joyful" uning sinonimidir.`
  },
  {
    id: 3,
    status: 'correct',
    category: 'Listening',
    points: 1,
    questionText: 'You will hear a conversation between two friends.',
    userAnswer: 'B) At the library',
    correctAnswer: 'B) At the library',
    explanation: `Suhbat kutubxonada bo'lib o'tganligi sababli "At the library" to'g'ri javob.`
  },
  {
    id: 4,
    status: 'skipped',
    category: 'Grammar',
    points: 1,
    questionText: 'She ___________ TV every evening.',
    userAnswer: null,
    correctAnswer: 'watches',
    explanation: `"She" uchinchi shaxs birlikda fe'lga -es qo'shimchasi qo'shiladi.`
  },
  {
    id: 5,
    status: 'correct',
    category: 'Vocabulary',
    points: 1,
    questionText: 'Choose the opposite of "big".',
    userAnswer: 'D) Small',
    correctAnswer: 'D) Small',
    explanation: `"Big" (katta) so'zining qarama-qarshi ma'nodagi doshi "Small" (kichik) hisoblanadi.`
  },
  {
    id: 6,
    status: 'wrong',
    category: 'Reading',
    points: 1,
    questionText: 'Which of the following is a primary color?',
    userAnswer: 'Green',
    correctAnswer: 'A) Red',
    explanation: `Asosiy ranglar (Primary colors): Qizil (Red), Ko'k (Blue), Sariq (Yellow).`
  },
  {
    id: 7,
    status: 'correct',
    category: 'Grammar',
    points: 1,
    questionText: 'They ___________ to the park yesterday.',
    userAnswer: 'went',
    correctAnswer: 'went',
    explanation: `"Yesterday" o'tgan zamon signali bo'lgani uchun fe'lning 2-shakli "went" ishlatiladi.`
  },
  {
    id: 8,
    status: 'skipped',
    category: 'Vocabulary',
    points: 1,
    questionText: 'Synonym for "fast"?',
    userAnswer: null,
    correctAnswer: 'Quick',
    explanation: `"Fast" va "Quick" ikkalasi ham tez ma'nosini beradi.`
  }
];

export default function TestAnalysisScreen({ onBack }) {
  const [activeFilter, setActiveFilter] = useState('all'); // 'all', 'correct', 'wrong', 'skipped'
  const [expandedItems, setExpandedItems] = useState({});

  const toggleExplanation = (id) => {
    setExpandedItems(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const correctCount = mockAnalysisQuestions.filter(q => q.status === 'correct').length;
  const wrongCount = mockAnalysisQuestions.filter(q => q.status === 'wrong').length;
  const skippedCount = mockAnalysisQuestions.filter(q => q.status === 'skipped').length;
  const totalCount = mockAnalysisQuestions.length;

  const filteredQuestions = mockAnalysisQuestions.filter(q => {
    if (activeFilter === 'correct') return q.status === 'correct';
    if (activeFilter === 'wrong') return q.status === 'wrong';
    if (activeFilter === 'skipped') return q.status === 'skipped';
    return true;
  });

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn} activeOpacity={0.7}>
          <Ionicons name="arrow-back" size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Natijani tahlil qilish</Text>
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
              O'tkazib yuborilgan ({skippedCount})
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* Questions List */}
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {filteredQuestions.map((q) => {
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
                    <Text style={styles.statusBadgeYellowText}>Ko'rib chiqish</Text>
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

              {/* Toggle Explanation Button (for wrong or all) */}
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
        })}
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
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 15,
    paddingBottom: 15,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  backBtn: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  filterContainer: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  filterScroll: {
    paddingHorizontal: 16,
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    marginRight: 8,
  },
  filterChipActive: {
    backgroundColor: '#7c3aed',
  },
  filterChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#4B5563',
  },
  filterChipTextActive: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  scrollContent: {
    padding: 16,
  },
  questionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 5,
    elevation: 2,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  badgeCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  badgeCircleText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  categoryText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6B7280',
  },
  dotSeparator: {
    color: '#D1D5DB',
    marginHorizontal: 4,
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
