import React, { useState } from 'react';
import { StyleSheet, Text, View, Image, ScrollView, TouchableOpacity, Switch, Dimensions, Modal, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import ShopScreen from './ShopScreen';
import CertificatesScreen from './CertificatesScreen';
import StatisticsScreen from './StatisticsScreen';
import GamesScreen from './GamesScreen';

const { width } = Dimensions.get('window');

export default function ProfileScreen({ userData, onNavigateToMyCourses, onNavigateToMyTests, onLogout, onOpenNotifications, onSubScreenToggle }) {
  const insets = useSafeAreaInsets();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showShop, setShowShop] = useState(false);
  const [showCertificates, setShowCertificates] = useState(false);
  const [showStatistics, setShowStatistics] = useState(false);
  const [showGames, setShowGames] = useState(false);
  const [showLangModal, setShowLangModal] = useState(false);
  const [selectedLang, setSelectedLang] = useState('uz'); // uz, ru, en

  // Extract user details
  const userName = userData?.name || userData?.first_name || "";
  const userEmail = userData?.email || userData?.phone || userData?.emailOrPhone || "Manzil yo'q";
  const userCoins = userData?.coins || 0;
  const userCourses = userData?.courses_count || 0;

  const renderMenuItem = (icon, title, isLanguage = false, onPress = null) => (
    <TouchableOpacity style={styles.menuItem} activeOpacity={0.7} onPress={onPress}>
      <View style={styles.menuItemLeft}>
        <Ionicons name={icon} size={22} color="#555" />
        <Text style={styles.menuItemTitle}>{title}</Text>
      </View>
      {isLanguage ? (
        <View style={styles.languageBox}>
          <Text style={styles.languageText}>
            {selectedLang === 'uz' ? "O'zbekcha" : selectedLang === 'ru' ? "Русский" : "English"}
          </Text>
          <Image 
            source={{
              uri: selectedLang === 'uz' 
                ? 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/84/Flag_of_Uzbekistan.svg/320px-Flag_of_Uzbekistan.svg.png'
                : selectedLang === 'ru'
                ? 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f3/Flag_of_Russia.svg/320px-Flag_of_Russia.svg.png'
                : 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Flag_of_the_United_Kingdom_%281-2%29.svg/320px-Flag_of_the_United_Kingdom_%281-2%29.svg.png'
            }} 
            style={styles.flagIcon} 
          />
        </View>
      ) : (
        <Ionicons name="chevron-forward" size={20} color="#CCC" />
      )}
    </TouchableOpacity>
  );

  if (showShop) {
    return <ShopScreen onBack={() => setShowShop(false)} />;
  }

  if (showGames) {
    return <GamesScreen onBack={() => setShowGames(false)} />;
  }

  if (showCertificates) {
    return <CertificatesScreen onBack={() => setShowCertificates(false)} />;
  }

  if (showStatistics) {
    return <StatisticsScreen onBack={() => setShowStatistics(false)} />;
  }

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      
      {/* Header */}
      <View style={[
        styles.header,
        Platform.OS === 'ios' && { paddingTop: insets.top > 0 ? insets.top + 8 : 50 }
      ]}>
        <Text style={styles.headerTitle}>Profil</Text>
        <View style={styles.headerIcons}>
          <TouchableOpacity style={styles.iconButton} onPress={onOpenNotifications}>
            <Ionicons name="notifications-outline" size={24} color="#333" />
            <View style={styles.notificationDot} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* User Info Section */}
        <View style={styles.userInfoContainer}>
          <View style={[styles.avatar, { backgroundColor: '#E0E7FF', justifyContent: 'center', alignItems: 'center' }]}>
            <Text style={{ fontSize: 32, fontWeight: 'bold', color: '#7c3aed' }}>{userName.charAt(0).toUpperCase()}</Text>
          </View>
          <View style={styles.userInfoText}>
            <View style={styles.nameRow}>
              <Text style={styles.userName}>{userName}</Text>
            </View>
            <Text style={styles.userEmail}>{userEmail}</Text>
            
            {/* Level & XP */}
            <View style={styles.levelRow}>
              <Text style={styles.levelText}>Level 1</Text>
              <View style={styles.progressBarBg}>
                <View style={[styles.progressBarFill, { width: '10%' }]} />
              </View>
              <Text style={styles.xpText}>100 / 1000 XP</Text>
            </View>
          </View>
        </View>

        {/* Stats Section */}
        <View style={styles.statsContainer}>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Jami coin</Text>
            <View style={styles.coinRow}>
              <Text style={styles.statValue}>{userCoins}</Text>
              <Ionicons name="logo-bitcoin" size={16} color="#FFD700" style={{ marginLeft: 4 }} />
            </View>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Kurslar</Text>
            <Text style={styles.statValue}>{userCourses} ta</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Testlar</Text>
            <Text style={styles.statValue}>0 ta</Text>
          </View>
        </View>

        {/* Punyo Shop Banner */}
        <View style={styles.shopBanner}>
          <View style={styles.shopBannerContent}>
            <View style={styles.shopIconBox}>
              <Ionicons name="cart" size={24} color="#7c3aed" />
            </View>
            <View style={styles.shopTextContent}>
              <Text style={styles.shopTitle}>Punyo Shop</Text>
              <Text style={styles.shopDesc}>
                Yig'ilgan coinlaringizga haqiqiy sovg'alar va chegirmalar xarid qiling!
              </Text>
            </View>
          </View>
          <TouchableOpacity style={styles.shopButton} onPress={() => setShowShop(true)} activeOpacity={0.8}>
            <Text style={styles.shopButtonText}>Do'konga kirish</Text>
          </TouchableOpacity>
        </View>

        {/* Primary Menus */}
        <View style={styles.menuGroup}>
          {renderMenuItem("book-outline", "Mening kurslarim", false, onNavigateToMyCourses)}
          {renderMenuItem("checkbox-outline", "Mening testlarim", false, onNavigateToMyTests)}
          {renderMenuItem("game-controller-outline", "O'yinlar", false, () => setShowGames(true))}
          {renderMenuItem("ribbon-outline", "Mening sertifikatlarim", false, () => setShowCertificates(true))}
          {renderMenuItem("stats-chart-outline", "Statistika", false, () => setShowStatistics(true))}
        </View>

        {/* Secondary Menus */}
        <View style={styles.menuGroup}>
          <View style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <Ionicons name="moon-outline" size={22} color="#555" />
              <Text style={styles.menuItemTitle}>Tungi rejim</Text>
            </View>
            <Switch
              trackColor={{ false: "#E0E0E0", true: "#A78BFA" }}
              thumbColor={isDarkMode ? "#7c3aed" : "#f4f3f4"}
              ios_backgroundColor="#E0E0E0"
              onValueChange={() => setIsDarkMode(!isDarkMode)}
              value={isDarkMode}
            />
          </View>

          {renderMenuItem("globe-outline", "Til / Language", true, () => setShowLangModal(true))}
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} activeOpacity={0.8} onPress={onLogout}>
          <Ionicons name="log-out-outline" size={22} color="#E53935" />
          <Text style={styles.logoutText}>Tizimdan chiqish</Text>
        </TouchableOpacity>

      </ScrollView>

      {/* Language Modal */}
      <Modal visible={showLangModal} transparent={true} animationType="fade">
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setShowLangModal(false)}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Tilni tanlang</Text>
            
            <TouchableOpacity 
              style={[styles.langOption, selectedLang === 'uz' && styles.langOptionActive]}
              onPress={() => { setSelectedLang('uz'); setShowLangModal(false); }}
            >
              <Image source={{uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/84/Flag_of_Uzbekistan.svg/320px-Flag_of_Uzbekistan.svg.png'}} style={styles.modalFlag} />
              <Text style={[styles.langOptionText, selectedLang === 'uz' && styles.langOptionTextActive]}>O'zbekcha</Text>
              {selectedLang === 'uz' && <Ionicons name="checkmark-circle" size={24} color="#7c3aed" />}
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.langOption, selectedLang === 'ru' && styles.langOptionActive]}
              onPress={() => { setSelectedLang('ru'); setShowLangModal(false); }}
            >
              <Image source={{uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f3/Flag_of_Russia.svg/320px-Flag_of_Russia.svg.png'}} style={styles.modalFlag} />
              <Text style={[styles.langOptionText, selectedLang === 'ru' && styles.langOptionTextActive]}>Русский</Text>
              {selectedLang === 'ru' && <Ionicons name="checkmark-circle" size={24} color="#7c3aed" />}
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.langOption, selectedLang === 'en' && styles.langOptionActive]}
              onPress={() => { setSelectedLang('en'); setShowLangModal(false); }}
            >
              <Image source={{uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Flag_of_the_United_Kingdom_%281-2%29.svg/320px-Flag_of_the_United_Kingdom_%281-2%29.svg.png'}} style={styles.modalFlag} />
              <Text style={[styles.langOptionText, selectedLang === 'en' && styles.langOptionTextActive]}>English</Text>
              {selectedLang === 'en' && <Ionicons name="checkmark-circle" size={24} color="#7c3aed" />}
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5', // Light background for contrast
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 15,
    backgroundColor: '#FAFAFA',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  headerIcons: {
    flexDirection: 'row',
  },
  iconButton: {
    marginLeft: 15,
    position: 'relative',
  },
  notificationDot: {
    position: 'absolute',
    top: 2,
    right: 2,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E53935',
    borderWidth: 1,
    borderColor: '#FFF',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 120, // Avoid overlap with bottom nav
  },
  userInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 25,
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 2,
    borderColor: '#7c3aed',
  },
  userInfoText: {
    flex: 1,
    marginLeft: 15,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginRight: 10,
  },
  proBadge: {
    backgroundColor: '#FFD700',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  proText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#333',
  },
  userEmail: {
    fontSize: 13,
    color: '#777',
    marginTop: 2,
    marginBottom: 8,
  },
  levelRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  levelText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#333',
    marginRight: 10,
  },
  progressBarBg: {
    flex: 1,
    height: 6,
    backgroundColor: '#E0E0E0',
    borderRadius: 3,
    marginRight: 10,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#7c3aed',
    borderRadius: 3,
  },
  xpText: {
    fontSize: 11,
    color: '#777',
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 13,
    color: '#777',
    marginBottom: 6,
  },
  coinRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  statDivider: {
    width: 1,
    height: '70%',
    backgroundColor: '#F0F0F0',
    alignSelf: 'center',
  },
  shopBanner: {
    backgroundColor: '#34115C', // Dark purple background for shop
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#34115C',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  shopBannerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  shopIconBox: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#F5E6FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  shopTextContent: {
    flex: 1,
  },
  shopTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  shopDesc: {
    fontSize: 12,
    color: '#E0D4F5',
    lineHeight: 18,
  },
  shopButton: {
    backgroundColor: '#7c3aed',
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: 'center',
  },
  shopButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  menuGroup: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 20,
    paddingHorizontal: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 5,
    elevation: 2,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemTitle: {
    fontSize: 15,
    color: '#333',
    marginLeft: 15,
    fontWeight: '500',
  },
  languageBox: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  languageText: {
    fontSize: 13,
    color: '#777',
    marginRight: 10,
  },
  flagIcon: {
    width: 24,
    height: 16,
    borderRadius: 2,
  },
  logoutButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFEFEF',
    paddingVertical: 15,
    borderRadius: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#FFD6D6',
  },
  logoutText: {
    color: '#E53935',
    fontSize: 15,
    fontWeight: 'bold',
    marginLeft: 8,
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
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  langOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderRadius: 12,
    marginBottom: 10,
    backgroundColor: '#F9F9F9',
    borderWidth: 1,
    borderColor: '#EFEFEF',
  },
  langOptionActive: {
    backgroundColor: '#F5E6FF',
    borderColor: '#7c3aed',
  },
  modalFlag: {
    width: 32,
    height: 22,
    borderRadius: 4,
    marginRight: 15,
  },
  langOptionText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  langOptionTextActive: {
    color: '#7c3aed',
    fontWeight: 'bold',
  },
});
