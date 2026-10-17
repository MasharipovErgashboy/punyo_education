import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Image, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';

const { width } = Dimensions.get('window');

export default function LessonDetailScreen({ lessonTitle = 'Dars 1 IELTS Introduction', onBack, onNext }) {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      {/* Top Video Player */}
      <View style={styles.videoPlayerContainer}>
        {/* Video Background Mockup */}
        <Image 
          source={{ uri: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=80' }} 
          style={styles.videoBg} 
          resizeMode="cover"
        />

        {/* Top Overlay Gradient Bar */}
        <View style={styles.videoHeaderOverlay}>
          <TouchableOpacity onPress={onBack} style={styles.backBtn} activeOpacity={0.7}>
            <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>

          <View style={styles.videoBrandInfo}>
            <View style={styles.brandLogoBox}>
              <Ionicons name="triangle" size={14} color="#FFF" style={{ transform: [{ rotate: '180deg' }] }} />
            </View>
            <View style={{ marginLeft: 8 }}>
              <Text style={styles.videoTitleText} numberOfLines={1}>IELTS Introduction |</Text>
              <Text style={styles.videoSubtitleText}>IBRAT FARZANDLARI</Text>
            </View>
          </View>

          <View style={styles.videoHeaderRightIcons}>
            <TouchableOpacity style={styles.headerIconBtn}>
              <Ionicons name="volume-high-outline" size={20} color="#FFF" />
            </TouchableOpacity>
            <View style={styles.ccBadge}>
              <Text style={styles.ccText}>CC</Text>
            </View>
            <TouchableOpacity style={styles.headerIconBtn}>
              <Ionicons name="settings-outline" size={20} color="#FFF" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Center Play Button Overlay */}
        <View style={styles.playCenterOverlay}>
          <TouchableOpacity 
            style={styles.playCircleBtn} 
            activeOpacity={0.8}
            onPress={() => setIsPlaying(!isPlaying)}
          >
            <Ionicons name={isPlaying ? "pause" : "play"} size={36} color="#FFFFFF" style={{ marginLeft: isPlaying ? 0 : 4 }} />
          </TouchableOpacity>
        </View>

        {/* Bottom Overlay Controls Bar */}
        <View style={styles.videoBottomControls}>
          {/* Time badge */}
          <View style={styles.timeBadge}>
            <Text style={styles.timeBadgeText}>0:00 / 18:06</Text>
          </View>

          {/* Fullscreen Button */}
          <TouchableOpacity style={styles.fullscreenBtn}>
            <Ionicons name="expand-outline" size={18} color="#FFF" />
          </TouchableOpacity>
        </View>

        {/* Progress Bar Line */}
        <View style={styles.progressLineBg}>
          <View style={styles.progressLineFill} />
          <View style={styles.progressDot} />
        </View>

        {/* Bottom Floating Bar */}
        <View style={styles.videoFloatingRow}>
          <TouchableOpacity style={styles.floatCircleBtn}>
            <Ionicons name="link-outline" size={16} color="#FFF" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.floatPillBtn}>
            <Text style={styles.floatPillText}>Boshqa videolar</Text>
            <View style={styles.floatThumbBox}>
              <Ionicons name="play-circle" size={18} color="#FFF" />
            </View>
          </TouchableOpacity>

          <View style={{ flex: 1 }} />

          <View style={styles.youtubeTag}>
            <Ionicons name="logo-youtube" size={16} color="#FF0000" />
            <Text style={styles.youtubeText}>YouTube</Text>
          </View>
        </View>
      </View>

      {/* Middle Scrollable Documentation Section */}
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.docScrollContent}>
        {/* Title Row */}
        <View style={styles.titleRow}>
          <Text style={styles.docTitle}>{lessonTitle}</Text>
          <View style={styles.docIconBadge}>
            <Ionicons name="document-text" size={20} color="#7c3aed" />
          </View>
        </View>

        {/* Documentation Paragraphs */}
        <View style={styles.docBody}>
          <Text style={styles.headingText}>IELTS – The International English Language Testing System</Text>
          
          <Text style={styles.paragraphText}>IELTS – Xalqaro Ingliz tili test tizimi</Text>
          
          <Text style={styles.paragraphText}>
            Eng birinchi IELTS imtihoniga 1989-yilda topshirilgan.
          </Text>
          
          <Text style={styles.paragraphText}>
            IDP va British Council IELTS imtihonlarini tashkil etishadi. Test materiallari Cambridge English Language Assessment tomonidan taqdim etiladi va tekshiriladi.
          </Text>
          
          <Text style={styles.headingText}>IELTS imtihonida 2 ta modul bor:</Text>

          <View style={styles.bulletList}>
            <View style={styles.bulletItem}>
              <View style={styles.bulletDot} />
              <Text style={styles.bulletText}><Text style={styles.boldText}>Academic</Text> – Oliy o'quv yurtlarida ta'lim olish va professional faoliyat uchun.</Text>
            </View>
            <View style={styles.bulletItem}>
              <View style={styles.bulletDot} />
              <Text style={styles.bulletText}><Text style={styles.boldText}>General Training</Text> – Ishlash va migratsiya maqsadlarida foydalanish uchun.</Text>
            </View>
          </View>

          <Text style={styles.paragraphText}>
            Ushbu darsda IELTS bo'limlarining tuzilishi, baholash mezonlari va tayyorgarlik ko'rishning eng samarali usullari haqida batafsil ma'lumot beriladi.
          </Text>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Bottom Fixed Action Bar */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.menuBtn} activeOpacity={0.7} onPress={onBack}>
          <Ionicons name="menu" size={22} color="#4B5563" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.nextBtn} activeOpacity={0.8} onPress={onNext || onBack}>
          <Text style={styles.nextBtnText}>Keyingi</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingTop: 0,
  },
  videoPlayerContainer: {
    width: '100%',
    height: 250,
    backgroundColor: '#000000',
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoBg: {
    width: '100%',
    height: '100%',
    opacity: 0.85,
  },
  videoHeaderOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingTop: 12,
    paddingHorizontal: 15,
    paddingBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
  },
  backBtn: {
    padding: 4,
    marginRight: 8,
  },
  videoBrandInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  brandLogoBox: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#FF6B00',
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoTitleText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  videoSubtitleText: {
    fontSize: 10,
    color: '#D1D5DB',
    fontWeight: '500',
  },
  videoHeaderRightIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerIconBtn: {
    padding: 4,
    marginLeft: 8,
  },
  ccBadge: {
    borderWidth: 1,
    borderColor: '#FFF',
    borderRadius: 4,
    paddingHorizontal: 4,
    paddingVertical: 1,
    marginLeft: 8,
  },
  ccText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  playCenterOverlay: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  playCircleBtn: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.6)',
  },
  videoBottomControls: {
    position: 'absolute',
    bottom: 38,
    left: 15,
    right: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timeBadge: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  timeBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '600',
  },
  fullscreenBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressLineBg: {
    position: 'absolute',
    bottom: 30,
    left: 15,
    right: 15,
    height: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 1.5,
    justifyContent: 'center',
  },
  progressLineFill: {
    width: '10%',
    height: '100%',
    backgroundColor: '#FF0000',
    borderRadius: 1.5,
  },
  progressDot: {
    position: 'absolute',
    left: '10%',
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#FF0000',
    marginTop: -3.5,
  },
  videoFloatingRow: {
    position: 'absolute',
    bottom: 4,
    left: 15,
    right: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  floatCircleBtn: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  floatPillBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  floatPillText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: '500',
    marginRight: 4,
  },
  floatThumbBox: {
    width: 14,
    height: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  youtubeTag: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  youtubeText: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: 'bold',
    marginLeft: 3,
  },
  docScrollContent: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 20,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  docTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    flex: 1,
  },
  docIconBadge: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#F5E6FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
  docBody: {
    marginTop: 4,
  },
  headingText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 16,
    lineHeight: 24,
  },
  paragraphText: {
    fontSize: 15,
    color: '#374151',
    lineHeight: 24,
    marginBottom: 16,
  },
  bulletList: {
    marginBottom: 16,
    paddingLeft: 4,
  },
  bulletItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  bulletDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#7c3aed',
    marginTop: 9,
    marginRight: 10,
  },
  bulletText: {
    fontSize: 15,
    color: '#374151',
    lineHeight: 24,
    flex: 1,
  },
  boldText: {
    fontWeight: 'bold',
    color: '#111827',
  },
  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 35,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  menuBtn: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  nextBtn: {
    flex: 1,
    backgroundColor: '#7c3aed',
    height: 48,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#7c3aed',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 3,
  },
  nextBtnText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});
