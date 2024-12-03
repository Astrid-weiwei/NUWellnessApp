import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import QuickView from '../components/QuickView';
import { getAuth, signOut } from 'firebase/auth';
import { ProfileModal } from '../components/ProfileModal';

export default function HomeScreen({ navigation }) {
  const [profileVisible, setProfileVisible] = useState(false);

  const handleLogout = async () => {
    const auth = getAuth();
    try {
      await signOut(auth);
      Alert.alert('Success', 'You have been logged out.');
      navigation.navigate('Login');
    } catch (error) {
      console.error('Logout failed:', error.message);
      Alert.alert('Error', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.header}>Your Quick Views</Text>
        <TouchableOpacity 
          style={styles.profileButton}
          onPress={() => setProfileVisible(true)}
        >
          <Text style={styles.profileButtonText}>Profile</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.quickViewsGrid}>
        <View style={styles.row}>
          <QuickView 
            label="Mood Tracker" 
            icon={require('../assets/mood.png')} 
            onPress={() => navigation.navigate('Tools', { screen: 'Mood Tracker' })} 
          />
          <QuickView 
            label="Challenging Negative Thoughts" 
            icon={require('../assets/negative_thoughts.png')} 
            onPress={() => navigation.navigate('Tools', { screen: 'Challenging Negative Thoughts' })}
          />
        </View>
        <View style={styles.row}>
          <QuickView 
            label="Work" 
            icon={require('../assets/work.png')} 
            onPress={() => navigation.navigate('Activities', { screen: 'Work' })}
          />
          <QuickView 
            label="Life" 
            icon={require('../assets/life.png')} 
            onPress={() => navigation.navigate('Activities', { screen: 'Life' })}
          />
        </View>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>

      <ProfileModal 
        visible={profileVisible}
        onClose={() => setProfileVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  profileButton: {
    backgroundColor: '#673ab7',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  profileButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  quickViewsGrid: {
    flex: 1,
    paddingTop: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  logoutButton: {
    backgroundColor: '#673ab7',
    padding: 15,
    borderRadius: 8,
    width: '100%',
    marginBottom: 20,
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
});