import React, { useEffect, useRef, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ImageBackground, Image, Dimensions, Animated, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import HomeScreen from './HomeScreen';
import LoginScreen from './LoginScreen';
import RegisterScreen from './RegisterScreen';

const { width, height } = Dimensions.get('window');

const translations = {
  uz: {
    loading: "Yuklanmoqda...",
    main_title1: "Barcha tillar va IT bilimlari",
    main_highlight1: "bitta platformada!",
    feat1_1: "Chet tillari",
    feat1_2: "IT kurslari",
    feat1_3: "Mock testlar",
    start: "Boshlash",
    title2_part1: "Barcha tillarni\n",
    title2_highlight: "o'rganing",
    desc2_part1: "Ingliz, Yapon, Koreys, Nemis va boshqa ko'plab tillarni 0 dan A1 darajasigacha ",
    desc2_highlight: "bepul",
    desc2_part2: " o'rganing.",
    next: "Keyingi",
    title3_part1: "Coin yig'ing va\n",
    title3_highlight: "sovg'alarga almashtiring",
    desc3_part1: "Kurslarni tugating, testlardan yaxshi natija oling va coin yig'ib, ",
    desc3_highlight: "sovg'alar, chegirmalar",
    desc3_part2: " va premium imkoniyatlarga ega bo'ling."
  },
  ru: {
    loading: "Загрузка...",
    main_title1: "Все языки и IT-знания",
    main_highlight1: "на одной платформе!",
    feat1_1: "Иностр. языки",
    feat1_2: "IT курсы",
    feat1_3: "Пробные тесты",
    start: "Начать",
    title2_part1: "Изучайте\n",
    title2_highlight: "все языки",
    desc2_part1: "Изучайте английский, японский, корейский, немецкий и многие другие языки с 0 до уровня A1 ",
    desc2_highlight: "бесплатно",
    desc2_part2: ".",
    next: "Далее",
    title3_part1: "Собирайте монеты и\n",
    title3_highlight: "обменивайте на подарки",
    desc3_part1: "Завершайте курсы, получайте хорошие результаты в тестах, собирайте монеты и получайте ",
    desc3_highlight: "подарки, скидки",
    desc3_part2: " и премиум-возможности."
  },
  en: {
    loading: "Loading...",
    main_title1: "All languages and IT skills",
    main_highlight1: "on one platform!",
    feat1_1: "Foreign langs",
    feat1_2: "IT courses",
    feat1_3: "Mock tests",
    start: "Start",
    title2_part1: "Learn\n",
    title2_highlight: "all languages",
    desc2_part1: "Learn English, Japanese, Korean, German, and many other languages from 0 to A1 level for ",
    desc2_highlight: "free",
    desc2_part2: ".",
    next: "Next",
    title3_part1: "Collect coins and\n",
    title3_highlight: "exchange for gifts",
    desc3_part1: "Complete courses, get good test results, collect coins and get ",
    desc3_highlight: "gifts, discounts",
    desc3_part2: " and premium features."
  }
};

export default function App() {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const [progress, setProgress] = useState(0);
  const [step, setStep] = useState(0);
  const [initialAuth, setInitialAuth] = useState(false);
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'register'
  const [lang, setLang] = useState('uz');
  const [isLangOpen, setIsLangOpen] = useState(false);
  const t = translations[lang];

  useEffect(() => {
    // Logo breathing animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.05,
          duration: 1200,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 1200,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Progress bar animation
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          
          // Check login state when progress finishes
          AsyncStorage.getItem('isLoggedIn')
            .then(res => {
              if (res === 'true') {
                setInitialAuth(true);
                setTimeout(() => setStep(4), 300); // Skip to HomeScreen
              } else {
                setTimeout(() => setStep(1), 300); // Go to onboarding
              }
            })
            .catch(() => {
              setTimeout(() => setStep(1), 300);
            });
            
          return 100;
        }
        return prev + 1; // increase by 1% every 30ms (takes ~3 seconds)
      });
    }, 30);

    return () => clearInterval(interval);
  }, [scaleAnim]);

  const renderDropdown = () => (
    <View style={styles.langContainer}>
      <TouchableOpacity style={styles.langButton} onPress={() => setIsLangOpen(!isLangOpen)} activeOpacity={0.8}>
        <Text style={styles.langButtonText}>{lang === 'uz' ? '🇺🇿 UZ' : lang === 'ru' ? '🇷🇺 RU' : '🇬🇧 EN'}</Text>
        <Ionicons name={isLangOpen ? "chevron-up" : "chevron-down"} size={16} color="#333" />
      </TouchableOpacity>
      {isLangOpen && (
        <View style={styles.dropdown}>
          <TouchableOpacity style={styles.dropdownItem} onPress={() => { setLang('uz'); setIsLangOpen(false); }}>
            <Text style={[styles.dropdownItemText, lang === 'uz' && styles.dropdownItemTextActive]}>🇺🇿 UZ</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.dropdownItem} onPress={() => { setLang('ru'); setIsLangOpen(false); }}>
            <Text style={[styles.dropdownItemText, lang === 'ru' && styles.dropdownItemTextActive]}>🇷🇺 RU</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.dropdownItem} onPress={() => { setLang('en'); setIsLangOpen(false); }}>
            <Text style={[styles.dropdownItemText, lang === 'en' && styles.dropdownItemTextActive]}>🇬🇧 EN</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  // If step is 1, show the first onboarding screen
  if (step === 1) {
    return (
      <View style={styles.onboardingScreen}>
        <StatusBar style="dark" backgroundColor="#FAFAFA" translucent={false} />
        {renderDropdown()}
        
        <View style={styles.onboardingContent}>
          {/* Logo */}
          <View style={styles.onboardingLogoContainer}>
            <Image 
              source={require('./assets/logo.png')} 
              style={styles.onboardingLogo}
              resizeMode="contain"
            />
          </View>

          {/* Divider */}
          <View style={styles.dividerContainer}>
            <View style={styles.dividerLine} />
            <View style={styles.diamond} />
            <View style={styles.dividerLine} />
          </View>

          {/* Texts removed as per user request */}

          {/* Features */}
          <View style={styles.featuresContainer}>
            <View style={styles.featureCard}>
              <Ionicons name="globe-outline" size={40} color="#FDB100" />
              <Text style={styles.featureText}>{t.feat1_1}</Text>
            </View>

            <View style={styles.featureCard}>
              <Ionicons name="code-slash" size={40} color="#8A2BE2" />
              <Text style={styles.featureText}>{t.feat1_2}</Text>
            </View>

            <View style={styles.featureCard}>
              <Ionicons name="trophy-outline" size={40} color="#FDB100" />
              <Text style={styles.featureText}>{t.feat1_3}</Text>
            </View>
          </View>

          {/* Button */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.startButton} activeOpacity={0.8} onPress={() => setStep(2)}>
              <Text style={styles.startButtonText}>{t.start}</Text>
              <Ionicons name="arrow-forward" size={24} color="#FFFFFF" style={{ marginLeft: 10 }} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Pagination Dots at Bottom */}
        <View style={styles.paginationContainer}>
          <View style={[styles.dot, styles.activeDot]} />
          <View style={styles.dot} />
          <View style={styles.dot} />
        </View>
      </View>
    );
  }

  // If step is 2, show the second onboarding screen
  if (step === 2) {
    return (
      <View style={styles.onboardingScreen2}>
        <StatusBar style="dark" backgroundColor="#FAFAFA" translucent={false} />
        {renderDropdown()}
        
        <View style={styles.globeContainer}>
          {/* We use the globe image provided by the user in the prompt */}
          <Image 
            source={require('./assets/globe.png')} 
            style={styles.globeImage}
            resizeMode="contain"
          />
        </View>

        <View style={styles.textSection2}>
          <Text style={styles.titleText2}>
            {t.title2_part1}
            <Text style={styles.titleHighlight2}>{t.title2_highlight}</Text>
          </Text>
          <Text style={styles.descText2}>
            {t.desc2_part1}<Text style={styles.descHighlight2}>{t.desc2_highlight}</Text>{t.desc2_part2}
          </Text>
        </View>

        <View style={styles.bottomSection2}>
          <View style={styles.paginationContainer}>
            <View style={styles.dot} />
            <View style={[styles.dot, styles.activeDot]} />
            <View style={styles.dot} />
          </View>

          <TouchableOpacity style={styles.nextButton} activeOpacity={0.8} onPress={() => setStep(3)}>
            <Text style={styles.nextButtonText}>{t.next}</Text>
            <Ionicons name="arrow-forward" size={24} color="#FDB100" style={{ marginLeft: 10 }} />
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // If step is 3, show the third onboarding screen
  if (step === 3) {
    return (
      <View style={styles.onboardingScreen2}>
        <StatusBar style="dark" backgroundColor="#FAFAFA" translucent={false} />
        {renderDropdown()}
        
        <View style={styles.globeContainer}>
          <Image 
            source={require('./assets/chest.png')} 
            style={styles.globeImage}
            resizeMode="contain"
          />
        </View>

        <View style={styles.textSection2}>
          <Text style={styles.titleText2}>
            {t.title3_part1}
            <Text style={styles.titleHighlight2}>{t.title3_highlight}</Text>
          </Text>
          <Text style={styles.descText2}>
            {t.desc3_part1}<Text style={styles.descHighlight2}>{t.desc3_highlight}</Text>{t.desc3_part2}
          </Text>
        </View>

        <View style={styles.bottomSection2}>
          <View style={styles.paginationContainer}>
            <View style={styles.dot} />
            <View style={styles.dot} />
            <View style={[styles.dot, styles.activeDot]} />
          </View>

          <TouchableOpacity style={styles.finalButton} activeOpacity={0.8} onPress={() => setStep(4)}>
            <Text style={styles.finalButtonText}>{t.start}</Text>
            <Ionicons name="rocket" size={24} color="#222222" style={{ position: 'absolute', right: 25 }} />
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // If step is 4, show the main application (HomeScreen) which handles Guest Mode and Login trigger
  if (step === 4) {
    return <HomeScreen lang={lang} initialIsAuthenticated={initialAuth} onLogout={() => { setInitialAuth(false); setStep(1); }} />;
  }

  return (
    <View style={styles.container}>
      <ImageBackground 
        source={require('./assets/background.png')} 
        style={styles.backgroundImage}
        imageStyle={{ resizeMode: 'stretch' }}
      >
        <StatusBar style="dark" backgroundColor="#FFFFFF" translucent={false} />
        
        {/* Logo Container */}
        <View style={styles.logoContainer}>
          <Animated.Image 
            source={require('./assets/logo.png')} 
            style={[styles.logo, { transform: [{ scale: scaleAnim }] }]}
            resizeMode="contain"
          />
        </View>

        {/* Loading Container */}
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>{t.loading}</Text>
          <View style={styles.progressBarBackground}>
            <View style={[styles.progressBarFill, { width: `${progress}%` }]} />
          </View>
          <Text style={styles.percentageText}>{progress}%</Text>
        </View>

      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF8FC', // light tint to match background image edges
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginTop: -height * 0.02, // slightly lower than before
  },
  logo: {
    width: width * 0.95,
    height: width * 0.95,
    marginLeft: 8, // shift slightly to the right
  },
  loadingContainer: {
    width: '100%',
    alignItems: 'center',
    paddingBottom: height * 0.04, // reduced to move it lower
  },
  loadingText: {
    color: '#342654',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
  },
  progressBarBackground: {
    width: width * 0.5,
    height: 8,
    backgroundColor: '#d3cce0',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 10,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#7c3aed',
    borderRadius: 4,
  },
  percentageText: {
    color: '#7c3aed',
    fontSize: 16,
    fontWeight: 'bold',
  },
  langContainer: {
    position: 'absolute',
    top: height * 0.07, // increased from 0.05 to push it down slightly
    right: 20,
    zIndex: 1000,
  },
  langButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  langButtonText: {
    fontSize: 14,
    fontWeight: '600',
    marginRight: 6,
    color: '#333333',
  },
  dropdown: {
    position: 'absolute',
    top: 45,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 5,
    width: 80,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  dropdownItem: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    alignItems: 'center',
  },
  dropdownItemText: {
    fontSize: 14,
    color: '#555555',
    fontWeight: '500',
  },
  dropdownItemTextActive: {
    color: '#FDB100',
    fontWeight: 'bold',
  },
  onboardingScreen: {
    flex: 1,
    backgroundColor: '#FAFAFA', // Light textured-like background
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: height * 0.12, // Revert padding because translucent is false
    paddingBottom: height * 0.12,
  },
  onboardingContent: {
    width: '100%',
    alignItems: 'center',
  },
  onboardingLogoContainer: {
    alignItems: 'center',
    marginBottom: -40, // Negative margin to move everything below it upwards
  },
  onboardingLogo: {
    width: width * 1.05,
    height: width * 1.05,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
    width: '60%',
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#FDB100',
    opacity: 0.3,
  },
  diamond: {
    width: 8,
    height: 8,
    backgroundColor: '#FDB100',
    transform: [{ rotate: '45deg' }],
    marginHorizontal: 15,
  },
  featuresContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '85%',
    marginBottom: 40,
  },
  featureCard: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    width: (width * 0.85) / 3 - 10,
    paddingVertical: 25,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.05,
    shadowRadius: 15,
    elevation: 4,
  },
  featureText: {
    fontSize: 12,
    color: '#555555',
    fontWeight: '600',
    marginTop: 15,
    textAlign: 'center',
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 30, // Push it up away from the dots
  },
  startButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '80%',
    paddingVertical: 18,
    borderRadius: 40,
    backgroundColor: '#FDB100',
    shadowColor: '#FDB100',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  startButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  paginationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#E0E0E0',
    marginHorizontal: 6,
  },
  activeDot: {
    backgroundColor: '#FDB100',
  },
  onboardingScreen2: {
    flex: 1,
    backgroundColor: '#FAFAFA',
    alignItems: 'center',
    paddingTop: height * 0.1,
    paddingBottom: height * 0.1,
    justifyContent: 'space-between',
  },
  globeContainer: {
    alignItems: 'center',
    width: '100%',
    height: height * 0.45,
  },
  globeImage: {
    width: '100%',
    height: '100%',
  },
  textSection2: {
    width: '85%',
    alignItems: 'flex-start',
  },
  titleText2: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#222222',
    lineHeight: 44,
    marginBottom: 15,
  },
  titleHighlight2: {
    color: '#FDB100',
  },
  descText2: {
    fontSize: 16,
    color: '#666666',
    lineHeight: 26,
    fontWeight: '400',
  },
  descHighlight2: {
    color: '#7c3aed', // Purple
    fontWeight: '600',
  },
  bottomSection2: {
    width: '100%',
    alignItems: 'center',
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '85%',
    paddingVertical: 18,
    borderRadius: 30, 
    backgroundColor: '#2D1B4E', // dark purple
    borderWidth: 1.5,
    borderColor: '#FDB100', // gold border
    marginTop: 40,
    shadowColor: '#2D1B4E',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  nextButtonText: {
    color: '#FDB100',
    fontSize: 18,
    fontWeight: 'bold',
  },
  finalButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '85%',
    paddingVertical: 18,
    borderRadius: 30, 
    backgroundColor: '#FDB100', // solid gold
    marginTop: 40,
    shadowColor: '#FDB100',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 5,
  },
  finalButtonText: {
    color: '#222222',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
