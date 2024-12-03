import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { logoutUser } from "../firebaseService";

export default function Header({ title, navigation }) {
  const handleLogout = async () => {
    try {
      await logoutUser();
      navigation.replace("Login");
    } catch (error) {
      console.error("Logout failed:", error.message);
    }
  };

  return (
    <View style={styles.header}>
      <Text style={styles.title}>{title}</Text>
      <TouchableOpacity onPress={handleLogout}>
        <Text style={styles.logout}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#673ab7",
  },
  title: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  logout: {
    color: "#fff",
    fontSize: 16,
  },
});
