import { StatusBar } from "expo-status-bar";
import AppNavigator from "./navigation/AppNavigation";
import React from "react";

export default function App() {
  return (
    <>
      <StatusBar style="auto" />
      <AppNavigator />
    </>
  );
}
