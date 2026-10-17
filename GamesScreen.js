import React, { useState } from 'react';
import { StyleSheet, Text, View, Image, ScrollView, TouchableOpacity, Dimensions, Modal, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';

const { width } = Dimensions.get('window');

export default function GamesScreen({ onBack }) {
  const [coins, setCoins] = useState(1250);
  const [dailyProgress, setDailyProgress] = useState(1); // 1 out of 2
  const [activeGameModal, setActiveGameModal] = useState(null);

  // Word Match mini-game state
  const wordPairs = [
    { uz: 'Kitob', en: 'Book' },
    { uz: 'Qalam', en: 'Pen' },
    { uz: 'Maktab', en: 'School' },
  ];

  const handlePlayGame = (gameTitle, coinReward) => {
    if (gameTitle === 'Word Match') {
      setActiveGameModal('word_match');
    } else {
      Alert.alert(
        `${gameTitle} boshlandi!`,
        `O'yinni muvaffaqiyatli yakunladingiz va +${coinReward} coin qo'lga kiritdingiz! 🎉`,
        [
          {
            text: "Ajoyib!",
            onPress: () => {
              setCoins(prev => prev + coinReward);
              if (dailyProgress < 2) {
                setDailyProgress(prev => prev + 1);
              }
            }
          }
        ]
      );
    }
  };

  const handleWordMatchSuccess = () => {
    Alert.alert("Tabriklaymiz!", "Word Match o'yinida 5 coin qo'lga kiritdingiz! 🏆", [
      {
        text: "Davom etish",
        onPress: () => {
          setCoins(prev => prev + 5);
          if (dailyProgress < 2) setDailyProgress(prev => prev + 1);
          setActiveGameModal(null);
        }
      }
    ]);
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} activeOpacity={0.7} onPress={onBack}>
          <Ionicons name="arrow-back" size={24} color="#1E293B" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Game</Text>
        <View style={styles.coinBadge}>
          <Ionicons name="cash" size={18} color="#F59E0B" />
          <Text style={styles.coinText}>{coins.toLocaleString()}</Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* Banner Card */}
        <View style={styles.bannerCard}>
          <View style={styles.bannerTextContent}>
            <Text style={styles.bannerTitle}>O'ynang va coin yuting!</Text>
            <Text style={styles.bannerSubtitle}>Qancha ko'p o'ynasangiz,{'\n'}shuncha ko'p yutasiz!</Text>
          </View>
          
          {/* Hero Gamepad Illustration Graphic */}
          <View style={styles.gamepadWrapper}>
            <View style={styles.coinBubble1}>
              <Ionicons name="cash" size={16} color="#F59E0B" />
            </View>
            <View style={styles.coinBubble2}>
              <Ionicons name="cash" size={12} color="#F59E0B" />
            </View>
            <View style={styles.gamepadBox}>
              <Ionicons name="game-controller" size={54} color="#DDD6FE" />
            </View>
          </View>
        </View>

        {/* Section: Kunlik vazifa */}
        <Text style={styles.sectionTitle}>Kunlik vazifa</Text>
        <View style={styles.taskCard}>
          <View style={styles.taskHeader}>
            <Text style={styles.taskTitle}>Bugun 2 ta o'yin o'ynang</Text>
            <View style={styles.taskRewardBox}>
              <Text style={styles.taskRewardText}>+10</Text>
              <Ionicons name="cash" size={16} color="#F59E0B" style={{ marginLeft: 4 }} />
            </View>
          </View>
          <View style={styles.taskProgressRow}>
            <View style={styles.taskProgressBarBg}>
              <View style={[styles.taskProgressBarFill, { width: `${(dailyProgress / 2) * 100}%` }]} />
            </View>
            <Text style={styles.taskFraction}>{dailyProgress}/2</Text>
          </View>
        </View>

        {/* Section: O'yinlar */}
        <Text style={styles.sectionTitle}>O'yinlar</Text>
        <View style={styles.gamesListContainer}>
          
          {/* Game 1: Word Match */}
          <View style={styles.gameItem}>
            <View style={[styles.gameIconBox, { backgroundColor: '#F3E8FF' }]}>
              <Ionicons name="grid" size={24} color="#7C3AED" />
            </View>
            <View style={styles.gameInfo}>
              <Text style={styles.gameTitle}>Word Match</Text>
              <Text style={styles.gameSubtitle}>So'zlarni to'g'ri toping</Text>
            </View>
            <Text style={styles.gameCoinText}>+5</Text>
            <TouchableOpacity 
              style={styles.playButton} 
              activeOpacity={0.8} 
              onPress={() => handlePlayGame('Word Match', 5)}
            >
              <Text style={styles.playButtonText}>O'ynash</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.itemDivider} />

          {/* Game 2: Quiz Battle */}
          <View style={styles.gameItem}>
            <View style={[styles.gameIconBox, { backgroundColor: '#FEF3C7' }]}>
              <Ionicons name="bulb" size={24} color="#D97706" />
            </View>
            <View style={styles.gameInfo}>
              <Text style={styles.gameTitle}>Quiz Battle</Text>
              <Text style={styles.gameSubtitle}>Savollarga javob bering</Text>
            </View>
            <Text style={styles.gameCoinText}>+5</Text>
            <TouchableOpacity 
              style={styles.playButton} 
              activeOpacity={0.8} 
              onPress={() => handlePlayGame('Quiz Battle', 5)}
            >
              <Text style={styles.playButtonText}>O'ynash</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.itemDivider} />

          {/* Game 3: Memory Card */}
          <View style={styles.gameItem}>
            <View style={[styles.gameIconBox, { backgroundColor: '#E0E7FF' }]}>
              <Ionicons name="albums" size={24} color="#4F46E5" />
            </View>
            <View style={styles.gameInfo}>
              <Text style={styles.gameTitle}>Memory Card</Text>
              <Text style={styles.gameSubtitle}>Xotirangizni sinang</Text>
            </View>
            <Text style={styles.gameCoinText}>+3</Text>
            <TouchableOpacity 
              style={styles.playButton} 
              activeOpacity={0.8} 
              onPress={() => handlePlayGame('Memory Card', 3)}
            >
              <Text style={styles.playButtonText}>O'ynash</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.itemDivider} />

          {/* Game 4: Speed Typing */}
          <View style={styles.gameItem}>
            <View style={[styles.gameIconBox, { backgroundColor: '#FEE2E2' }]}>
              <Ionicons name="keypad" size={24} color="#EF4444" />
            </View>
            <View style={styles.gameInfo}>
              <Text style={styles.gameTitle}>Speed Typing</Text>
              <Text style={styles.gameSubtitle}>Tez yozing, coin yuting</Text>
            </View>
            <Text style={styles.gameCoinText}>+5</Text>
            <TouchableOpacity 
              style={styles.playButton} 
              activeOpacity={0.8} 
              onPress={() => handlePlayGame('Speed Typing', 5)}
            >
              <Text style={styles.playButtonText}>O'ynash</Text>
            </TouchableOpacity>
          </View>

        </View>

        <View style={{ height: 110 }} />
      </ScrollView>

      {/* Mini-game Modal */}
      <Modal visible={activeGameModal === 'word_match'} transparent={true} animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Word Match Game 🎮</Text>
              <TouchableOpacity onPress={() => setActiveGameModal(null)}>
                <Ionicons name="close" size={24} color="#1E293B" />
              </TouchableOpacity>
            </View>

            <Text style={styles.modalSubtext}>Inglizcha so'zga mos keladigan o'zbekcha tarjimasini tanlang:</Text>
            
            <View style={styles.targetWordBox}>
              <Text style={styles.targetWordText}>"Book"</Text>
            </View>

            {wordPairs.map((pair, idx) => (
              <TouchableOpacity 
                key={idx} 
                style={styles.optionButton}
                activeOpacity={0.8}
                onPress={() => {
                  if (pair.en === 'Book') {
                    handleWordMatchSuccess();
                  } else {
                    Alert.alert("Noto'g'ri!", "Qayta urinib ko'ring.");
                  }
                }}
              >
                <Text style={styles.optionText}>{pair.uz}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA', // Light theme background
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 15,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  backButton: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  coinBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF8E1',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#FEF08A',
  },
  coinText: {
    color: '#333333',
    fontWeight: 'bold',
    fontSize: 14,
    marginLeft: 6,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 15,
  },
  bannerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#7C3AED', // Premium vibrant purple card
    borderRadius: 24,
    padding: 22,
    marginBottom: 25,
    shadowColor: '#7C3AED',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
    overflow: 'hidden',
  },
  bannerTextContent: {
    flex: 1,
    paddingRight: 10,
  },
  bannerTitle: {
    fontSize: 19,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  bannerSubtitle: {
    fontSize: 13,
    color: '#E9D5FF',
    lineHeight: 18,
  },
  gamepadWrapper: {
    position: 'relative',
    width: 90,
    height: 90,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gamepadBox: {
    width: 76,
    height: 76,
    borderRadius: 22,
    backgroundColor: '#5B21B6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  coinBubble1: {
    position: 'absolute',
    top: -4,
    right: 2,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#6D28D9',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  coinBubble2: {
    position: 'absolute',
    bottom: 2,
    left: -2,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#6D28D9',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 12,
  },
  taskCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
    marginBottom: 25,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 5,
    elevation: 2,
  },
  taskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  taskTitle: {
    fontSize: 15,
    color: '#1E293B',
    fontWeight: '500',
  },
  taskRewardBox: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  taskRewardText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#D97706',
  },
  taskProgressRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  taskProgressBarBg: {
    flex: 1,
    height: 8,
    backgroundColor: '#E2E8F0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  taskProgressBarFill: {
    height: '100%',
    backgroundColor: '#F59E0B',
    borderRadius: 4,
  },
  taskFraction: {
    color: '#64748B',
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 12,
  },
  gamesListContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 5,
    elevation: 2,
  },
  gameItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
  },
  itemDivider: {
    height: 1,
    backgroundColor: '#F1F5F9',
  },
  gameIconBox: {
    width: 48,
    height: 48,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  gameInfo: {
    flex: 1,
  },
  gameTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 3,
  },
  gameSubtitle: {
    fontSize: 12,
    color: '#64748B',
  },
  gameCoinText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#D97706',
    marginRight: 12,
  },
  playButton: {
    backgroundColor: '#7C3AED',
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 14,
  },
  playButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  modalContent: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  modalSubtext: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 20,
  },
  targetWordBox: {
    backgroundColor: '#F8FAFC',
    paddingVertical: 15,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  targetWordText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#7C3AED',
  },
  optionButton: {
    backgroundColor: '#F1F5F9',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    marginBottom: 10,
  },
  optionText: {
    fontSize: 16,
    color: '#1E293B',
    fontWeight: '600',
  },
});
