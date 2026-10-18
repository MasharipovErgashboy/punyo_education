import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Dimensions, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import TestAnalysisScreen from './TestAnalysisScreen';

const { width } = Dimensions.get('window');

export default function TestResultScreen({ 
  score = 0, 
  total = 0,
  passingScore = 0, 
  passingPercentage = 60,
  correctCount = 0,
  wrongCount = 0,
  skippedCount = 0,
  timeTaken = "00:00", 
  totalTime = "15:00",
  isPassed: isPassedProp,
  questions = [],
  userAnswers = {},
  testTitle = "Test natijasi",
  onReview,
  onRetry, 
  onOtherTests,
  onComplete,
}) {
  const insets = useSafeAreaInsets();
  const [showAnalysis, setShowAnalysis] = useState(false);

  const totalQuestions = questions.length > 0 ? questions.length : (correctCount + wrongCount + skippedCount || 1);
  const percentage = Math.round((correctCount / totalQuestions) * 100);
  const isPassed = isPassedProp !== undefined ? isPassedProp : percentage >= passingPercentage;

  if (showAnalysis) {
    return (
      <TestAnalysisScreen 
        questions={questions}
        userAnswers={userAnswers}
        testTitle={testTitle}
        onBack={() => setShowAnalysis(false)} 
      />
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top > 0 ? insets.top + 8 : (Platform.OS === 'ios' ? 50 : 35) }]}>
        <Text style={styles.headerTitle}>Test yakunlandi!</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* Hero Section */}
        <View style={styles.heroSection}>
          {isPassed && (
            <>
              {/* Confetti decorations */}
              <View style={[styles.confettiDot, { top: 10, left: 40, backgroundColor: '#FDB100', transform: [{ rotate: '15deg' }] }]} />
              <View style={[styles.confettiDot, { top: 25, right: 50, backgroundColor: '#EC4899', transform: [{ rotate: '-20deg' }] }]} />
              <View style={[styles.confettiDot, { top: 70, left: 25, backgroundColor: '#3B82F6', transform: [{ rotate: '45deg' }] }]} />
              <View style={[styles.confettiDot, { top: 80, right: 35, backgroundColor: '#10B981', transform: [{ rotate: '30deg' }] }]} />
              <View style={[styles.confettiDot, { top: 120, left: 60, backgroundColor: '#8B5CF6', transform: [{ rotate: '-15deg' }] }]} />
            </>
          )}
          
          <View style={styles.trophyGlow}>
            <View style={styles.trophyCard}>
              <View style={[styles.trophyIconBg, !isPassed && { backgroundColor: '#FEF2F2' }]}>
                <Ionicons 
                  name={isPassed ? "trophy" : "alert-circle"} 
                  size={64} 
                  color={isPassed ? "#F59E0B" : "#EF4444"} 
                />
                {isPassed && (
                  <View style={styles.trophyStarBadge}>
                    <Ionicons name="star" size={14} color="#FFF" />
                  </View>
                )}
              </View>
              <View style={styles.trophyBase} />
            </View>
          </View>
        </View>

        {/* Main Result Card */}
        <View style={styles.mainCard}>
          <Text style={styles.cardHeaderTitle}>Sizning natijangiz</Text>
          
          {/* Main Score Display */}
          <Text style={[styles.scoreText, !isPassed && { color: '#EF4444' }]}>
            {score} <Text style={styles.scoreTotalText}>/ {total}</Text>
          </Text>

          {/* Percentage & Status Badge */}
          <View style={styles.statusRow}>
            <Text style={[styles.percentText, !isPassed && { color: '#EF4444' }]}>{percentage}%</Text>
            <Text style={styles.bulletText}>•</Text>
            <Text style={[styles.statusBadgeText, !isPassed && { color: '#DC2626' }]}>
              {isPassed ? "Ajoyib natija! 👏" : "Qayta urinib ko'ring! 💪"}
            </Text>
          </View>

          <Text style={styles.resultDesc}>
            {isPassed 
              ? `Tabriklaymiz! Siz ${correctCount} ta to'g'ri javob (${percentage}%) bilan o'tish balini (${passingPercentage}%) bajardingiz.`
              : `Afsuski, testdan o'ta olmadingiz. O'tish uchun kamida ${passingPercentage}% kerak edi. Siz ${percentage}% to'pladingiz.`}
          </Text>

          {/* Divider */}
          <View style={styles.divider} />

          {/* Detailed Statistics Grid */}
          <View style={styles.statsGrid}>
            {/* Correct Answers */}
            <View style={styles.statCol}>
              <Text style={styles.statColLabel}>To'g'ri javoblar</Text>
              <View style={styles.statColValueRow}>
                <Text style={[styles.statColNum, { color: '#10B981' }]}>{correctCount}</Text>
                <Ionicons name="checkmark-circle" size={18} color="#10B981" style={{ marginLeft: 4 }} />
              </View>
            </View>

            <View style={styles.colDivider} />

            {/* Wrong Answers */}
            <View style={styles.statCol}>
              <Text style={styles.statColLabel}>Noto'g'ri javoblar</Text>
              <View style={styles.statColValueRow}>
                <Text style={[styles.statColNum, { color: '#EF4444' }]}>{wrongCount}</Text>
                <Ionicons name="close-circle" size={18} color="#EF4444" style={{ marginLeft: 4 }} />
              </View>
            </View>

            <View style={styles.colDivider} />

            {/* Skipped Answers */}
            <View style={styles.statCol}>
              <Text style={styles.statColLabel}>Belgilanmagan</Text>
              <View style={styles.statColValueRow}>
                <Text style={[styles.statColNum, { color: '#6B7280' }]}>{skippedCount}</Text>
                <Ionicons name="remove-circle" size={18} color="#9CA3AF" style={{ marginLeft: 4 }} />
              </View>
            </View>
          </View>
        </View>

        {/* Secondary Info Card (O'tish bali, Sizning ballingiz, Vaqt) */}
        <View style={styles.infoCard}>
          {/* O'tish bali */}
          <View style={styles.infoCol}>
            <View style={styles.infoLabelRow}>
              <Ionicons name="flag-outline" size={16} color="#F59E0B" />
              <Text style={styles.infoLabel}>O'tish bali</Text>
            </View>
            <Text style={styles.infoValue}>
              {passingPercentage}% <Text style={styles.infoTotalValue}>({passingScore} b)</Text>
            </Text>
          </View>

          <View style={styles.colDivider} />

          {/* Sizning ballingiz */}
          <View style={styles.infoCol}>
            <View style={styles.infoLabelRow}>
              <Ionicons name="ribbon-outline" size={16} color={isPassed ? "#10B981" : "#EF4444"} />
              <Text style={styles.infoLabel}>Sizning natijangiz</Text>
            </View>
            <Text style={[styles.infoValue, { color: isPassed ? '#10B981' : '#EF4444' }]}>
              {percentage}% <Text style={styles.infoTotalValue}>({score} b)</Text>
            </Text>
          </View>

          <View style={styles.colDivider} />

          {/* Vaqt */}
          <View style={styles.infoCol}>
            <View style={styles.infoLabelRow}>
              <Ionicons name="time-outline" size={16} color="#7c3aed" />
              <Text style={styles.infoLabel}>Sarflangan vaqt</Text>
            </View>
            <Text style={styles.infoValue}>
              {timeTaken}
            </Text>
          </View>
        </View>

        <View style={{ height: 20 }} />
      </ScrollView>

      {/* Fixed Bottom Action Buttons */}
      <View style={styles.bottomBar}>
        {/* Natijani ko'rish / Tahlil qilish Button */}
        <TouchableOpacity 
          style={styles.reviewBtn} 
          activeOpacity={0.8} 
          onPress={() => {
            if (onReview) onReview();
            setShowAnalysis(true);
          }}
        >
          <Ionicons name="eye-outline" size={18} color="#7c3aed" style={{ marginRight: 6 }} />
          <Text style={styles.reviewBtnText}>Natijani ko'rish (Tahlil)</Text>
        </TouchableOpacity>

        <View style={styles.bottomRowBtns}>
          {isPassed ? (
            <>
              <TouchableOpacity style={styles.retryBtn} activeOpacity={0.8} onPress={onRetry}>
                <Ionicons name="refresh" size={16} color="#4B5563" style={{ marginRight: 4 }} />
                <Text style={styles.retryBtnText}>Qayta ishlash</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.otherTestsBtn} 
                activeOpacity={0.8} 
                onPress={() => {
                  if (onComplete) onComplete();
                  else if (onOtherTests) onOtherTests();
                }}
              >
                <Text style={styles.otherTestsBtnText}>Davom etish</Text>
                <Ionicons name="arrow-forward" size={16} color="#FFF" style={{ marginLeft: 4 }} />
              </TouchableOpacity>
            </>
          ) : (
            <>
              <TouchableOpacity 
                style={[styles.retryBtn, { flex: 1, backgroundColor: '#EF4444', borderColor: '#EF4444' }]} 
                activeOpacity={0.8} 
                onPress={onRetry}
              >
                <Ionicons name="refresh" size={16} color="#FFFFFF" style={{ marginRight: 6 }} />
                <Text style={[styles.retryBtnText, { color: '#FFFFFF' }]}>Qayta topshirish</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.otherTestsBtn, { flex: 0.8, backgroundColor: '#F3F4F6' }]} 
                activeOpacity={0.8} 
                onPress={() => {
                  if (onComplete) onComplete();
                  else if (onOtherTests) onOtherTests();
                }}
              >
                <Text style={[styles.otherTestsBtnText, { color: '#4B5563' }]}>Chiqish</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingBottom: 15,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  scrollContent: {
    paddingBottom: 20,
  },
  heroSection: {
    position: 'relative',
    height: 190,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 15,
  },
  confettiDot: {
    position: 'absolute',
    width: 8,
    height: 14,
    borderRadius: 3,
  },
  trophyGlow: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(253, 177, 0, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  trophyCard: {
    alignItems: 'center',
  },
  trophyIconBg: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#FEF3C7',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  trophyStarBadge: {
    position: 'absolute',
    top: 10,
    right: 14,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#F59E0B',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFF',
  },
  trophyBase: {
    width: 44,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E5E7EB',
    marginTop: 4,
  },
  mainCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  cardHeaderTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 8,
  },
  scoreText: {
    fontSize: 44,
    fontWeight: 'bold',
    color: '#10B981',
  },
  scoreTotalText: {
    fontSize: 22,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    marginBottom: 8,
  },
  percentText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#10B981',
  },
  bulletText: {
    marginHorizontal: 6,
    color: '#9CA3AF',
    fontSize: 14,
  },
  statusBadgeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#059669',
  },
  resultDesc: {
    fontSize: 13,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 19,
    paddingHorizontal: 10,
  },
  divider: {
    width: '100%',
    height: 1,
    backgroundColor: '#F3F4F6',
    marginVertical: 18,
  },
  statsGrid: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
  },
  statCol: {
    flex: 1,
    alignItems: 'center',
  },
  statColLabel: {
    fontSize: 11,
    color: '#9CA3AF',
    fontWeight: '500',
    marginBottom: 4,
    textAlign: 'center',
  },
  statColValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statColNum: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  colDivider: {
    width: 1,
    height: '70%',
    backgroundColor: '#E5E7EB',
    alignSelf: 'center',
  },
  infoCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 20,
    paddingVertical: 18,
    paddingHorizontal: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  infoCol: {
    flex: 1,
    alignItems: 'center',
  },
  infoLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  infoLabel: {
    fontSize: 11,
    color: '#6B7280',
    fontWeight: '600',
    marginLeft: 4,
    textAlign: 'center',
  },
  infoValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  infoTotalValue: {
    fontSize: 11,
    color: '#9CA3AF',
    fontWeight: 'normal',
  },
  bottomBar: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 35,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  reviewBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F5E6FF',
    height: 48,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E0D4F5',
    marginBottom: 10,
  },
  reviewBtnText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#7c3aed',
  },
  bottomRowBtns: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  retryBtn: {
    flex: 1,
    flexDirection: 'row',
    height: 48,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  retryBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4B5563',
  },
  otherTestsBtn: {
    flex: 1,
    flexDirection: 'row',
    height: 48,
    borderRadius: 14,
    backgroundColor: '#7c3aed',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#7c3aed',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  otherTestsBtnText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});
