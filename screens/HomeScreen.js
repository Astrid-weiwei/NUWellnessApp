// import React from 'react';
// import { View, Text, StyleSheet } from 'react-native';
// import QuickView from '../components/QuickView';

// export default function HomeScreen({ navigation }) {
//   return (
//     <View style={styles.container}>
//       <Text style={styles.header}>Your Quick Views</Text>
//       <View style={styles.quickViews}>
//         <QuickView 
//           label="Mood Tracker" 
//           icon={require('../assets/mood.png')} 
//           onPress={() => navigation.navigate('Tools', { screen: 'Mood Tracker' })} 
//         />
//         <QuickView 
//           label="Challenging Negative Thoughts" 
//           icon={require('../assets/negative_thoughts.png')} 
//           onPress={() => navigation.navigate('Tools', { screen: 'Challenging Negative Thoughts' })}
//         />
//         <QuickView 
//           label="Work" 
//           icon={require('../assets/work.png')} 
//           onPress={() => navigation.navigate('Activities', { screen: 'Work' })}
//         />
//         <QuickView 
//           label="Life" 
//           icon={require('../assets/life.png')} 
//           onPress={() => navigation.navigate('Activities', { screen: 'Life' })}
//         />
//       </View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   header: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     marginBottom: 20,
//   },
//   quickViews: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     justifyContent: 'center',
//   },
// });

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import QuickView from '../components/QuickView';
import { getAuth, signOut } from 'firebase/auth';

export default function HomeScreen({ navigation }) {
  const handleLogout = async () => {
    const auth = getAuth();
  try {
    await signOut(auth);
    Alert.alert('Success', 'You have been logged out.');
    navigation.navigate('Login'); // Navigate back to the login screen
  } catch (error) {
    console.error('Logout failed:', error.message);
    Alert.alert('Error', error.message);
  }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Your Quick Views</Text>
      <View style={styles.quickViews}>
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
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  quickViews: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  logoutButton: {
    marginTop: 20,
    backgroundColor: '#673ab7',
    padding: 10,
    borderRadius: 5,
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
});
