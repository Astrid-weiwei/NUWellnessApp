import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  Alert, 
  StyleSheet, 
  ActivityIndicator,
  SafeAreaView,
  Image,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView
} from 'react-native';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleAuth = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password');
      return;
    }

    setLoading(true);
    const auth = getAuth();

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
        navigation.replace('AppTabs');
      } else {
        if (password.length < 6) {
          Alert.alert('Error', 'Password must be at least 6 characters long');
          return;
        }
        await createUserWithEmailAndPassword(auth, email, password);
        Alert.alert('Success', 'Account created successfully!');
        navigation.replace('AppTabs');
      }
    } catch (error) {
      let errorMessage = 'An error occurred.';
      switch (error.code) {
        case 'auth/email-already-in-use':
          errorMessage = 'This email is already registered.';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Please enter a valid email address.';
          break;
        case 'auth/wrong-password':
          errorMessage = 'Invalid email or password.';
          break;
        case 'auth/weak-password':
          errorMessage = 'Password should be at least 6 characters.';
          break;
      }
      Alert.alert('Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email.trim()) {
      Alert.alert('Error', 'Please enter your email address to reset the password.');
      return;
    }
  
    try {
      const auth = getAuth(); // Ensure Firebase Auth is initialized
      await sendPasswordResetEmail(auth, email);
      Alert.alert('Success', 'Password reset email sent! Please check your inbox.');
    } catch (error) {
      let errorMessage = 'An error occurred.';
      if (error.code === 'auth/user-not-found') {
        errorMessage = 'No user found with this email address.';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Please enter a valid email address.';
      }
      console.error('Password reset error:', error);
      Alert.alert('Error', errorMessage);
    }
  };
  
  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView 
            contentContainerStyle={styles.scrollContainer}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {/* Branding Section */}
            <View style={styles.brandingContainer}>
              <View style={styles.logoContainer}>
                <Image
                  source={require('../assets/app-logo.jpg')}
                  style={styles.logo}
                  resizeMode="contain"
                />
              </View>

              <Text style={styles.appName}>NUWellness</Text>
              <Text style={styles.tagline}>Organize Your Life</Text>

              <View style={styles.valueProps}>
                <Text style={styles.valueProp}>
                  <Text style={styles.highlight}>✓</Text> Balance Work & Life
                </Text>
                <Text style={styles.valueProp}>
                  <Text style={styles.highlight}>✓</Text> Boost Productivity
                </Text>
                <Text style={styles.valueProp}>
                  <Text style={styles.highlight}>✓</Text> Find Inner Peace
                </Text>
              </View>
            </View>

            {/* Auth Form */}
            <View style={styles.formContainer}>
              <Text style={styles.formHeader}>
                {isLogin ? 'Welcome Back!' : 'Join NUWellness'}
              </Text>
              
              <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
              />
              
              <TextInput
                style={styles.input}
                placeholder="Password"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
                autoCapitalize="none"
              />

              <TouchableOpacity 
                style={styles.authButton}
                onPress={handleAuth}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.authButtonText}>
                    {isLogin ? 'Login' : 'Create Account'}
                  </Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.switchButton}
                onPress={() => setIsLogin(!isLogin)}
              >
                <Text style={styles.switchButtonText}>
                  {isLogin 
                    ? "New to NUWellness? Create Account" 
                    : "Already have an account? Login"}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.switchButton}
                onPress={handleForgotPassword}
              >
                <Text style={styles.switchButtonText}>Forgot Password?</Text>
              </TouchableOpacity>
            </View>

            {/* Brand Footer */}
            <View style={styles.footer}>
              <Text style={styles.footerText}>
                Embrace Better Living
              </Text>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
    justifyContent: 'space-between',
  },
  brandingContainer: {
    alignItems: 'center',
    marginTop: 40,
  },
  logoContainer: {
    width: 100,
    height: 100,
    marginBottom: 20,
    backgroundColor: '#f0f0f0', // Placeholder for logo background
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 80,
    height: 80,
  },
  appName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    fontFamily: 'System', // Replace with your brand font
  },
  tagline: {
    fontSize: 18,
    color: '#666',
    marginTop: 8,
    fontFamily: 'System', // Replace with your brand font
  },
  valueProps: {
    marginTop: 24,
    alignItems: 'center',
  },
  valueProp: {
    fontSize: 16,
    color: '#555',
    marginVertical: 4,
  },
  highlight: {
    color: '#673ab7',
    fontWeight: 'bold',
  },
  formContainer: {
    width: '100%',
    marginTop: 40,
  },
  formHeader: {
    fontSize: 24,
    fontWeight: '600',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 10,
    marginBottom: 12,
    fontSize: 16,
  },
  authButton: {
    backgroundColor: '#673ab7',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  authButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  switchButton: {
    marginTop: 15,
    padding: 10,
  },
  switchButtonText: {
    color: '#673ab7',
    fontSize: 14,
    textAlign: 'center',
  },
  footer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  footerText: {
    color: '#999',
    fontSize: 14,
  }
});