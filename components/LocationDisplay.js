import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { WELLNESS_TYPES } from '../constants/wellness';

const LocationDisplay = ({ location }) => {
  console.log('LocationDisplay received location:', location); // Debug log
  
  if (!location) return null;
  
  const type = location.type || 'WELLNESS_CENTER';
  const wellnessType = WELLNESS_TYPES[type] || WELLNESS_TYPES['WELLNESS_CENTER'];
  
  return (
    <View style={styles.container}>
      <Text style={styles.typeText}>
        {wellnessType.icon} {wellnessType.label}
      </Text>
      {location.placeName && (
        <Text style={styles.placeText}>
          {location.placeName}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 4,
  },
  typeText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  placeText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 20,
    marginTop: 2,
  },
});

export default LocationDisplay;