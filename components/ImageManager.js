import React, { useState } from 'react';
import { View, Button, Image, Alert, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

export default function ImageManager({ onImageTaken }) {
  const [imageUri, setImageUri] = useState(null);

  const verifyPermissions = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Camera permissions are required to use this feature.');
      return false;
    }
    return true;
  };

  const takeImageHandler = async () => {
    const hasPermission = await verifyPermissions();
    if (!hasPermission) return;

    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
      });

      if (!result.canceled) {
        const imageUri = result.assets[0].uri;
        setImageUri(imageUri);
        onImageTaken(imageUri);
      }
    } catch (error) {
      console.error('Error launching camera:', error.message);
      Alert.alert('Error', 'Camera is not available on the simulator. Please use a physical device.');
    }
  };

  return (
    <View style={styles.container}>
      <Button title="Take Photo" onPress={takeImageHandler} />
      {imageUri && (
        <>
          <Image source={{ uri: imageUri }} style={styles.imagePreview} />
          <Button title="Retake Photo" onPress={() => setImageUri(null)} />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', margin: 10 },
  imagePreview: { width: 200, height: 200, marginTop: 10, borderRadius: 10 },
});
