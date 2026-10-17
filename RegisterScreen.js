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
  Image,
  ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';

export default function RegisterScreen({ onBack, onNavigateToLogin, onRegisterSuccess, onHelp }) {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(true);
  const [isLoadingGoogle, setIsLoadingGoogle] = useState(false);
  const [showOtp, setShowOtp] = useState(false);
  const [otpCode, setOtpCode] = useState('');

  const handleRegister = () => {
    if (!fullName.trim()) {
      Alert.alert("Xatolik", "Iltimos, to'liq ismingizni kiriting.");
      return;
    }
    if (!phone.trim()) {
      Alert.alert("Xatolik", "Iltimos, telefon raqamingizni kiriting.");
      return;
    }
    if (!email.trim()) {
      Alert.alert("Xatolik", "Iltimos, email manzilingizni kiriting.");
      return;
    }
    if (!password) {
      Alert.alert("Xatolik", "Iltimos, parolni kiriting.");
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert("Xatolik", "Parollar bir-biriga mos kelmadi.");
      return;
    }
    if (!acceptedTerms) {
      Alert.alert("Xatolik", "Davom etish uchun Foydalanish shartlariga rozilik bildiring.");
      return;
    }

    fetch('http://192.168.0.107:8000/api/auth/register/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: fullName,
        phone: phone.startsWith('+998') ? phone : `+998${phone}`,
        email: email,
        password: password
      })
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          if (onRegisterSuccess) {
            onRegisterSuccess(data.user);
          }
        } else {
          Alert.alert("Xatolik", data.message || "Ro'yxatdan o'tishda xatolik yuz berdi.");
        }
      })
      .catch(err => {
        console.log("Register API Error:", err);
        Alert.alert("Xatolik", "Server bilan bog'lanishda xatolik yuz berdi.");
      });
  };

  const handleVerifyOtp = () => {
    if (otpCode.length !== 6) {
      Alert.alert("Xatolik", "Kodni to'liq kiriting (6 xonali).");
      return;
    }

    fetch('http://192.168.0.107:8000/api/auth/verify-otp/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, code: otpCode })
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          Alert.alert("Muvaffaqiyatli!", data.message || "Hisobingiz tasdiqlandi!");
          if (onRegisterSuccess) {
            onRegisterSuccess(data.user);
          }
        } else {
          Alert.alert("Xatolik", data.message || "Noto'g'ri kod.");
        }
      })
      .catch(err => {
        console.log("Verify OTP API Error:", err);
        Alert.alert("Xatolik", "Server bilan bog'lanishda xatolik yuz berdi.");
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
          Alert.alert("Google Auth", data.message || "Google orqali muvaffaqiyatli ro'yxatdan o'tildi!");
          if (onRegisterSuccess) {
            onRegisterSuccess(data.user);
          }
        } else {
          Alert.alert("Xatolik", data.message || "Google bilan bog'lanishda xatolik yuz berdi.");
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
        if (onRegisterSuccess) onRegisterSuccess(fallbackUser);
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
            <Text style={styles.title}>Ro'yxatdan o'tish</Text>
            <Text style={styles.subtitle}>Yangi hisob yarating va o'qishni boshlang</Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            {/* Input 1: To'liq ism */}
            <View style={styles.inputContainer}>
              <Ionicons name="person-outline" size={20} color="#64748B" style={styles.inputIcon} />
              <TextInput 
                style={styles.input}
                placeholder="To'liq ism"
                placeholderTextColor="#94A3B8"
                value={fullName}
                onChangeText={setFullName}
              />
            </View>

            {/* Input 2: Telefon raqam */}
            <View style={styles.inputContainer}>
              <Ionicons name="call-outline" size={20} color="#64748B" style={styles.inputIcon} />
              <TextInput 
                style={styles.input}
                placeholder="Telefon raqam"
                placeholderTextColor="#94A3B8"
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
              />
              <View style={styles.countryCodeBadge}>
                <Image 
                  source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/84/Flag_of_Uzbekistan.svg/320px-Flag_of_Uzbekistan.svg.png' }}
                  style={styles.flagImage}
                />
                <Text style={styles.countryCodeText}>+998</Text>
                <Ionicons name="chevron-down" size={14} color="#64748B" style={{ marginLeft: 4 }} />
              </View>
            </View>

            {/* Input 3: Email manzilingiz */}
            <View style={styles.inputContainer}>
              <Ionicons name="mail-outline" size={20} color="#64748B" style={styles.inputIcon} />
              <TextInput 
                style={styles.input}
                placeholder="Email manzilingiz"
                placeholderTextColor="#94A3B8"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            {/* Input 4: Parol */}
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

            {/* Input 5: Parolni tasdiqlang */}
            <View style={styles.inputContainer}>
              <Ionicons name="lock-closed-outline" size={20} color="#64748B" style={styles.inputIcon} />
              <TextInput 
                style={styles.input}
                placeholder="Parolni tasdiqlang"
                placeholderTextColor="#94A3B8"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showConfirmPassword}
              />
              <TouchableOpacity 
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                style={styles.eyeIcon}
                activeOpacity={0.7}
              >
                <Ionicons 
                  name={showConfirmPassword ? "eye-outline" : "eye-off-outline"} 
                  size={20} 
                  color="#64748B" 
                />
              </TouchableOpacity>
            </View>

            {/* Checkbox Terms & Conditions */}
            <TouchableOpacity 
              style={styles.checkboxRow}
              onPress={() => setAcceptedTerms(!acceptedTerms)}
              activeOpacity={0.8}
            >
              <View style={[styles.checkbox, acceptedTerms && styles.checkboxActive]}>
                {acceptedTerms && <Ionicons name="checkmark" size={14} color="#FFFFFF" />}
              </View>
              <Text style={styles.checkboxLabel}>
                Men <Text style={styles.purpleLink}>Foydalanish shartlari</Text> va <Text style={styles.purpleLink}>Maxfiylik siyosatiga</Text> roziman
              </Text>
            </TouchableOpacity>

            {/* Register Button */}
            <TouchableOpacity 
              style={styles.primaryButton}
              onPress={handleRegister}
              activeOpacity={0.85}
            >
              <Text style={styles.primaryButtonText}>Ro'yxatdan o'tish</Text>
            </TouchableOpacity>
          </View>

          {/* Separator */}
          <View style={styles.separatorContainer}>
            <View style={styles.separatorLine} />
            <Text style={styles.separatorText}>Yoki davom eting</Text>
            <View style={styles.separatorLine} />
          </View>

          {/* Direct 1-Tap Google Registration Button */}
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
                  <Text style={styles.socialButtonText}>Google orqali ro'yxatdan o'tish</Text>
                </>
              )}
            </TouchableOpacity>
          </View>

          {/* Bottom Login Link */}
          <View style={styles.bottomNavContainer}>
            <Text style={styles.bottomNavText}>Hisobingiz bormi? </Text>
            <TouchableOpacity onPress={onNavigateToLogin} activeOpacity={0.7}>
              <Text style={styles.bottomNavLink}>Kirish</Text>
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
    marginBottom: 20,
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
    marginBottom: 22,
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
    marginBottom: 16,
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
    marginBottom: 12,
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
  countryCodeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  flagImage: {
    width: 20,
    height: 14,
    borderRadius: 2,
    marginRight: 6,
  },
  countryCodeText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#334155',
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 14,
    paddingRight: 10,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#CBD5E1',
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  checkboxActive: {
    backgroundColor: '#7C3AED',
    borderColor: '#7C3AED',
  },
  checkboxLabel: {
    flex: 1,
    fontSize: 13,
    color: '#475569',
    fontWeight: '500',
    lineHeight: 18,
  },
  purpleLink: {
    color: '#7C3AED',
    fontWeight: '700',
  },
  primaryButton: {
    backgroundColor: '#7C3AED',
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 6,
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
    marginVertical: 18,
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
    marginBottom: 20,
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
  bottomNavContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 8,
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
