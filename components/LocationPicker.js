import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, Alert, ActivityIndicator } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';

export default function LocationPicker({ onLocationSelected }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [loading, setLoading] = useState(false);
  const mapRef = React.useRef(null);

  useEffect(() => {
    (async () => {
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
        let location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        });
        const currentLoc = {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        };
        setCurrentLocation(currentLoc);
      } catch (error) {
        setErrorMsg('Error getting location');
        Alert.alert('Error', 'Unable to get your current location');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleConfirmLocation = () => {
    if (selectedLocation) {
      onLocationSelected(selectedLocation);
      setModalVisible(false);
    }
  };

  const goToCurrentLocation = async () => {
    if (currentLocation) {
      mapRef.current?.animateToRegion({
        ...currentLocation,
        latitudeDelta: 0.02,
        longitudeDelta: 0.02,
      });
    }
  };

  // Function to fetch location name using OpenStreetMap Nominatim
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

  const handleMapPress = async (e) => {
    const newLocation = {
      latitude: e.nativeEvent.coordinate.latitude,
      longitude: e.nativeEvent.coordinate.longitude,
    };
    
    // Get location name when a point is selected
    const locationName = await getLocationName(newLocation.latitude, newLocation.longitude);
    setSelectedLocation({
      ...newLocation,
      title: locationName
    });
  };

  return (
    <>
      <TouchableOpacity 
        onPress={() => setModalVisible(true)}
        style={styles.locationButton}
      >
        <Text style={styles.locationButtonText}>
          {selectedLocation ? '📍 Change Location' : '📍 Add Location'}
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
            <MapView
              ref={mapRef}
              style={styles.map}
              initialRegion={{
                ...currentLocation,
                latitudeDelta: 0.02,
                longitudeDelta: 0.02,
              }}
              onPress={handleMapPress}
            >
              {/* Current location marker */}
              <Marker
                coordinate={currentLocation}
                pinColor="blue"
                title="You are here"
                description="Your current location"
              />

              {/* Selected location marker */}
              {selectedLocation && (
                <Marker
                  coordinate={{
                    latitude: selectedLocation.latitude,
                    longitude: selectedLocation.longitude
                  }}
                  pinColor="red"
                  title={selectedLocation.title}
                  description="Your selected location"
                />
              )}
            </MapView>
          )}
          
          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              onPress={() => setModalVisible(false)}
              style={[styles.button, styles.cancelButton]}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              onPress={goToCurrentLocation}
              style={[styles.button, styles.locationButton]}
            >
              <Text style={styles.buttonText}>📍 My Location</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              onPress={handleConfirmLocation}
              style={[styles.button, styles.confirmButton]}
              disabled={!selectedLocation}
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
});