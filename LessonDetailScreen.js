import React, { useState, useMemo } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Dimensions, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import YoutubePlayer from 'react-native-youtube-iframe';

const { width } = Dimensions.get('window');

const getYouTubeId = (url) => {
  if (!url || typeof url !== 'string') return null;
  const trimmed = url.trim();
  const match = trimmed.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([\w-]{11})/i);
  if (match && match[1]) return match[1];
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) return trimmed;
  return null;
};

export default function LessonDetailScreen({ lesson, lessonTitle, duration, youtubeUrl, onBack, onNext }) {
  const insets = useSafeAreaInsets();
  const rawUrl = youtubeUrl || lesson?.youtube_url;
  const youtubeId = useMemo(() => getYouTubeId(rawUrl), [rawUrl]);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isVideoCompleted, setIsVideoCompleted] = useState(!!lesson?.isCompleted || !youtubeId);

  const activeTitle = lessonTitle || lesson?.title || 'Video Darslik';
  const activeDuration = duration || lesson?.duration || 'Davomiyligi ko\'rsatilmagan';
  const activeDescription = lesson?.description;

  const handleVideoStateChange = (state) => {
    if (state === 'ended') {
      setIsVideoCompleted(true);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      {/* Top Header Bar */}
      <View style={[styles.topHeaderBar, { paddingTop: insets.top > 0 ? insets.top + 8 : (Platform.OS === 'ios' ? 50 : 35) }]}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn} activeOpacity={0.7}>
          <Ionicons name="chevron-back" size={24} color="#0F172A" />
        </TouchableOpacity>
        <View style={{ flex: 1, marginHorizontal: 8 }}>
          <Text style={styles.topHeaderTitle} numberOfLines={1}>{activeTitle}</Text>
          <Text style={styles.topHeaderSub}>PUNYO EDUCATION</Text>
        </View>
        <View style={styles.durationBadge}>
          <Ionicons name="time-outline" size={13} color="#7C3AED" style={{ marginRight: 4 }} />
          <Text style={styles.durationBadgeText}>{activeDuration}</Text>
        </View>
      </View>

      {/* Real YouTube Video Player */}
      <View style={styles.videoPlayerContainer}>
        {youtubeId ? (
          <YoutubePlayer
            height={220}
            play={isPlaying}
            videoId={youtubeId}
            onChangeState={handleVideoStateChange}
          />
        ) : (
          <View style={styles.noVideoBox}>
            <Ionicons name="videocam-off-outline" size={40} color="#94A3B8" />
            <Text style={styles.noVideoText}>Video darslik havolasi biriktirilmagan</Text>
          </View>
        )}
      </View>

      {/* Completion Status Alert Notice */}
      {!isVideoCompleted ? (
        <View style={styles.watchNotice}>
          <Ionicons name="lock-closed" size={15} color="#D97706" style={{ marginRight: 8 }} />
          <Text style={styles.watchNoticeText}>
            Keyingi bosqichga o'tish uchun videoni oxirigacha ko'ring
          </Text>
        </View>
      ) : (
        <View style={styles.watchNoticeCompleted}>
          <Ionicons name="checkmark-circle" size={16} color="#16A34A" style={{ marginRight: 8 }} />
          <Text style={styles.watchNoticeCompletedText}>
            Video to'liq ko'rildi! Keyingi bosqich ochildi
          </Text>
        </View>
      )}

      {/* Middle Scrollable Documentation Section */}
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.docScrollContent}>
        {/* Title Row */}
        <View style={styles.titleRow}>
          <Text style={styles.docTitle}>{activeTitle}</Text>
          <View style={styles.docIconBadge}>
            <Ionicons name="document-text" size={20} color="#7c3aed" />
          </View>
        </View>

        {/* Real Documentation Paragraphs */}
        <View style={styles.docBody}>
          {activeDescription ? (
            <Text style={styles.paragraphText}>{activeDescription}</Text>
          ) : (
            <View style={styles.emptyDescBox}>
              <Ionicons name="information-circle-outline" size={26} color="#7C3AED" style={{ marginBottom: 6 }} />
              <Text style={styles.emptyDescText}>
                Ushbu video darslik materiallarini diqqat bilan o'rganing. Video yakunlangandan so'ng keyingi darslik yoki test ochiladi.
              </Text>
            </View>
          )}
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Bottom Fixed Action Bar */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.menuBtn} activeOpacity={0.7} onPress={onBack}>
          <Ionicons name="menu" size={22} color="#4B5563" />
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.nextBtn, !isVideoCompleted && styles.nextBtnDisabled]} 
          activeOpacity={0.8} 
          disabled={!isVideoCompleted}
          onPress={() => onNext && onNext(lesson)}
        >
          {!isVideoCompleted ? (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Ionicons name="lock-closed" size={16} color="#94A3B8" style={{ marginRight: 6 }} />
              <Text style={styles.nextBtnTextDisabled}>Keyingi (Qulflangan)</Text>
            </View>
          ) : (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={styles.nextBtnText}>Keyingi</Text>
              <Ionicons name="arrow-forward" size={16} color="#FFFFFF" style={{ marginLeft: 6 }} />
            </View>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  topHeaderBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  topHeaderTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
  },
  topHeaderSub: {
    fontSize: 10,
    fontWeight: '600',
    color: '#7C3AED',
    letterSpacing: 0.5,
  },
  durationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    backgroundColor: '#F5F3FF',
    borderWidth: 1,
    borderColor: '#EDE9FE',
  },
  durationBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#7C3AED',
  },
  videoPlayerContainer: {
    width: '100%',
    height: 220,
    backgroundColor: '#000000',
    justifyContent: 'center',
  },
  noVideoBox: {
    flex: 1,
    backgroundColor: '#0F172A',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  noVideoText: {
    color: '#94A3B8',
    fontSize: 13,
    fontWeight: '600',
    marginTop: 8,
    textAlign: 'center',
  },
  watchNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#FEF3C7',
    borderBottomWidth: 1,
    borderBottomColor: '#FDE68A',
  },
  watchNoticeText: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#B45309',
    flex: 1,
  },
  watchNoticeCompleted: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#DCFCE7',
    borderBottomWidth: 1,
    borderBottomColor: '#BBF7D0',
  },
  watchNoticeCompletedText: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#15803D',
    flex: 1,
  },
  emptyDescBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 16,
    alignItems: 'center',
    marginVertical: 12,
  },
  emptyDescText: {
    fontSize: 13.5,
    color: '#64748B',
    lineHeight: 20,
    textAlign: 'center',
  },
  nextBtnDisabled: {
    backgroundColor: '#E2E8F0',
    shadowOpacity: 0,
    elevation: 0,
  },
  nextBtnTextDisabled: {
    fontSize: 14,
    fontWeight: '700',
    color: '#94A3B8',
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
