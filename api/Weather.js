import axios from "axios";
import { apiKey } from "../constants";

const forecastEndpoint = ({ cityName, lat, lon, days = 7 }) => {
  const query = cityName ? cityName : `${lat},${lon}`;
  return `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${query}&days=${days}&aqi=no&alerts=no`;
};


const locationEndpoint = (query) =>
  `https://api.weatherapi.com/v1/search.json?key=${apiKey}&q=${query}`;

const apiCall = async (endpoint) => {
  try {
    const response = await axios.get(endpoint);
    return response.data;
  } catch (error) {
    console.error(`Error fetching data from ${endpoint}:`, error.message);
    throw error;
  }
};

export const fetchWeatherForecast = (params) => {
  return apiCall(forecastEndpoint(params));
};

export const fetchLocations = (query) => {
  return apiCall(locationEndpoint(query));
};
