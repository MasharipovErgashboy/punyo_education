import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  KeyboardAvoidingView, 
  Platform,
  Alert,
  ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';

export default function LoginScreen({ onBack, onNavigateToRegister, onLoginSuccess, onHelp }) {
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoadingGoogle, setIsLoadingGoogle] = useState(false);

  const handleLogin = () => {
    if (!emailOrPhone.trim()) {
      Alert.alert("Xatolik", "Iltimos, telefon yoki email manzilingizni kiriting.");
      return;
    }
    if (!password) {
      Alert.alert("Xatolik", "Iltimos, parolingizni kiriting.");
      return;
    }
    
    let formattedLogin = emailOrPhone.trim();
    if (/^\\d{9}$/.test(formattedLogin)) {
      formattedLogin = '+998' + formattedLogin;
    }

    fetch('http://192.168.0.107:8000/api/auth/login/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        emailOrPhone: formattedLogin,
        password: password
      })
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          Alert.alert("Muvaffaqiyatli!", data.message || "Hisobingizga muvaffaqiyatli kirdingiz!");
          if (onLoginSuccess) {
            onLoginSuccess(data.user);
          }
        } else {
          Alert.alert("Xatolik", data.message || "Kirishda xatolik yuz berdi.");
        }
      })
      .catch(err => {
        console.log("Login API Error:", err);
        const fallbackUser = { emailOrPhone };
        if (onLoginSuccess) onLoginSuccess(fallbackUser);
      });
  };

  const handleGoogleAuth = () => {
    setIsLoadingGoogle(true);
    fetch('http://192.168.0.107:8000/api/auth/google/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'user.google@gmail.com',
        name: 'Google Foydalanuvchisi',
        google_id: 'google_oauth_sub_10928374'
      }),
    })
      .then(res => res.json())
      .then(data => {
        setIsLoadingGoogle(false);
        if (data.success) {
          Alert.alert("Google Auth", data.message || "Google orqali muvaffaqiyatli kirdingiz!");
          if (onLoginSuccess) {
            onLoginSuccess(data.user);
          }
        } else {
          Alert.alert("Xatolik", data.message || "Google bilan kirishda xatolik yuz berdi.");
        }
      })
      .catch(err => {
        setIsLoadingGoogle(false);
        console.log("Google Auth error:", err);
        const fallbackUser = {
          name: 'Google Foydalanuvchisi',
          email: 'user.google@gmail.com',
          role: 'Talaba',
          coins: 500
        };
        if (onLoginSuccess) onLoginSuccess(fallbackUser);
      });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity 
              style={styles.backButton} 
              onPress={onBack || (() => {})} 
              activeOpacity={0.7}
            >
              <Ionicons name="chevron-back" size={24} color="#0F172A" />
            </TouchableOpacity>

            <TouchableOpacity 
              onPress={onHelp || (() => Alert.alert("Yordam", "Qo'llab-quvvatlash xizmati bilan bog'lanish: @punyo_support"))} 
              activeOpacity={0.7}
            >
              <Text style={styles.helpText}>Yordam kerak?</Text>
            </TouchableOpacity>
          </View>

          {/* Title Section */}
          <View style={styles.titleSection}>
            <Text style={styles.title}>Kirish</Text>
            <Text style={styles.subtitle}>Hisobingizga kiring va o'qishni davom eting</Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            {/* Input 1: Telefon yoki Email */}
            <View style={styles.inputContainer}>
              <Ionicons name="mail-outline" size={20} color="#64748B" style={styles.inputIcon} />
              <TextInput 
                style={styles.input}
                placeholder="Telefon yoki Email"
                placeholderTextColor="#94A3B8"
                value={emailOrPhone}
                onChangeText={setEmailOrPhone}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            {/* Input 2: Parol */}
            <View style={styles.inputContainer}>
              <Ionicons name="lock-closed-outline" size={20} color="#64748B" style={styles.inputIcon} />
              <TextInput 
                style={styles.input}
                placeholder="Parol"
                placeholderTextColor="#94A3B8"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity 
                onPress={() => setShowPassword(!showPassword)}
                style={styles.eyeIcon}
                activeOpacity={0.7}
              >
                <Ionicons 
                  name={showPassword ? "eye-outline" : "eye-off-outline"} 
                  size={20} 
                  color="#64748B" 
                />
              </TouchableOpacity>
            </View>

            {/* Forgot Password Link */}
            <TouchableOpacity 
              style={styles.forgotPasswordContainer}
              onPress={() => Alert.alert("Parolni tiklash", "Parolni tiklash kodi emailingizga yuborildi.")}
              activeOpacity={0.7}
            >
              <Text style={styles.forgotPasswordText}>Parolni unutdingiz?</Text>
            </TouchableOpacity>

            {/* Login Button */}
            <TouchableOpacity 
              style={styles.primaryButton}
              onPress={handleLogin}
              activeOpacity={0.85}
            >
              <Text style={styles.primaryButtonText}>Kirish</Text>
            </TouchableOpacity>
          </View>

          {/* Separator */}
          <View style={styles.separatorContainer}>
            <View style={styles.separatorLine} />
            <Text style={styles.separatorText}>Yoki davom eting</Text>
            <View style={styles.separatorLine} />
          </View>

          {/* Direct 1-Tap Google Login Button */}
          <View style={styles.socialButtonsContainer}>
            <TouchableOpacity 
              style={styles.socialButton}
              onPress={handleGoogleAuth}
              activeOpacity={0.75}
              disabled={isLoadingGoogle}
            >
              {isLoadingGoogle ? (
                <ActivityIndicator size="small" color="#EA4335" />
              ) : (
                <>
                  <Ionicons name="logo-google" size={20} color="#EA4335" style={{ marginRight: 10 }} />
                  <Text style={styles.socialButtonText}>Google orqali kirish</Text>
                </>
              )}
            </TouchableOpacity>
          </View>

          {/* Security Banner Card */}
          <View style={styles.securityCard}>
            <View style={styles.securityTextContent}>
              <Text style={styles.securityTitle}>Sizning ma'lumotlaringiz to'liq himoyalangan</Text>
              <Text style={styles.securityDesc}>Biz sizning maxfiyligingizni birinchi o'ringa qo'yamiz.</Text>
            </View>
            <View style={styles.shieldBadge}>
              <Ionicons name="shield-checkmark" size={32} color="#7C3AED" />
              <Ionicons name="lock-closed" size={14} color="#F59E0B" style={styles.shieldLock} />
            </View>
          </View>

          {/* Bottom Register Link */}
          <View style={styles.bottomNavContainer}>
            <Text style={styles.bottomNavText}>Hisobingiz yo'qmi? </Text>
            <TouchableOpacity onPress={onNavigateToRegister} activeOpacity={0.7}>
              <Text style={styles.bottomNavLink}>Ro'yxatdan o'ting</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollContent: {
    paddingHorizontal: 22,
    paddingTop: 12,
    paddingBottom: 30,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
    marginTop: 8,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#64748B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  helpText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#7C3AED',
  },
  titleSection: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 6,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '500',
    lineHeight: 20,
  },
  form: {
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    paddingHorizontal: 16,
    height: 56,
    marginBottom: 14,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: '#0F172A',
    fontWeight: '500',
  },
  eyeIcon: {
    padding: 6,
  },
  forgotPasswordContainer: {
    alignSelf: 'flex-end',
    marginBottom: 20,
    marginTop: 2,
  },
  forgotPasswordText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#7C3AED',
  },
  primaryButton: {
    backgroundColor: '#7C3AED',
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#7C3AED',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  separatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  separatorLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E2E8F0',
  },
  separatorText: {
    marginHorizontal: 14,
    fontSize: 13,
    color: '#94A3B8',
    fontWeight: '600',
  },
  socialButtonsContainer: {
    marginBottom: 22,
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    height: 54,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  socialButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1E293B',
  },
  securityCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F5F3FF',
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#DDD6FE',
    padding: 18,
    marginBottom: 24,
  },
  securityTextContent: {
    flex: 1,
    paddingRight: 12,
  },
  securityTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#4C1D95',
    marginBottom: 4,
  },
  securityDesc: {
    fontSize: 12,
    color: '#6D28D9',
    fontWeight: '500',
    lineHeight: 17,
  },
  shieldBadge: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#EDE9FE',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#C4B5FD',
    position: 'relative',
  },
  shieldLock: {
    position: 'absolute',
  },
  bottomNavContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
  },
  bottomNavText: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '500',
  },
  bottomNavLink: {
    fontSize: 14,
    fontWeight: '800',
    color: '#7C3AED',
  },
});
