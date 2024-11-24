import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, Alert, ActivityIndicator, ScrollView } from 'react-native';
import MapView, { Marker, PROVIDER_DEFAULT } from 'react-native-maps';
import * as Location from 'expo-location';
import { WELLNESS_TYPES } from '../constants/wellness';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Vancouver coordinates
const VANCOUVER_REGION = {
  latitude: 49.2827,
  longitude: -123.1207,
  latitudeDelta: 0.05,
  longitudeDelta: 0.05,
};

// Cache common Vancouver areas
const VANCOUVER_AREAS_CACHE = {
  // Vancouver
  'downtown': {
    bounds: { minLat: 49.277, maxLat: 49.289, minLng: -123.138, maxLng: -123.108 },
    name: 'Downtown Vancouver'
  },
  'west_end': {
    bounds: { minLat: 49.280, maxLat: 49.290, minLng: -123.149, maxLng: -123.129 },
    name: 'West End'
  },
  'yaletown': {
    bounds: { minLat: 49.269, maxLat: 49.279, minLng: -123.128, maxLng: -123.115 },
    name: 'Yaletown'
  },
  'gastown': {
    bounds: { minLat: 49.282, maxLat: 49.285, minLng: -123.112, maxLng: -123.104 },
    name: 'Gastown'
  },
  'coal_harbour': {
    bounds: { minLat: 49.287, maxLat: 49.292, minLng: -123.130, maxLng: -123.118 },
    name: 'Coal Harbour'
  },
  'kitsilano': {
    bounds: { minLat: 49.259, maxLat: 49.272, minLng: -123.185, maxLng: -123.148 },
    name: 'Kitsilano'
  },
  'mount_pleasant': {
    bounds: { minLat: 49.257, maxLat: 49.268, minLng: -123.113, maxLng: -123.077 },
    name: 'Mount Pleasant'
  },
  'false_creek': {
    bounds: { minLat: 49.265, maxLat: 49.273, minLng: -123.134, maxLng: -123.105 },
    name: 'False Creek'
  },
  'west_point_grey': {
    bounds: { minLat: 49.261, maxLat: 49.276, minLng: -123.209, maxLng: -123.185 },
    name: 'West Point Grey'
  },

  // North Vancouver
  'lower_lonsdale': {
    bounds: { minLat: 49.308, maxLat: 49.315, minLng: -123.082, maxLng: -123.071 },
    name: 'Lower Lonsdale'
  },
  'lynn_valley': {
    bounds: { minLat: 49.337, maxLat: 49.352, minLng: -123.047, maxLng: -123.019 },
    name: 'Lynn Valley'
  },

  // Burnaby
  'metrotown': {
    bounds: { minLat: 49.223, maxLat: 49.232, minLng: -123.008, maxLng: -122.997 },
    name: 'Metrotown'
  },
  'brentwood': {
    bounds: { minLat: 49.265, maxLat: 49.272, minLng: -123.002, maxLng: -122.989 },
    name: 'Brentwood'
  },
  'burnaby_heights': {
    bounds: { minLat: 49.281, maxLat: 49.289, minLng: -123.022, maxLng: -122.999 },
    name: 'Burnaby Heights'
  },

  // Richmond
  'steveston': {
    bounds: { minLat: 49.121, maxLat: 49.134, minLng: -123.195, maxLng: -123.176 },
    name: 'Steveston'
  },
  'richmond_centre': {
    bounds: { minLat: 49.163, maxLat: 49.172, minLng: -123.144, maxLng: -123.130 },
    name: 'Richmond Centre'
  },

  // Surrey
  'surrey_central': {
    bounds: { minLat: 49.186, maxLat: 49.194, minLng: -122.851, maxLng: -122.837 },
    name: 'Surrey Central'
  },
  'guildford': {
    bounds: { minLat: 49.187, maxLat: 49.195, minLng: -122.805, maxLng: -122.789 },
    name: 'Guildford'
  },
  'fleetwood': {
    bounds: { minLat: 49.152, maxLat: 49.167, minLng: -122.799, maxLng: -122.773 },
    name: 'Fleetwood'
  },

  // New Westminster
  'downtown_new_west': {
    bounds: { minLat: 49.199, maxLat: 49.206, minLng: -122.915, maxLng: -122.905 },
    name: 'Downtown New Westminster'
  },
  'queensborough': {
    bounds: { minLat: 49.181, maxLat: 49.191, minLng: -122.953, maxLng: -122.930 },
    name: 'Queensborough'
  },

  // Coquitlam
  'coquitlam_centre': {
    bounds: { minLat: 49.274, maxLat: 49.283, minLng: -122.802, maxLng: -122.789 },
    name: 'Coquitlam Centre'
  },
  'port_coquitlam': {
    bounds: { minLat: 49.256, maxLat: 49.266, minLng: -122.775, maxLng: -122.755 },
    name: 'Port Coquitlam'
  },

  // Port Moody
  'port_moody_centre': {
    bounds: { minLat: 49.276, maxLat: 49.284, minLng: -122.866, maxLng: -122.825 },
    name: 'Port Moody'
  },

  // West Vancouver
  'park_royal': {
    bounds: { minLat: 49.321, maxLat: 49.327, minLng: -123.140, maxLng: -123.128 },
    name: 'Park Royal'
  },
  'horseshoe_bay': {
    bounds: { minLat: 49.369, maxLat: 49.377, minLng: -123.279, maxLng: -123.269 },
    name: 'Horseshoe Bay'
  },

  // Delta
  'tsawwassen': {
    bounds: { minLat: 49.002, maxLat: 49.018, minLng: -123.090, maxLng: -123.074 },
    name: 'Tsawwassen'
  },
  'ladner': {
    bounds: { minLat: 49.084, maxLat: 49.094, minLng: -123.088, maxLng: -123.075 },
    name: 'Ladner'
  },

  // White Rock
  'white_rock': {
    bounds: { minLat: 49.015, maxLat: 49.025, minLng: -122.806, maxLng: -122.785 },
    name: 'White Rock'
  },

  // Langley
  'langley_city': {
    bounds: { minLat: 49.100, maxLat: 49.108, minLng: -122.666, maxLng: -122.650 },
    name: 'Langley City'
  },
  'walnut_grove': {
    bounds: { minLat: 49.163, maxLat: 49.172, minLng: -122.645, maxLng: -122.625 },
    name: 'Walnut Grove'
  },

  // Maple Ridge
  'maple_ridge': {
    bounds: { minLat: 49.215, maxLat: 49.224, minLng: -122.605, maxLng: -122.588 },
    name: 'Maple Ridge'
  },
  'pitt_meadows': {
    bounds: { minLat: 49.221, maxLat: 49.229, minLng: -122.695, maxLng: -122.676 },
    name: 'Pitt Meadows'
  }
};

const isInBounds = (lat, lng, bounds) => {
  return lat >= bounds.minLat && 
         lat <= bounds.maxLat && 
         lng >= bounds.minLng && 
         lng <= bounds.maxLng;
};

const getLocationNameFromCache = (latitude, longitude) => {
  for (const [area, data] of Object.entries(VANCOUVER_AREAS_CACHE)) {
    if (isInBounds(latitude, longitude, data.bounds)) {
      return data.name;
    }
  }
  return null;
};

const CACHE_KEY = 'locationNameCache';
let locationCache = new Map();

const loadCache = async () => {
  try {
    const cached = await AsyncStorage.getItem(CACHE_KEY);
    if (cached) {
      locationCache = new Map(JSON.parse(cached));
    }
  } catch (error) {
    console.warn('Error loading location cache:', error);
  }
};

const saveCache = async () => {
  try {
    await AsyncStorage.setItem(CACHE_KEY, JSON.stringify([...locationCache]));
  } catch (error) {
    console.warn('Error saving location cache:', error);
  }
};

const getCacheKey = (lat, lng) => {
  const roundedLat = Math.round(lat * 1000) / 1000;
  const roundedLng = Math.round(lng * 1000) / 1000;
  return `${roundedLat},${roundedLng}`;
};

const fetchLocationName = async (latitude, longitude) => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
      {
        headers: {
          'User-Agent': 'MoodTrackerApp/1.0',
          'Accept-Language': 'en'
        }
      }
    );

    if (!response.ok) {
      throw new Error('Location service unavailable');
    }

    const data = await response.json();
    let locationName = 'Selected Location';

    if (data.address) {
      const { road, neighbourhood, suburb, city } = data.address;
      locationName = [road, neighbourhood, suburb, city]
        .filter(Boolean)
        .slice(0, 2)
        .join(', ') || 'Selected Location';
    }

    return locationName;
  } catch (error) {
    console.warn('Error fetching location name:', error);
    return 'Selected Location';
  }
};

const getLocationName = async (latitude, longitude) => {
  // First check predefined areas
  const areaName = getLocationNameFromCache(latitude, longitude);
  if (areaName) {
    return areaName;
  }

  // Then check cached locations
  const cacheKey = getCacheKey(latitude, longitude);
  const cachedName = locationCache.get(cacheKey);
  if (cachedName) {
    return cachedName;
  }

  // If not in cache, fetch from API
  const locationName = await fetchLocationName(latitude, longitude);
  
  // Cache the result
  locationCache.set(cacheKey, locationName);
  saveCache();

  return locationName;
};

const LocationPicker = ({ onLocationSelected }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [currentLocation, setCurrentLocation] = useState(VANCOUVER_REGION);
  const [loading, setLoading] = useState(false);
  const [selectedLocationType, setSelectedLocationType] = useState('GYM');
  const [mapReady, setMapReady] = useState(false);
  const mapRef = React.useRef(null);

  useEffect(() => {
    (async () => {
      await loadCache();
      await getCurrentLocation();
    })();
  }, []);

  const getCurrentLocation = async () => {
    try {
      setLoading(true);
      const { status } = await Location.requestForegroundPermissionsAsync();
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
      
      if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
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

  const handleConfirmLocations = () => {
    try {
      const validLocations = selectedLocations.map(location => ({
        ...location,
        latitude: Number(location.latitude),
        longitude: Number(location.longitude),
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

  const handleMarkerPress = (locationId) => {
    Alert.alert(
      'Delete Location',
      'Do you want to remove this location?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete',
          onPress: () => removeLocation(locationId),
          style: 'destructive'
        }
      ]
    );
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
                  title={WELLNESS_TYPES[location.type].label}
                  description="Tap to delete"
                  pinColor={WELLNESS_TYPES[location.type].color}
                  onPress={() => handleMarkerPress(location.id)}
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
};

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
    top: 60,
    left: 0,
    right: 0,
    paddingHorizontal: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
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
    borderWidth: 2,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4.84,
    elevation: 4,
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

export default LocationPicker;