import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { useSelector } from "react-redux";
import { fetchWeatherByCity } from "../utils/weatherApi";
import dayjs from "dayjs";
import { RootState } from "../redux/store";

const DetailsScreen = ({ route }: any) => {
  const { city } = route.params;
  const [weather, setWeather] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const unit = useSelector((state: RootState) => state.unit);

  useEffect(() => {
    const getWeather = async () => {
      setLoading(true);
      try {
        const data = await fetchWeatherByCity(city);
        setWeather(data);
      } catch (error) {
        alert("Error fetching weather details.");
      }
      setLoading(false);
    };
    getWeather();
  }, [city]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#75b4e3" />
      </View>
    );
  }

  if (!weather) return null;

  const convertTemperature = (kelvin: number) => {
    if (unit === "celsius") {
      return Math.round(kelvin - 273.15); // Kelvin to Celsius
    } else if (unit === "fahrenheit") {
      return Math.round((kelvin - 273.15) * 1.8 + 32); // Kelvin to Fahrenheit
    }
    return 0;
  };

  const temperature = convertTemperature(weather.main.temp);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <Text style={styles.iconText}>☁️</Text>
          </View>
          <View>
            <Text style={styles.cityName}>{city}</Text>
            <Text style={styles.description}>
              {weather.weather[0]?.description}
            </Text>
          </View>
        </View>
        <Text style={styles.temperature}>
          {temperature}°{unit === "celsius" ? "C" : "F"}
        </Text>
        <View style={styles.row}>
          <Text style={styles.label}>Humidity:</Text>
          <Text style={styles.value}>{weather.main.humidity}%</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Wind Speed:</Text>
          <Text style={styles.value}>{weather.wind.speed} m/s</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Sunrise:</Text>
          <Text style={styles.value}>
            {dayjs.unix(weather.sys.sunrise).format("h:mm A")}
          </Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Sunset:</Text>
          <Text style={styles.value}>
            {dayjs.unix(weather.sys.sunset).format("h:mm A")}
          </Text>
        </View>
      </View>
      <TouchableOpacity
        style={styles.button}
        onPress={() => alert("More features coming soon!")}
      >
        <Text style={styles.buttonText}>Explore More</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: "#F5F5F5",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    marginVertical: 16,
    padding: 16,
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#75b4e3",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  iconText: {
    fontSize: 24,
    color: "white",
  },
  cityName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  description: {
    fontSize: 16,
    color: "#555",
  },
  temperature: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#2196F3",
    marginBottom: 16,
    textAlign: "center",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
  },
  value: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#555",
  },
  button: {
    marginTop: 16,
    backgroundColor: "#75b4e3",
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

export default DetailsScreen;
