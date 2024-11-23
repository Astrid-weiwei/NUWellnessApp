import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

export default function LocationPicker({ onLocationSelected }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);

  const handleConfirmLocation = () => {
    if (selectedLocation) {
      onLocationSelected(selectedLocation);
      setModalVisible(false);
    }
  };

  return (
    <View>
      <TouchableOpacity 
        onPress={() => setModalVisible(true)}
        style={styles.locationButton}
      >
        <Text style={styles.locationButtonText}>
          {selectedLocation ? 'Change Location' : 'Add Location'}
        </Text>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={false}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <MapView
            style={styles.map}
            onPress={(e) => {
              setSelectedLocation({
                latitude: e.nativeEvent.coordinate.latitude,
                longitude: e.nativeEvent.coordinate.longitude,
              });
            }}
            initialRegion={{
              latitude: 37.78825,
              longitude: -122.4324,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
          >
            {selectedLocation && <Marker coordinate={selectedLocation} />}
          </MapView>
          
          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              onPress={() => setModalVisible(false)}
              style={[styles.button, styles.cancelButton]}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              onPress={handleConfirmLocation}
              style={[styles.button, styles.confirmButton]}
              disabled={!selectedLocation}
            >
              <Text style={styles.buttonText}>Confirm Location</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {selectedLocation && (
        <Text style={styles.locationText}>
          Location selected: {selectedLocation.latitude.toFixed(4)}, {selectedLocation.longitude.toFixed(4)}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  locationButton: {
    backgroundColor: '#673ab7',
    padding: 10,
    borderRadius: 5,
    marginVertical: 10,
  },
  locationButtonText: {
    color: '#fff',
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 15,
    backgroundColor: '#fff',
  },
  button: {
    padding: 10,
    borderRadius: 5,
    width: '45%',
  },
  cancelButton: {
    backgroundColor: '#f44336',
  },
  confirmButton: {
    backgroundColor: '#4CAF50',
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
  },
  locationText: {
    marginTop: 5,
    color: '#666',
    textAlign: 'center',
  },
});