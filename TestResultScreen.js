import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import TestAnalysisScreen from './TestAnalysisScreen';

const { width } = Dimensions.get('window');

export default function TestResultScreen({ 
  score = 18, 
  total = 25,
  passingScore = 15, 
  correctCount = 18,
  wrongCount = 5,
  skippedCount = 2,
  timeTaken = "24:18", 
  totalTime = "30:00",
  onReview,
  onRetry, 
  onOtherTests 
}) {
  const [showAnalysis, setShowAnalysis] = useState(false);
  const percentage = Math.round((correctCount / total) * 100);
  const isPassed = score >= passingScore;

  if (showAnalysis) {
    return <TestAnalysisScreen onBack={() => setShowAnalysis(false)} />;
  }

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Test yakunlandi!</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* Celebration / Trophy Hero Section */}
        <View style={styles.heroSection}>
          {/* Confetti decorations */}
          <View style={[styles.confettiDot, { top: 10, left: 40, backgroundColor: '#FDB100', transform: [{ rotate: '15deg' }] }]} />
          <View style={[styles.confettiDot, { top: 25, right: 50, backgroundColor: '#EC4899', transform: [{ rotate: '-20deg' }] }]} />
          <View style={[styles.confettiDot, { top: 70, left: 25, backgroundColor: '#3B82F6', transform: [{ rotate: '45deg' }] }]} />
          <View style={[styles.confettiDot, { top: 80, right: 35, backgroundColor: '#10B981', transform: [{ rotate: '30deg' }] }]} />
          <View style={[styles.confettiDot, { top: 120, left: 60, backgroundColor: '#8B5CF6', transform: [{ rotate: '-15deg' }] }]} />
          
          <View style={styles.trophyGlow}>
            <View style={styles.trophyCard}>
              <View style={styles.trophyIconBg}>
                <Ionicons name="trophy" size={64} color="#F59E0B" />
                <View style={styles.trophyStarBadge}>
                  <Ionicons name="star" size={14} color="#FFF" />
                </View>
              </View>
              <View style={styles.trophyBase} />
            </View>
          </View>
        </View>

        {/* Main Result Card */}
        <View style={styles.mainCard}>
          <Text style={styles.cardHeaderTitle}>Sizning natijangiz</Text>
          
          {/* Main Score Display */}
          <Text style={styles.scoreText}>
            {score} <Text style={styles.scoreTotalText}>/ {total}</Text>
          </Text>

          {/* Percentage & Status Badge */}
          <View style={styles.statusRow}>
            <Text style={styles.percentText}>{percentage}%</Text>
            <Text style={styles.bulletText}>•</Text>
            <Text style={styles.statusBadgeText}>
              {isPassed ? "Yaxshi natija! 👏" : "Qayta urinib ko'ring! 💪"}
            </Text>
          </View>

          <Text style={styles.resultDesc}>
            {isPassed 
              ? `Siz ${score} ball to'pladingiz va testdan o'tdingiz.`
              : `Siz ${score} ball to'pladingiz. Testdan o'tish uchun ${passingScore} ball kerak.`}
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
              <Text style={styles.statColLabel}>O'tkazib yuborilgan</Text>
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
              {passingScore} <Text style={styles.infoTotalValue}>/ {total}</Text>
            </Text>
          </View>

          <View style={styles.colDivider} />

          {/* Sizning ballingiz */}
          <View style={styles.infoCol}>
            <View style={styles.infoLabelRow}>
              <Ionicons name="ribbon-outline" size={16} color="#10B981" />
              <Text style={styles.infoLabel}>Sizning ballingiz</Text>
            </View>
            <Text style={[styles.infoValue, { color: '#10B981' }]}>
              {score} <Text style={styles.infoTotalValue}>/ {total}</Text>
            </Text>
          </View>

          <View style={styles.colDivider} />

          {/* Vaqt */}
          <View style={styles.infoCol}>
            <View style={styles.infoLabelRow}>
              <Ionicons name="time-outline" size={16} color="#7c3aed" />
              <Text style={styles.infoLabel}>Vaqt</Text>
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
        {/* Natijani ko'rish Button */}
        <TouchableOpacity 
          style={styles.reviewBtn} 
          activeOpacity={0.8} 
          onPress={() => {
            if (onReview) onReview();
            setShowAnalysis(true);
          }}
        >
          <Text style={styles.reviewBtnText}>Natijani ko'rish</Text>
        </TouchableOpacity>

        <View style={styles.bottomRowBtns}>
          <TouchableOpacity style={styles.retryBtn} activeOpacity={0.8} onPress={onRetry}>
            <Text style={styles.retryBtnText}>Qayta yechish</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.otherTestsBtn} activeOpacity={0.8} onPress={onOtherTests}>
            <Text style={styles.otherTestsBtnText}>Boshqa testlar</Text>
          </TouchableOpacity>
        </View>
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
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  shareBtn: {
    padding: 6,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 20,
  },
  heroSection: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 170,
    marginVertical: 10,
    position: 'relative',
  },
  confettiDot: {
    position: 'absolute',
    width: 8,
    height: 14,
    borderRadius: 3,
    opacity: 0.8,
  },
  trophyGlow: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  trophyCard: {
    alignItems: 'center',
  },
  trophyIconBg: {
    width: 95,
    height: 95,
    borderRadius: 48,
    backgroundColor: '#FEF3C7',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#FDE68A',
    shadowColor: '#F59E0B',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 6,
    position: 'relative',
  },
  trophyStarBadge: {
    position: 'absolute',
    top: 5,
    right: 5,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#F59E0B',
    justifyContent: 'center',
    alignItems: 'center',
  },
  trophyBase: {
    width: 58,
    height: 12,
    backgroundColor: '#D97706',
    borderBottomLeftRadius: 6,
    borderBottomRightRadius: 6,
    marginTop: -4,
  },
  mainCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 3,
  },
  cardHeaderTitle: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
    marginBottom: 8,
  },
  scoreText: {
    fontSize: 38,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 6,
  },
  scoreTotalText: {
    fontSize: 30,
    fontWeight: '600',
    color: '#4B5563',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  percentText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#10B981',
  },
  bulletText: {
    fontSize: 14,
    color: '#D1D5DB',
    marginHorizontal: 8,
  },
  statusBadgeText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#D97706',
  },
  resultDesc: {
    fontSize: 13,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 16,
  },
  divider: {
    width: '100%',
    height: 1,
    backgroundColor: '#F3F4F6',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  statCol: {
    flex: 1,
    alignItems: 'center',
  },
  statColLabel: {
    fontSize: 11,
    color: '#6B7280',
    marginBottom: 6,
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
    height: 30,
    backgroundColor: '#F3F4F6',
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'space-around',
    borderWidth: 1,
    borderColor: '#F3F4F6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
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
    marginBottom: 6,
  },
  infoLabel: {
    fontSize: 11,
    color: '#6B7280',
    fontWeight: '500',
    marginLeft: 4,
  },
  infoValue: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#111827',
  },
  infoTotalValue: {
    fontSize: 12,
    fontWeight: '500',
    color: '#9CA3AF',
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
    backgroundColor: '#FDB100',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 10,
    shadowColor: '#FDB100',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 3,
  },
  reviewBtnText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  bottomRowBtns: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  retryBtn: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  retryBtnText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#374151',
  },
  otherTestsBtn: {
    flex: 1,
    backgroundColor: '#7c3aed',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    marginLeft: 8,
    shadowColor: '#7c3aed',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 3,
  },
  otherTestsBtnText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});
