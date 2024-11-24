import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, Alert, ActivityIndicator, ScrollView } from 'react-native';
import MapView, { Marker, PROVIDER_DEFAULT } from 'react-native-maps';
import * as Location from 'expo-location';

// Vancouver coordinates
const VANCOUVER_REGION = {
  latitude: 49.2827,
  longitude: -123.1207,
  latitudeDelta: 0.05,
  longitudeDelta: 0.05,
};

const WELLNESS_TYPES = {
  GYM: { icon: '💪', color: '#FF5252', label: 'Gym' },
  PARK: { icon: '🌳', color: '#4CAF50', label: 'Park' },
  YOGA: { icon: '🧘', color: '#9C27B0', label: 'Yoga Studio' },
  POOL: { icon: '🏊', color: '#2196F3', label: 'Swimming Pool' },
  HEALTH_FOOD: { icon: '🥗', color: '#8BC34A', label: 'Health Food Store' },
  SPORTS: { icon: '⚽', color: '#FFC107', label: 'Sports Facility' },
  HIKING: { icon: '🥾', color: '#795548', label: 'Hiking Trail' },
  MEDITATION: { icon: '🧠', color: '#9575CD', label: 'Meditation Center' },
  WELLNESS_CENTER: { icon: '⭐', color: '#00BCD4', label: 'Wellness Center' },
};

export default function LocationPicker({ onLocationSelected }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [currentLocation, setCurrentLocation] = useState(VANCOUVER_REGION);
  const [loading, setLoading] = useState(false);
  const [selectedLocationType, setSelectedLocationType] = useState('GYM');
  const [mapReady, setMapReady] = useState(false);
  const mapRef = React.useRef(null);

  useEffect(() => {
    getCurrentLocation();
  }, []);

  const getCurrentLocation = async () => {
    try {
      setLoading(true);
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Location Permission Required',
          'Using default Vancouver location. Enable location services for current location.',
          [{ text: 'OK' }]
        );
        return;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      
      const currentLoc = {
        latitude: Number(location.coords.latitude),
        longitude: Number(location.coords.longitude),
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      };
      setCurrentLocation(currentLoc);
      
      if (mapRef.current && mapReady) {
        mapRef.current.animateToRegion(currentLoc, 1000);
      }
    } catch (error) {
      console.warn('Error getting location:', error);
      Alert.alert(
        'Location Error', 
        'Using Vancouver as default location.',
        [{ text: 'OK' }]
      );
    } finally {
      setLoading(false);
    }
  };

  const handleMapPress = async (e) => {
    try {
      const { latitude, longitude } = e.nativeEvent.coordinate;
      
      // Ensure coordinates are valid numbers
      if (typeof latitude !== 'number' || typeof longitude !== 'number') {
        throw new Error('Invalid coordinates');
      }

      const location = {
        id: Date.now().toString(),
        latitude: Number(latitude.toFixed(6)),
        longitude: Number(longitude.toFixed(6)),
        type: selectedLocationType,
        timestamp: new Date().toISOString(),
      };

      const locationName = await getLocationName(latitude, longitude);
      
      const newLocation = {
        ...location,
        title: `${WELLNESS_TYPES[selectedLocationType].icon} ${locationName}`,
        description: WELLNESS_TYPES[selectedLocationType].label,
        address: locationName,
      };

      setSelectedLocations(prev => [...prev, newLocation]);
    } catch (error) {
      console.warn('Error adding location:', error);
      Alert.alert('Error', 'Unable to add location. Please try again.');
    }
  };

  const getLocationName = async (latitude, longitude) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`
      );
      const data = await response.json();
      return data.display_name || 'Selected Location';
    } catch (error) {
      return 'Selected Location';
    }
  };

  const handleConfirmLocations = () => {
    try {
      // Validate locations before saving
      const validLocations = selectedLocations.map(location => ({
        ...location,
        latitude: Number(location.latitude),
        longitude: Number(location.longitude),
        // Ensure these are formatted properly for display
        latitudeStr: location.latitude.toFixed(6),
        longitudeStr: location.longitude.toFixed(6),
      }));

      onLocationSelected(validLocations);
      setModalVisible(false);
    } catch (error) {
      console.warn('Error saving locations:', error);
      Alert.alert('Error', 'Unable to save locations. Please try again.');
    }
  };

  const removeLocation = (locationId) => {
    setSelectedLocations(prev => prev.filter(loc => loc.id !== locationId));
  };

  const resetToVancouver = () => {
    if (mapRef.current && mapReady) {
      mapRef.current.animateToRegion(VANCOUVER_REGION, 1000);
    }
  };

  return (
    <>
      <TouchableOpacity 
        onPress={() => setModalVisible(true)}
        style={styles.locationButton}
      >
        <Text style={styles.locationButtonText}>
          {selectedLocations.length > 0 ? '📍 Edit Wellness Locations' : '📍 Add Wellness Locations'}
        </Text>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={false}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          {loading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#673ab7" />
            </View>
          )}

          <View style={styles.mapContainer}>
            <MapView
              ref={mapRef}
              style={styles.map}
              provider={PROVIDER_DEFAULT}
              initialRegion={VANCOUVER_REGION}
              onPress={handleMapPress}
              showsUserLocation
              showsMyLocationButton
              onMapReady={() => setMapReady(true)}
              loadingEnabled
              loadingIndicatorColor="#673ab7"
              loadingBackgroundColor="#ffffff"
            >
              {selectedLocations.map((location) => (
                <Marker
                  key={location.id}
                  coordinate={{
                    latitude: Number(location.latitude),
                    longitude: Number(location.longitude),
                  }}
                  title={location.title}
                  description={location.description}
                  pinColor={WELLNESS_TYPES[location.type].color}
                  onCalloutPress={() => removeLocation(location.id)}
                />
              ))}
            </MapView>
          </View>

          <View style={styles.typeSelector}>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.typeSelectorContent}
            >
              {Object.entries(WELLNESS_TYPES).map(([type, data]) => (
                <TouchableOpacity
                  key={type}
                  style={[
                    styles.typeButton,
                    selectedLocationType === type && styles.selectedType,
                    { backgroundColor: data.color }
                  ]}
                  onPress={() => setSelectedLocationType(type)}
                >
                  <Text style={styles.typeButtonText}>
                    {data.icon} {data.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              onPress={() => setModalVisible(false)}
              style={[styles.button, styles.cancelButton]}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              onPress={resetToVancouver}
              style={[styles.button, styles.locationButton]}
            >
              <Text style={styles.buttonText}>📍 Vancouver</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              onPress={handleConfirmLocations}
              style={[styles.button, styles.confirmButton]}
              disabled={selectedLocations.length === 0}
            >
              <Text style={styles.buttonText}>Confirm</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  locationButton: {
    backgroundColor: '#673ab7',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  locationButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  mapContainer: {
    flex: 1,
    overflow: 'hidden',
  },
  map: {
    flex: 1,
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    zIndex: 1,
  },
  typeSelector: {
    position: 'absolute',
    top: 20,
    left: 0,
    right: 0,
    paddingHorizontal: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  typeSelectorContent: {
    paddingVertical: 10,
  },
  typeButton: {
    padding: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    marginHorizontal: 5,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  selectedType: {
    transform: [{ scale: 1.1 }],
    borderWidth: 2,
    borderColor: '#fff',
  },
  typeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 15,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  button: {
    padding: 10,
    borderRadius: 5,
    width: '30%',
  },
  cancelButton: {
    backgroundColor: '#e57373',
  },
  confirmButton: {
    backgroundColor: '#81c784',
  },
  locationButton: {
    backgroundColor: '#64b5f6',
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
  },
});