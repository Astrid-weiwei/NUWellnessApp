import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, Alert, ActivityIndicator } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';

// Define wellness location types with their respective icons and colors
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
  const [currentLocation, setCurrentLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedLocationType, setSelectedLocationType] = useState('GYM');
  const mapRef = React.useRef(null);

  useEffect(() => {
    getCurrentLocation();
  }, []);

  const getCurrentLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      setErrorMsg('Permission to access location was denied');
      Alert.alert(
        'Location Permission Required',
        'Please enable location services to use this feature',
        [{ text: 'OK' }]
      );
      return;
    }

    try {
      setLoading(true);
      // Request location with high accuracy and timeout
      let location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.BestForNavigation,
        timeInterval: 1000,
        distanceInterval: 1,
      });
      
      const currentLoc = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };
      setCurrentLocation(currentLoc);
    } catch (error) {
      setErrorMsg('Error getting location');
      Alert.alert('Error', 'Unable to get your current location. Please check your GPS settings.');
    } finally {
      setLoading(false);
    }
  };

  const handleMapPress = async (e) => {
    const newLocation = {
      latitude: e.nativeEvent.coordinate.latitude,
      longitude: e.nativeEvent.coordinate.longitude,
      type: selectedLocationType,
      id: Date.now().toString(), // Unique identifier for each marker
    };
    
    // Get location name
    const locationName = await getLocationName(newLocation.latitude, newLocation.longitude);
    
    setSelectedLocations([...selectedLocations, {
      ...newLocation,
      title: `${WELLNESS_TYPES[selectedLocationType].icon} ${locationName}`
    }]);
  };

  const getLocationName = async (latitude, longitude) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`
      );
      const data = await response.json();
      return data.display_name || 'Selected Location';
    } catch (error) {
      console.error('Error fetching location name:', error);
      return 'Selected Location';
    }
  };

  const handleConfirmLocations = () => {
    if (selectedLocations.length > 0) {
      onLocationSelected(selectedLocations);
      setModalVisible(false);
    }
  };

  const removeLocation = (locationId) => {
    setSelectedLocations(selectedLocations.filter(loc => loc.id !== locationId));
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

          {currentLocation && (
            <>
              <MapView
                ref={mapRef}
                style={styles.map}
                initialRegion={{
                  ...currentLocation,
                  latitudeDelta: 0.02,
                  longitudeDelta: 0.02,
                }}
                onPress={handleMapPress}
                showsUserLocation={true}
                showsMyLocationButton={true}
              >
                {selectedLocations.map((location) => (
                  <Marker
                    key={location.id}
                    coordinate={{
                      latitude: location.latitude,
                      longitude: location.longitude
                    }}
                    pinColor={WELLNESS_TYPES[location.type].color}
                    title={location.title}
                    description={WELLNESS_TYPES[location.type].label}
                    onCalloutPress={() => removeLocation(location.id)}
                  />
                ))}
              </MapView>

              <View style={styles.typeSelector}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
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
            </>
          )}
          
          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              onPress={() => setModalVisible(false)}
              style={[styles.button, styles.cancelButton]}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              onPress={getCurrentLocation}
              style={[styles.button, styles.locationButton]}
            >
              <Text style={styles.buttonText}>📍 Refresh Location</Text>
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
  map: {
    flex: 1,
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
  typeSelector: {
    position: 'absolute',
    top: 20,
    left: 0,
    right: 0,
    paddingHorizontal: 10,
  },
  typeButton: {
    padding: 8,
    borderRadius: 20,
    marginHorizontal: 5,
    opacity: 0.9,
  },
  selectedType: {
    opacity: 1,
    transform: [{ scale: 1.1 }],
  },
  typeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});