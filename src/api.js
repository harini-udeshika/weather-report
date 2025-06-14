import axios from 'axios';

const weatherApiKey = import.meta.env.VITE_WEATHER_API_KEY;
const ipinfoKey=import.meta.env.VITE_IPINFO_KEY
// const googlePlacesApiKey = import.meta.env.VITE_GOOGLE_PLACES_API_KEY;
const baseWeatherApiUrl = "https://api.weatherapi.com/v1/forecast.json?key=" + weatherApiKey + "&q=";

export const getWeather = async (location) => {
  try {
    console.log(weatherApiKey, "weatherApiKey")
    if (!weatherApiKey) {
      throw new Error("WEATHER_API_KEY is not defined. Please set it in your environment variables.");
    }
    const response = await axios.get(baseWeatherApiUrl + location);
    return response.data;
  } catch (error) {
    console.error("Error fetching weather data:", error);
    throw error;
  }
}

export const getLocation = async () => {
  try {
    const response = await fetch('https://ipapi.co/json/');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching location", error);
    throw error;
  }
};