import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';

const { width } = Dimensions.get('window');

export default function AiHistoryScreen({ onBack, onSelectHistory }) {
  const historyData = [
    {
      title: "Bugun",
      items: [
        { id: 1, text: "Present Perfect haqida...", time: "14:30" },
        { id: 2, text: "Ingliz tilidagi eng ko'p ishlatiladigan 100 ta so'z", time: "11:15" },
      ]
    },
    {
      title: "Kecha",
      items: [
        { id: 3, text: "Matematikadan misol yechishga yordam bering", time: "18:45" },
        { id: 4, text: "Kompyuter tarmoqlari qanday ishlaydi?", time: "09:20" },
      ]
    },
    {
      title: "O'tgan hafta",
      items: [
        { id: 5, text: "Frontend dasturlashni nimadan boshlash kerak?", time: "16:10" },
        { id: 6, text: "IELTS ga tayyorlanish bo'yicha maslahatlar", time: "10:05" },
        { id: 7, text: "React Native vs Flutter", time: "14:22" },
      ]
    }
  ];

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.iconButton} activeOpacity={0.7}>
          <Ionicons name="arrow-back" size={24} color="#34115C" />
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>Suhbatlar tarixi</Text>
        
        <View style={{ width: 34 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {historyData.map((group, index) => (
          <View key={index} style={styles.groupContainer}>
            <Text style={styles.groupTitle}>{group.title}</Text>
            
            <View style={styles.groupItemsWrapper}>
              {group.items.map((item, itemIndex) => (
                <TouchableOpacity 
                  key={item.id} 
                  style={[
                    styles.historyItem, 
                    itemIndex === group.items.length - 1 && styles.lastHistoryItem
                  ]} 
                  activeOpacity={0.7}
                  onPress={() => onSelectHistory && onSelectHistory(item.text)}
                >
                  <View style={styles.itemIconBox}>
                    <Ionicons name="chatbubble-ellipses-outline" size={20} color="#7c3aed" />
                  </View>
                  <View style={styles.itemContent}>
                    <Text style={styles.itemText} numberOfLines={1}>{item.text}</Text>
                    <Text style={styles.itemTime}>{item.time}</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color="#CCC" />
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}

        <View style={{ height: 40 }} />
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
    justifyContent: 'space-between',
    alignItems: 'center',
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
    color: '#34115C',
  },
  scrollContent: {
    paddingTop: 20,
    paddingHorizontal: 15,
    paddingBottom: 100, // Important: Accommodate for bottom navigation
  },
  groupContainer: {
    marginBottom: 25,
  },
  groupTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#888',
    marginBottom: 10,
    marginLeft: 5,
    textTransform: 'uppercase',
  },
  groupItemsWrapper: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 5,
    elevation: 2,
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  lastHistoryItem: {
    borderBottomWidth: 0,
  },
  itemIconBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F5E6FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  itemContent: {
    flex: 1,
    marginRight: 10,
  },
  itemText: {
    fontSize: 15,
    color: '#333',
    fontWeight: '500',
    marginBottom: 4,
  },
  itemTime: {
    fontSize: 12,
    color: '#999',
  },
});
