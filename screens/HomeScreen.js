import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import QuickView from '../components/QuickView';

export default function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Your Quick Views</Text>
      <View style={styles.quickViews}>
        <QuickView 
          label="Mood Tracker" 
          icon={require('../assets/mood.png')} 
          onPress={() => navigation.navigate('Tools')} 
        />
        <QuickView 
          label="Challenging Negative Thoughts" 
          icon={require('../assets/negative_thoughts.png')} 
          onPress={() => navigation.navigate('Tools')}
        />
        <QuickView 
          label="Work" 
          icon={require('../assets/work.png')} 
          onPress={() => navigation.navigate('Activities')}
        />
        <QuickView 
          label="Life" 
          icon={require('../assets/life.png')} 
          onPress={() => navigation.navigate('Activities')}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
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
});
