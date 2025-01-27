import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Switch,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  ArrowLongLeftIcon,
  ChevronDownIcon,
  ChevronRightIcon,
} from "react-native-heroicons/solid";
import { useNavigation } from "@react-navigation/native";

const Settings = () => {
  const navigation = useNavigation();

  const [temperatureUnit, setTemperatureUnit] = useState("celsius");
  const [speedUnit, setSpeedUnit] = useState("kmh");
  const [pressureUnit, setPressureUnit] = useState("mbar");
  const [isTempDropdownOpen, setTempDropdownOpen] = useState(false);
  const [isSpeedDropdownOpen, setSpeedDropdownOpen] = useState(false);
  const [isPressureDropdownOpen, setPressureDropdownOpen] = useState(false);
  const [updateAutomatically, setUpdateAutomatically] = useState(false);

  const loadPreferences = async () => {
    const tempUnit = await AsyncStorage.getItem("tempUnit");
    const speedUnit = await AsyncStorage.getItem("speedUnit");
    const pressureUnit = await AsyncStorage.getItem("pressureUnit");
    const updateAuto = await AsyncStorage.getItem("updateAutomatically");

    if (tempUnit) setTemperatureUnit(tempUnit);
    if (speedUnit) setSpeedUnit(speedUnit);
    if (pressureUnit) setPressureUnit(pressureUnit);
    if (updateAuto) setUpdateAutomatically(JSON.parse(updateAuto));
  };

  const savePreferences = async () => {
    await AsyncStorage.setItem("tempUnit", temperatureUnit);
    await AsyncStorage.setItem("speedUnit", speedUnit);
    await AsyncStorage.setItem("pressureUnit", pressureUnit);
    await AsyncStorage.setItem(
      "updateAutomatically",
      JSON.stringify(updateAutomatically)
    );
  };

  useEffect(() => {
    loadPreferences();
  }, []);

  useEffect(() => {
    savePreferences();
  }, [temperatureUnit, speedUnit, pressureUnit, updateAutomatically]);

  const Dropdown = ({ title, value, options, onChange, isOpen, setOpen }) => (
    <View className="mb-4 flex">
      {/* Dropdown Header */}
      <TouchableOpacity
        className="flex-row items-center justify-between py-3 px-4"
        onPress={() => setOpen(!isOpen)}
      >
        <Text className="text-white text-lg">{title}</Text>
        <View className="flex-row items-center">
          <Text className="text-gray-400 mr-2">{value}</Text>
          <ChevronDownIcon size={20} color="#ffffff" />
        </View>
      </TouchableOpacity>

      {/* Dropdown Options */}
      {isOpen && (
        <View
          className="absolute w-[40%] bg-gray-600 rounded-lg mt-4 z-50"
          style={{
            justifyContent: "flex-end",
            alignSelf: "flex-end",
            marginTop: 40,
            maxHeight: 200,
            overflow: "hidden",
          }}
        >
          <ScrollView
            style={{ maxHeight: 200 }}
            contentContainerStyle={{
              paddingVertical: 4,
            }}
          >
            {options.map((option) => (
              <TouchableOpacity
                key={option.value}
                className={`p-3 rounded-md ${
                  value === option.value ? "bg-gray-600" : "hover:bg-gray-800"
                }`}
                onPress={() => {
                  onChange(option.value);
                  setOpen(false);
                }}
              >
                <Text
                  className={`text-white text-base ${
                    value === option.value ? "font-bold" : "font-normal"
                  }`}
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );

  return (
    <View className="flex-1 bg-black">
      <SafeAreaView className="flex-1 mt-14 p-8">
        {/* Header */}
        <View className="items-start justify-start mb-10">
          <TouchableOpacity
            onPress={() => {
              navigation.goBack();
            }}
          >
            <ArrowLongLeftIcon size={28} color="#ffffff" />
          </TouchableOpacity>
          <Text className="text-white text-3xl font-bold mt-4">Settings</Text>
        </View>

        {/* Units Section */}
        <View className="mb-8">
          <Text className="text-gray-400 mb-4 text-base">Units</Text>
          <Dropdown
            title="Temperature Units"
            value={temperatureUnit === "celsius" ? "°C" : "°F"}
            options={[
              { label: "Celsius (°C)", value: "celsius" },
              { label: "Fahrenheit (°F)", value: "fahrenheit" },
            ]}
            onChange={setTemperatureUnit}
            isOpen={isTempDropdownOpen}
            setOpen={setTempDropdownOpen}
          />
          <Dropdown
            title="Wind Speed Units"
            value={speedUnit === "kmh" ? "km/h" : "mph"}
            options={[
              { label: "Kilometers per hour (km/h)", value: "kmh" },
              { label: "Miles per hour (mph)", value: "mph" },
            ]}
            onChange={setSpeedUnit}
            isOpen={isSpeedDropdownOpen}
            setOpen={setSpeedDropdownOpen}
          />
          <Dropdown
            title="Atmospheric Pressure Units"
            value={pressureUnit === "mbar" ? "mbar" : "hPa"}
            options={[
              { label: "Millibar (mbar)", value: "mbar" },
              { label: "Hectopascal (hPa)", value: "hpa" },
            ]}
            onChange={setPressureUnit}
            isOpen={isPressureDropdownOpen}
            setOpen={setPressureDropdownOpen}
          />
        </View>

        {/* Other Settings */}
        <View className=" border-t border-gray-600 pt-4">
          <Text className="text-gray-400 mb-2 text-base">Other Settings</Text>
          <View className="flex-row items-center justify-between mt-4">
            <View className="flex-col items center">
              <Text className="text-white mb-2">
                Update at night automatically
              </Text>
              <Text className="text-gray-400 text-base mt-2">
                Update weather info between 23:00 and 07:00
              </Text>
            </View>
            <View
              style={[
                styles.switchContainer,
                {
                  backgroundColor: updateAutomatically ? "#3578e5" : "#767577",
                },
              ]}
            >
              <Switch
                value={updateAutomatically}
                onValueChange={(value) => setUpdateAutomatically(value)}
                thumbColor={updateAutomatically ? "#FFFFFF" : "#E0E0E0"}
                trackColor={{
                  false: "#767577",
                  true: "#3578e5",
                }}
                style={styles.switch}
              />
            </View>
          </View>
        </View>

        {/* About Nimbus */}
        <View className="mt-6 border-t border-gray-600 pt-4 mb-4">
          <Text className="text-gray-400 mb-4 text-sm mt-2">About Nimbus</Text>
          <TouchableOpacity className="mb-4 mt-2 flex-row items-center justify-between">
            <Text className="text-white font-bold">Feedback</Text>
            <ChevronRightIcon size={16} color="#ffffff" />
          </TouchableOpacity>
          <TouchableOpacity className="mt-2 flex-row items-center justify-between">
            <Text className="text-white font-bold">Privacy Policy</Text>
            <ChevronRightIcon size={16} color="#ffffff" />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  switchContainer: {
    width: 45,
    height: 25,
    padding: 9,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Settings;
