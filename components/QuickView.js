import React from 'react';
import { TouchableOpacity, View, Text, Image, StyleSheet } from 'react-native';

export default function QuickView({ label, icon, onPress }) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <View style={styles.iconContainer}>
        <Image source={icon} style={styles.icon} />
      </View>
      <Text style={styles.label}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    width: '50%',
    paddingHorizontal: 10,
  },
  iconContainer: {
    width: 60,
    height: 60,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    marginBottom: 8,
  },
  icon: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
  },
  label: {
    fontSize: 14,
    textAlign: 'center',
    maxWidth: '100%',
    flexWrap: 'wrap',
  },
});