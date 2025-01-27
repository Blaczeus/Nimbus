import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { LogBox } from "react-native";
import { CardStyleInterpolators } from "@react-navigation/stack"; // Import the interpolator
import HomeScreen from "../screens/HomeScreen";
import Settings from "../screens/Settings";

const Stack = createStackNavigator();

const AppNavigator = () => {
  LogBox.ignoreLogs(["Setting a timer"]);
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        }}
      >
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Settings" component={Settings} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
