import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, Image, ScrollView, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, Keyboard } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import AiHistoryScreen from './AiHistoryScreen';

export default function AiChatScreen() {
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState('Present Perfect tense nima va qanday ishlatiladi?');
  const scrollViewRef = useRef(null);

  useEffect(() => {
    const keyboardWillShowListener = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      () => setKeyboardVisible(true)
    );
    const keyboardWillHideListener = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      () => setKeyboardVisible(false)
    );

    return () => {
      keyboardWillShowListener.remove();
      keyboardWillHideListener.remove();
    };
  }, []);

  if (showHistory) {
    return (
      <AiHistoryScreen 
        onBack={() => setShowHistory(false)} 
        onSelectHistory={(topic) => {
          setSelectedTopic(topic);
          setShowHistory(false);
          // Simulate scroll to chat after rendering
          setTimeout(() => {
            scrollViewRef.current?.scrollToEnd({ animated: true });
          }, 300);
        }} 
      />
    );
  }

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <StatusBar style="dark" />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={{ width: 34 }} />
        
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>AI Yordamchi</Text>
          <View style={styles.statusRow}>
            <View style={styles.onlineDot} />
            <Text style={styles.statusText}>AI Online</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.iconButton} activeOpacity={0.7} onPress={() => setShowHistory(true)}>
          <Ionicons name="time-outline" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      <ScrollView 
        ref={scrollViewRef}
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={styles.scrollContent}
      >
        
        {/* Hero Banner */}
        <View style={styles.heroBanner}>
          <View style={styles.heroTextContent}>
            <Text style={styles.heroGreeting}>Salom! 👋</Text>
            <Text style={styles.heroQuestion}>Men sizga qanday yordam bera olaman?</Text>
            <Text style={styles.heroDesc}>
              Savol bering, tushunmagan mavzuni so'rang yoki misol kerak bo'lsa ayting.
            </Text>
          </View>
          <Image source={require('./assets/ai_robot.png')} style={styles.heroImage} resizeMode="contain" />
        </View>

        {/* Quick Actions (Chips) */}
        <View style={styles.chipsContainer}>
          <TouchableOpacity style={styles.chipButton}>
            <Ionicons name="book-outline" size={16} color="#4CAF50" />
            <Text style={styles.chipText}>Grammatika</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.chipButton}>
            <Ionicons name="text-outline" size={16} color="#2196F3" />
            <Text style={styles.chipText}>So'z ma'nosi</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.chipButton}>
            <Ionicons name="language-outline" size={16} color="#FF9800" />
            <Text style={styles.chipText}>Tarjima</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.chipButton}>
            <Ionicons name="bulb-outline" size={16} color="#2196F3" />
            <Text style={styles.chipText}>Misol kerak</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.chipButton}>
            <Ionicons name="chatbubbles-outline" size={16} color="#E53935" />
            <Text style={styles.chipText}>Tushuntirish</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.chipButton}>
            <Ionicons name="school-outline" size={16} color="#4CAF50" />
            <Text style={styles.chipText}>Test yechish</Text>
          </TouchableOpacity>
        </View>

        {/* Chat Area */}
        <View style={styles.chatArea}>
          
          {/* User Message */}
          <View style={styles.userMessageRow}>
            <View style={styles.userBubble}>
              <Text style={styles.userMessageText}>
                {selectedTopic}
              </Text>
              <View style={styles.messageMetaRow}>
                <Text style={styles.messageTimeUser}>09:41</Text>
                <Ionicons name="checkmark-done" size={14} color="#A78BFA" />
              </View>
            </View>
          </View>

          {/* AI Message */}
          <View style={styles.aiMessageRow}>
            <View style={styles.aiAvatarBox}>
              <Ionicons name="hardware-chip" size={18} color="#FFF" />
            </View>
            <View style={styles.aiBubble}>
              <Text style={styles.aiMessageText}>
                Present Perfect – bu hozirgacha davom etayotgan yoki yaqinda tugagan harakatlar uchun ishlatiladi.
              </Text>
              <Text style={styles.aiMessageText}>Asosiy tuzilishi:</Text>
              
              <View style={styles.codeBlock}>
                <Text style={styles.codeText}>have/has + V3 (past participle)</Text>
              </View>

              <Text style={styles.aiMessageText}>Misollar:</Text>
              <View style={styles.bulletList}>
                <Text style={styles.bulletItem}>• I have finished my homework.</Text>
                <Text style={styles.bulletItem}>• She has visited Paris.</Text>
                <Text style={styles.bulletItem}>• They have lived here since 2020.</Text>
              </View>
              
              <Text style={styles.aiMessageText}>Bu zamon natija yoki tajribani bildiradi.</Text>
            </View>
          </View>

        </View>

        {/* Action Suggestions below AI message */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.suggestionsScroll} contentContainerStyle={{ paddingHorizontal: 15 }}>
          <TouchableOpacity style={styles.suggestionChip}>
            <Ionicons name="add-circle-outline" size={16} color="#555" />
            <Text style={styles.suggestionText}>Misol so'rang</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.suggestionChip}>
            <Ionicons name="school-outline" size={16} color="#555" />
            <Text style={styles.suggestionText}>Test yechish</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.suggestionChip}>
            <Ionicons name="language-outline" size={16} color="#4CAF50" />
            <Text style={styles.suggestionText}>Tarjima</Text>
          </TouchableOpacity>
        </ScrollView>

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Input Area */}
      <View style={[styles.inputArea, { paddingBottom: isKeyboardVisible ? (Platform.OS === 'ios' ? 25 : 12) : 95 }]}>
        <View style={styles.inputContainer}>
          <TextInput 
            style={styles.textInput} 
            placeholder="Savolingizni yozing..."
            placeholderTextColor="#999"
          />
          <TouchableOpacity style={styles.micButton}>
            <Ionicons name="mic-outline" size={24} color="#666" />
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.sendButton} activeOpacity={0.8}>
          <Ionicons name="send" size={20} color="#FFF" style={{ marginLeft: 2 }} />
        </TouchableOpacity>
      </View>

    </KeyboardAvoidingView>
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
  headerTitleContainer: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#34115C',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  onlineDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#4CAF50',
    marginRight: 4,
  },
  statusText: {
    fontSize: 11,
    color: '#4CAF50',
    fontWeight: '600',
  },
  scrollContent: {
    paddingBottom: 20,
  },
  heroBanner: {
    flexDirection: 'row',
    backgroundColor: '#F5E6FF', // Light purple
    margin: 15,
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#7c3aed',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  heroTextContent: {
    flex: 1,
    paddingRight: 10,
  },
  heroGreeting: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#34115C',
    marginBottom: 5,
  },
  heroQuestion: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#34115C',
    marginBottom: 10,
    lineHeight: 24,
  },
  heroDesc: {
    fontSize: 12,
    color: '#666',
    lineHeight: 18,
  },
  heroImage: {
    width: 90,
    height: 90,
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 15,
    marginBottom: 20,
  },
  chipButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 15,
    marginRight: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 3,
    elevation: 1,
  },
  chipText: {
    marginLeft: 6,
    fontSize: 13,
    color: '#444',
    fontWeight: '500',
  },
  chatArea: {
    paddingHorizontal: 15,
    marginBottom: 15,
  },
  userMessageRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 20,
  },
  userBubble: {
    backgroundColor: '#7c3aed', // Purple user bubble
    padding: 15,
    borderRadius: 20,
    borderBottomRightRadius: 5,
    maxWidth: '80%',
    shadowColor: '#7c3aed',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  userMessageText: {
    color: '#FFFFFF',
    fontSize: 14,
    lineHeight: 20,
  },
  messageMetaRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: 8,
  },
  messageTimeUser: {
    fontSize: 11,
    color: '#DDD',
    marginRight: 4,
  },
  aiMessageRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 15,
  },
  aiAvatarBox: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#34115C',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  aiBubble: {
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 20,
    borderBottomLeftRadius: 5,
    maxWidth: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  aiMessageText: {
    color: '#333',
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 8,
  },
  codeBlock: {
    backgroundColor: '#F5E6FF',
    padding: 10,
    borderRadius: 8,
    marginVertical: 10,
  },
  codeText: {
    color: '#7c3aed',
    fontSize: 14,
    fontWeight: '600',
  },
  bulletList: {
    marginBottom: 10,
  },
  bulletItem: {
    color: '#444',
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 4,
  },
  suggestionsScroll: {
    marginBottom: 20,
  },
  suggestionChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#EAEAEA',
  },
  suggestionText: {
    marginLeft: 6,
    fontSize: 13,
    color: '#555',
    fontWeight: '500',
  },
  inputArea: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  inputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 25,
    paddingHorizontal: 15,
    marginRight: 10,
    height: 50,
  },
  textInput: {
    flex: 1,
    fontSize: 15,
    color: '#333',
    height: '100%',
  },
  micButton: {
    padding: 5,
  },
  sendButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#7c3aed',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#7c3aed',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 4,
  },
});
