import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Dimensions, Platform, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ModuleLessonsScreen from './ModuleLessonsScreen';

const { width } = Dimensions.get('window');

export default function CourseModulesScreen({ course, courseId, courseTitle = 'Kurs Modullari', onBack }) {
  const insets = useSafeAreaInsets();
  const [selectedModule, setSelectedModule] = useState(null);
  const [modules, setModules] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const activeTitle = courseTitle || course?.title || course?.name || 'Kurs Modullari';
  const activeCourseId = courseId || course?.id || course?.course_id;

  const fetchModules = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (activeCourseId) params.append('course_id', activeCourseId);
      if (activeTitle) params.append('course_title', activeTitle);

      const res = await fetch(`http://192.168.0.107:8000/api/course-modules/?${params.toString()}`);
      const data = await res.json();
      if (data.success && Array.isArray(data.modules)) {
        setModules(data.modules.map(m => ({
          id: m.id,
          title: m.title,
          videos: m.lessons_count || m.actual_lessons_count || 0,
          tests: m.tests_count || m.actual_tests_count || 0,
          hours: m.duration || '0 soat',
          order_index: m.order_index
        })));
      }
    } catch (err) {
      console.log('Error fetching modules:', err);
    } finally {
      setIsLoading(false);
    }
  }, [activeCourseId, activeTitle]);

  useEffect(() => {
    fetchModules();
  }, [fetchModules]);

  if (selectedModule) {
    return (
      <ModuleLessonsScreen 
        course={course}
        courseId={activeCourseId}
        module={selectedModule}
        moduleId={selectedModule.id}
        moduleTitle={selectedModule.title} 
        onBack={() => setSelectedModule(null)} 
      />
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top > 0 ? insets.top + 8 : (Platform.OS === 'ios' ? 50 : 35) }]}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn} activeOpacity={0.7}>
          <Ionicons name="chevron-back" size={24} color="#1F2937" />
        </TouchableOpacity>

        <View style={styles.headerRight}>
          {/* Coin Badge */}
          <View style={styles.coinBadge}>
            <Ionicons name="cash" size={16} color="#FDB100" />
            <Text style={styles.coinText}>1 250</Text>
          </View>
          
          <TouchableOpacity style={{ marginLeft: 12 }} activeOpacity={0.7}>
            <Ionicons name="ellipsis-vertical" size={20} color="#333" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* Title */}
        <Text style={styles.sectionTitle}>{activeTitle}</Text>

        {/* Modules List */}
        <View style={styles.modulesList}>
          {isLoading ? (
            <View style={{ paddingVertical: 40, alignItems: 'center' }}>
              <ActivityIndicator size="large" color="#7c3aed" />
            </View>
          ) : modules.length > 0 ? (
            modules.map((item) => (
              <TouchableOpacity 
                key={item.id} 
                style={styles.moduleCard}
                activeOpacity={0.8}
                onPress={() => setSelectedModule(item)}
              >
                <View style={styles.moduleContent}>
                  <Text style={styles.moduleTitle}>{item.title}</Text>
                  
                  {/* Meta Row */}
                  <View style={styles.metaRow}>
                    <View style={styles.metaItem}>
                      <Ionicons name="play-outline" size={14} color="#666" />
                      <Text style={styles.metaText}>{item.videos}</Text>
                    </View>

                    <View style={styles.metaItem}>
                      <Ionicons name="help-circle-outline" size={14} color="#666" />
                      <Text style={styles.metaText}>{item.tests}</Text>
                    </View>

                    <View style={styles.metaItem}>
                      <Ionicons name="time-outline" size={14} color="#666" />
                      <Text style={styles.metaText}>{item.hours}</Text>
                    </View>
                  </View>
                </View>

                {/* Right Medal Badge */}
                <View style={styles.medalBadgeBg}>
                  <Ionicons name="ribbon-outline" size={24} color="#CBD5E1" />
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <View style={{ paddingVertical: 40, alignItems: 'center', paddingHorizontal: 20 }}>
              <Ionicons name="layers-outline" size={48} color="#C4B5FD" />
              <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#34115C', marginTop: 12, textAlign: 'center' }}>
                Hozircha modullar qo'shilmagan
              </Text>
              <Text style={{ fontSize: 13, color: '#6B7280', marginTop: 6, textAlign: 'center', lineHeight: 18 }}>
                Admin panelning Kurs ichki bo'limi orqali yangi modullar yaratilganda shu yerda ko'rinadi.
              </Text>
            </View>
          )}
        </View>

        {/* Certificate Locked Card */}
        <View style={styles.certCard}>
          {/* Top Lock Badge */}
          <View style={styles.certLockWrapper}>
            <View style={styles.certLockCircle}>
              <Ionicons name="lock-closed" size={24} color="#F59E0B" />
            </View>
          </View>

          {/* Certificate Title */}
          <Text style={styles.certTitle}>Kurs sertifikatini oling</Text>

          {/* Signatures & Logo & QR Code Row */}
          <View style={styles.certBottomRow}>
            {/* Signatures */}
            <View style={styles.signaturesBox}>
              <Ionicons name="pencil" size={16} color="#A3AED0" style={{ transform: [{ rotate: '-15deg' }] }} />
              <View style={styles.sigLine} />
            </View>

            {/* Punyo Logo */}
            <View style={styles.punyoLogoBox}>
              <Ionicons name="triangle" size={18} color="#FF6B00" style={{ transform: [{ rotate: '180deg' }] }} />
            </View>

            {/* QR Code */}
            <View style={styles.qrBox}>
              <Ionicons name="qr-code" size={32} color="#333" />
            </View>
          </View>
        </View>

        {/* Certificate Bottom Subtitle */}
        <View style={styles.certDescBox}>
          <Text style={styles.certDescTitle}>Siz to'g'ri yo'ldasiz!</Text>
          <Text style={styles.certDescText}>
            Davom eting va shaxsiylashtirilgan sertifikatni qo'lga kiriting.
          </Text>
        </View>

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
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 15,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  backBtn: {
    padding: 4,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  coinBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFBEB',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  coinText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#D97706',
    marginLeft: 5,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 16,
  },
  modulesList: {
    marginBottom: 24,
  },
  moduleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 18,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 2,
  },
  moduleContent: {
    flex: 1,
  },
  moduleTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 10,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  metaText: {
    fontSize: 13,
    color: '#6B7280',
    marginLeft: 5,
  },
  medalBadgeBg: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  certCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E2E8F0',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 2,
  },
  certLockWrapper: {
    alignItems: 'center',
    marginBottom: 14,
  },
  certLockCircle: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#FEF3C7',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FDE68A',
  },
  certTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 24,
  },
  certBottomRow: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 10,
  },
  signaturesBox: {
    width: 60,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sigLine: {
    width: 40,
    height: 2,
    backgroundColor: '#CBD5E1',
    marginTop: 4,
    borderRadius: 1,
  },
  punyoLogoBox: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFF3E0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  qrBox: {
    padding: 2,
  },
  certDescBox: {
    marginTop: 4,
  },
  certDescTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  certDescText: {
    fontSize: 13,
    color: '#6B7280',
    lineHeight: 19,
  },
});
