import React from 'react';
import { StyleSheet, Text, View, Image, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';

const { width } = Dimensions.get('window');

export default function TestIntroScreen({ test, onBack, onStart }) {
  // Demo test data
  const testInfo = {
    title: test?.title || "English A1 - Test",
    duration: "60 daqiqa",
    questions: "40 ta savol",
    passScore: "80%",
    description: "Ushbu Mock Test sizning bilim darajangizni haqiqiy imtihon sharoitida sinab ko'rish uchun mo'ljallangan. Test davomida vaqt cheklangan, shuning uchun diqqat bilan ishlashingiz tavsiya etiladi. Barcha savollar tasodifiy tartibda beriladi va faqat bitta to'g'ri javob mavjud.",
    rules: [
      "Test vaqti tugagach, avtomatik tarzda yakunlanadi.",
      "Javob berilmagan savollar xato deb hisoblanadi.",
      "Qayta urinish uchun 24 soat kutishingiz kerak bo'ladi."
    ]
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton} activeOpacity={0.7}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Test haqida</Text>
        <View style={{ width: 34 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* Top Banner Icon */}
        <View style={styles.iconContainer}>
          <View style={styles.iconCircle}>
            <Ionicons name="timer-outline" size={60} color="#7c3aed" />
          </View>
        </View>

        {/* Title */}
        <Text style={styles.testTitle}>{testInfo.title}</Text>
        <View style={styles.badgeRow}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>Mock Test</Text>
          </View>
        </View>

        {/* Info Cards */}
        <View style={styles.infoCardsRow}>
          <View style={styles.infoCard}>
            <Ionicons name="time" size={24} color="#FDB100" />
            <Text style={styles.infoCardTitle}>Vaqt</Text>
            <Text style={styles.infoCardValue}>{testInfo.duration}</Text>
          </View>
          
          <View style={styles.infoCard}>
            <Ionicons name="help-circle" size={24} color="#2196F3" />
            <Text style={styles.infoCardTitle}>Savollar</Text>
            <Text style={styles.infoCardValue}>{testInfo.questions}</Text>
          </View>
          
          <View style={styles.infoCard}>
            <Ionicons name="ribbon" size={24} color="#4CAF50" />
            <Text style={styles.infoCardTitle}>O'tish bali</Text>
            <Text style={styles.infoCardValue}>{testInfo.passScore}</Text>
          </View>
        </View>

        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tushuntirish</Text>
          <Text style={styles.descriptionText}>{testInfo.description}</Text>
        </View>

        {/* Rules */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Qoidalar</Text>
          {testInfo.rules.map((rule, index) => (
            <View key={index} style={styles.ruleItem}>
              <View style={styles.ruleBullet} />
              <Text style={styles.ruleText}>{rule}</Text>
            </View>
          ))}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Start Button Fixed at Bottom */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.startButton} activeOpacity={0.8} onPress={onStart}>
          <Text style={styles.startButtonText}>Testni boshlash</Text>
          <Ionicons name="arrow-forward" size={20} color="#FFF" style={{ marginLeft: 8 }} />
        </TouchableOpacity>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
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
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  iconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#F5E6FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  testTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 10,
  },
  badgeRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 25,
  },
  badge: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeText: {
    color: '#4CAF50',
    fontWeight: 'bold',
    fontSize: 12,
  },
  infoCardsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 25,
  },
  infoCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderRadius: 16,
    alignItems: 'center',
    marginHorizontal: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  infoCardTitle: {
    fontSize: 12,
    color: '#888',
    marginTop: 8,
    marginBottom: 4,
  },
  infoCardValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 5,
    elevation: 1,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  descriptionText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 22,
  },
  ruleItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  ruleBullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#7c3aed',
    marginTop: 7,
    marginRight: 10,
  },
  ruleText: {
    flex: 1,
    fontSize: 14,
    color: '#555',
    lineHeight: 20,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 35,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  startButton: {
    flexDirection: 'row',
    backgroundColor: '#7c3aed',
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#7c3aed',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  startButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
