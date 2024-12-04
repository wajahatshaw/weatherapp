import axios from "axios";

const API_KEY = process.env.EXPO_PUBLIC_WEATHER_API_KEY;
const BASE_URL = "https://api.openweathermap.org/data/2.5/";

export const fetchWeatherByCity = async (city: string) => {
  const response = await axios.get(
    `${BASE_URL}weather?q=${city}&appid=${API_KEY}`
  );
  return response.data;
};

export const fetchWeatherByCoords = async (lat: number, lng: number) => {
  const response = await axios.get(
    `${BASE_URL}weather?lat=${lat}&lon=${lng}&appid=${API_KEY}`
  );
  return response.data;
};
