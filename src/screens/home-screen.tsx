import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Linking,
} from "react-native";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import * as Location from "expo-location";
import { useNavigation } from "@react-navigation/native";

interface NavigationParams {
  navigate: (screen: string, params?: any) => void;
}

const GOOGLE_PLACES_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_PLACES_API_KEY;

const HomeScreen = () => {
  const navigation = useNavigation<NavigationParams>();
  const [loading, setLoading] = useState(false);

  const handleLocationSelect = (data: any, details: any) => {
    const city = details?.address_components?.find((component: any) =>
      component.types.includes("locality")
    )?.long_name;

    if (city) {
      navigation.navigate("Details", { city });
    } else {
      Alert.alert(
        "Error",
        "Unable to determine city from selection. Try another location."
      );
    }
  };

  const handleCurrentLocation = async () => {
    setLoading(true);

    try {
      // Request permissions
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status === "granted") {
        // Fetch current location
        const location = await Location.getCurrentPositionAsync({});
        const { latitude, longitude } = location.coords;

        // Reverse geocode to get city name
        const geocode = await Location.reverseGeocodeAsync({
          latitude,
          longitude,
        });

        const city = geocode[0]?.city;

        if (city) {
          navigation.navigate("Details", { city });
        } else {
          Alert.alert("Error", "Unable to determine city from your location.");
        }
      } else if (status === "denied") {
        Alert.alert(
          "Permission Required",
          "Location permissions are required to fetch your location. Please enable them in settings.",
          [
            { text: "Cancel", style: "cancel" },
            { text: "Open Settings", onPress: () => Linking.openSettings() },
          ]
        );
      }
    } catch (error) {
      Alert.alert("Error", "Failed to fetch location. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const navigateToSettings = () => {
    navigation.navigate("Settings");
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Weather App</Text>
        <TouchableOpacity
          style={styles.settingsButton}
          onPress={navigateToSettings}
        >
          <Text style={styles.settingsButtonText}>Settings</Text>
        </TouchableOpacity>
      </View>
      <GooglePlacesAutocomplete
        placeholder="Search for a city..."
        minLength={2}
        fetchDetails
        query={{
          key: GOOGLE_PLACES_API_KEY,
          language: "en",
        }}
        onPress={handleLocationSelect}
        styles={{
          textInput: styles.searchInput,
          predefinedPlacesDescription: styles.suggestion,
          listView: styles.listView,
        }}
      />
      <TouchableOpacity
        style={styles.locationButton}
        onPress={handleCurrentLocation}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <Text style={styles.buttonText}>Use Current Location</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#F5F5F5",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
  },
  settingsButton: {
    backgroundColor: "#2196F3",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  settingsButtonText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "white",
  },
  searchInput: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    fontSize: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: "#DDD",
  },
  suggestion: {
    fontSize: 16,
    color: "#555",
  },
  listView: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    marginTop: 8,
  },
  locationButton: {
    marginVertical: 20,
    backgroundColor: "#2196F3",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
  },
});

export default HomeScreen;
