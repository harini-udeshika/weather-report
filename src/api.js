import axios from 'axios';

const weatherApiKey = import.meta.env.VITE_WEATHER_API_KEY;
// const googlePlacesApiKey = import.meta.env.VITE_GOOGLE_PLACES_API_KEY;
const baseWeatherApiUrl = "http://api.weatherapi.com/v1/current.json?key=" + weatherApiKey + "&q=";

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
