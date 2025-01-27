import React, { useState, useCallback, useEffect } from "react";
import {
  SafeAreaView,
  View,
  Text,
  Image,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from "react-native";
import { debounce } from "lodash";
import { fetchLocations, fetchWeatherForecast } from "../api/Weather";
import { weatherImages } from "../constants/index";
import * as Progress from "react-native-progress";
import Geolocation from "react-native-geolocation-service";
import { storeData, retrieveData } from "../utils/asyncStorage";
import * as Location from "expo-location";
import { useNavigation } from "@react-navigation/native";


import {
  CalendarDaysIcon,
  MagnifyingGlassIcon,
  Cog6ToothIcon,
} from "react-native-heroicons/outline";
import { MapPinIcon } from "react-native-heroicons/solid";

const HomeScreen = () => {

  const navigation = useNavigation();

  const [showSearch, toggleSearch] = useState(false);
  const [locations, setLocations] = useState([]);
  const [weather, setWeather] = useState();
  const [loading, setLoading] = useState(true);

  const getCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        throw new Error("Permission to access location was denied");
      }

      const location = await Location.getCurrentPositionAsync({});
      return {
        lat: location.coords.latitude,
        lon: location.coords.longitude,
      };
    } catch (error) {
      console.error("Error getting location:", error.message);
      throw error;
    }
  };

  const fetchMyWeatherData = async () => {
    setLoading(true);

    try {
      let myCity = await retrieveData("city");
      let weatherData;

      if (myCity) {
        // Fetch weather by city name
        weatherData = await fetchWeatherForecast({ cityName: myCity, days: 7 });
      } else {
        // Fetch weather by user's current location
        const { lat, lon } = await getCurrentLocation();
        weatherData = await fetchWeatherForecast({ lat, lon, days: 7 });
      }

      setWeather(weatherData);
    } catch (error) {
      console.error("Error fetching weather data:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLocation = (loc) => {
    setLocations([]);
    toggleSearch(false);
    setLoading(true);

    fetchWeatherForecast({
      cityName: loc.name,
      days: 7,
    }).then((data) => {
      setWeather(data);
      setLoading(false);
      storeData("city", loc.name);
    });
  };

  const handleSearch = (value) => {
    if (value.trim() === "") return;
    if (value.length > 0) {
      fetchLocations(value).then((data) => {
        setLocations(data);
      });
    }
  };

  useEffect(() => {
    fetchMyWeatherData();
  }, []);

  const getWeatherIcon = (condition) => {
    const weatherIcon = weatherImages[condition] || weatherImages["Other"];
    return weatherIcon;
  };

  const handleTextDebounce = useCallback(debounce(handleSearch, 1500), []);

  return (
    <View className={"flex-1 relative"}>
      <Image
        source={require("../assets/images/bg.png")}
        className={"absolute w-full h-full object-cover"}
        blurRadius={50}
      />

      {loading ? (
        <View className={"flex-row justify-center items-center flex-1"}>
          <Progress.CircleSnail
            thickness={10}
            color={"#0bb3b2"}
            size={100}
            duration={1000}
            indeterminate={true}
          />
        </View>
      ) : (
        <>
          <View className="flex-row items-center justify-between relative z-10 mt-20">
            {/* Search bar */}
            <View className="flex-1 justify-end items-end p-4">
              <View className="flex-row items-center rounded-full gap-2 shadow-lg">
                {showSearch ? (
                  <TextInput
                    onChangeText={handleTextDebounce}
                    placeholderTextColor={"lightgray"}
                    placeholder={"Search City"}
                    style={{ backgroundColor: "rgba(255,255,255,0.2)" }}
                    className="pl-6 h-14 flex-row items-center text-base text-white flex-1 rounded-full shadow-lg"
                  />
                ) : null}
                {/* Search Button */}
                <View
                  style={{ backgroundColor: "rgba(255,255,255,0.2)" }}
                  className="flex-row items-center rounded-full shadow-lg"
                >
                  <TouchableOpacity
                    onPress={() => toggleSearch(!showSearch)}
                    style={{ backgroundColor: "rgba(255,255,255,0.3)" }}
                    className="rounded-full flex items-center justify-center m-1 p-2"
                  >
                    <MagnifyingGlassIcon size={29} color={"white"} />
                  </TouchableOpacity>
                </View>

                {/* Settings Button */}
                <View
                  style={{ backgroundColor: "rgba(255,255,255,0.2)" }}
                  className="flex-row items-center rounded-full shadow-lg"
                >
                  {!showSearch ? (
                    <TouchableOpacity
                      onPress={() => navigation.navigate("Settings")}
                      style={{ backgroundColor: "rgba(255,255,255,0.3)" }}
                      className="rounded-full flex items-center justify-center m-1 p-2"
                    >
                      <Cog6ToothIcon size={29} color={"white"} />
                    </TouchableOpacity>
                  ) : null}
                </View>
              </View>

              {locations.length > 0 && showSearch ? (
                <View className="absolute w-[100%] bg-gray-300 top-24 rounded-3xl">
                  {locations.map((location, index) => {
                    let showBorder = index !== locations.length - 1;
                    let borderClass = showBorder
                      ? "border-b-2 border-b-gray-400"
                      : "";
                    return (
                      <TouchableOpacity
                        key={location.id}
                        onPress={() => handleLocation(location)}
                        className={`flex-row items-center border-0 p-3 px-4 mb-1 rounded-3xl hover:bg-gray-400 ${borderClass}`}
                      >
                        <MapPinIcon size={20} color={"red"} />
                        <Text className="ml-2 text-lg text-black">
                          {location.name}, {location.country}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              ) : null}
            </View>
          </View>

          <ScrollView
            className={"flex"}
            contentContainerStyle={{ flexGrow: 1, paddingBottom: 70 }}
          >
            {/* Weather Details */}
            {weather && (
              <View className={"mx-4 flex justify-evenly flex-1 mb-2"}>
                {/* Location */}
                <View className={"flex-row justify-center items-baseline"}>
                  <Text
                    className={
                      " text-center text-white text-3xl font-bold my-10"
                    }
                  >
                    {weather.location.name},
                  </Text>
                  <Text
                    className={"text-gray-300 text-xl font-semibold"}
                    style={{ marginHorizontal: 8 }}
                  >
                    {weather.location.country}
                  </Text>
                </View>

                {/* Weather Image */}
                <View className={"flex-row justify-center my-4"}>
                  <Image
                    source={getWeatherIcon(weather.current.condition.text)}
                    className={"w-56 h-56"}
                  />
                </View>

                {/* Weather Details */}
                <View className={"flex-col justify-center my-4"}>
                  {/* Degree Celsius */}
                  <View className={"  space-y-2"}>
                    <Text
                      className={
                        "text-center text-white text-8xl font-bold mt-5"
                      }
                    >
                      {weather.current.temp_c}&#176;
                    </Text>
                  </View>

                  {/* Weather Description */}
                  <View className={" space-y-2 mb-6 items-center"}>
                    <Text
                      className={
                        "text-center text-white text-2xl tracking-widest"
                      }
                    >
                      {weather.current.condition.text}
                    </Text>
                  </View>
                </View>

                {/* Other Details */}
                <View
                  className={"flex-row justify-around items-center m-4 mt-10"}
                >
                  {/* Wind */}
                  <View className={"flex-row items-center space-x-4"}>
                    <Image
                      source={require("../assets/icons/wind.png")}
                      className={"w-7 h-7"}
                    />
                    <Text className={"text-white text-lg font-semibold ml-3"}>
                      {weather.current.wind_kph} km/h
                    </Text>
                  </View>

                  {/* Humidity */}
                  <View className={"flex-row items-center space-x-2"}>
                    <Image
                      source={require("../assets/icons/drop.png")}
                      className={"w-7 h-7"}
                    />
                    <Text className={"text-white text-lg font-semibold ml-3"}>
                      {weather.current.humidity}%
                    </Text>
                  </View>

                  {/* Sunrise */}
                  <View className={"flex-row items-center space-x-2"}>
                    <Image
                      source={require("../assets/icons/sun.png")}
                      className={"w-7 h-7"}
                    />
                    <Text className={"text-white text-lg font-semibold ml-3"}>
                      {weather.forecast.forecastday[0].astro.sunrise}
                    </Text>
                  </View>
                </View>
              </View>
            )}

            {/* Upcoming Forecast */}
            {weather && (
              <View className={" mb-2 space-y-3"}>
                <View className={"flex-row items-center mx-5 space-x-2"}>
                  <CalendarDaysIcon size={22} color={"white"} />
                  <Text className={"text-white text-lg font-semibold ml-2"}>
                    Daily Forecast
                  </Text>
                </View>
                <ScrollView
                  horizontal={true}
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{
                    paddingHorizontal: 15,
                    paddingVertical: 15,
                  }}
                >
                  {weather.forecast.forecastday.map((day, index) => (
                    <View
                      key={index}
                      className={
                        "flex justify-center items-center w-32 rounded-3xl px-4 py-3 space-y-1 mr-4"
                      }
                      style={{ backgroundColor: "rgba(255,255,255,0.15)" }}
                    >
                      <Image
                        source={getWeatherIcon(day.day.condition.text)}
                        className={"w-16 h-16"}
                      />
                      <Text
                        className={
                          "text-white text-center text-lg font-semibold"
                        }
                      >
                        {new Date(day.date).toLocaleDateString("en-US", {
                          weekday: "long",
                        })}
                      </Text>
                      <Text
                        className={
                          "text-center text-white text-sm font-semibold"
                        }
                      >
                        {day.day.condition.text}
                      </Text>
                      <Text
                        className={
                          "text-white text-center text-lg font-semibold"
                        }
                      >
                        {day.day.avgtemp_c}&#176;
                      </Text>
                    </View>
                  ))}
                </ScrollView>
              </View>
            )}
          </ScrollView>
        </>
      )}
    </View>
  );
};

export default HomeScreen;
