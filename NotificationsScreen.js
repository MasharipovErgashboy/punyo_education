import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Dimensions, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';

const { width } = Dimensions.get('window');

export default function NotificationsScreen({ onBack }) {
  const insets = useSafeAreaInsets();
  
  const notifications = [
    {
      id: 1,
      type: 'gift', // gift, coin, course
      title: "Sovg'a keldi!",
      message: "Sizning 'AirPods Pro 2' buyurtmangiz muvaffaqiyatli rasmiylashtirildi.",
      time: "2 daqiqa oldin",
      unread: true,
      icon: "gift",
      color: "#FF5722",
      bg: "#FFEFEA"
    },
    {
      id: 2,
      type: 'coin',
      title: "+50 Coin berildi",
      message: "Tabriklaymiz! 'Python Basics' darsini yakunlaganingiz uchun bonus.",
      time: "1 soat oldin",
      unread: true,
      icon: "logo-bitcoin",
      color: "#FDB100",
      bg: "#FFF8E1"
    },
    {
      id: 3,
      type: 'course',
      title: "Yangi kurs qo'shildi",
      message: "Dasturlash olamiga sayohat: 'React Native 0 dan' kursi endi mavjud.",
      time: "Kecha, 14:30",
      unread: false,
      icon: "book",
      color: "#4CAF50",
      bg: "#E8F5E9"
    },
    {
      id: 4,
      type: 'system',
      title: "Tizim xabari",
      message: "Ilova muvaffaqiyatli yangilandi (v1.2.0). Yangi funksiyalardan zavqlaning!",
      time: "2 kun oldin",
      unread: false,
      icon: "settings",
      color: "#7c3aed",
      bg: "#F5E6FF"
    },
  ];

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      
      {/* Header */}
      <View style={[
        styles.header,
        { paddingTop: insets.top > 0 ? insets.top + 8 : (Platform.OS === 'ios' ? 50 : 35) }
      ]}>
        <TouchableOpacity onPress={onBack} style={styles.iconButton} activeOpacity={0.7}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>Xabarnomalar</Text>
        
        <TouchableOpacity style={styles.iconButton} activeOpacity={0.7}>
          <Ionicons name="trash-outline" size={22} color="#E53935" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {notifications.map((notif) => (
          <TouchableOpacity 
            key={notif.id} 
            style={[styles.notificationCard, notif.unread && styles.notificationCardUnread]} 
            activeOpacity={0.8}
          >
            <View style={[styles.iconBox, { backgroundColor: notif.bg }]}>
              <Ionicons name={notif.icon} size={24} color={notif.color} />
            </View>
            
            <View style={styles.textContent}>
              <View style={styles.titleRow}>
                <Text style={[styles.title, notif.unread && styles.titleUnread]}>{notif.title}</Text>
                <Text style={styles.timeText}>{notif.time}</Text>
              </View>
              <Text style={styles.message} numberOfLines={2}>{notif.message}</Text>
            </View>
          </TouchableOpacity>
        ))}

        <View style={styles.footerLine}>
          <Text style={styles.footerText}>Barcha xabarnomalar o'qilgan</Text>
        </View>

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
    paddingHorizontal: 15,
    paddingTop: 15,
    paddingBottom: 15,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  iconButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  scrollContent: {
    paddingTop: 15,
    paddingBottom: 40,
    paddingHorizontal: 15,
  },
  notificationCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#F5F5F5',
  },
  notificationCardUnread: {
    backgroundColor: '#F9F5FF', // slight purple tint for unread
    borderColor: '#EFE5FD',
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  textContent: {
    flex: 1,
    justifyContent: 'center',
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
    color: '#444',
  },
  titleUnread: {
    color: '#333',
    fontWeight: 'bold',
  },
  timeText: {
    fontSize: 11,
    color: '#999',
  },
  message: {
    fontSize: 13,
    color: '#666',
    lineHeight: 18,
  },
  footerLine: {
    alignItems: 'center',
    marginTop: 20,
    paddingBottom: 20,
  },
  footerText: {
    fontSize: 12,
    color: '#AAA',
  },
});
