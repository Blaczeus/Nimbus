import Constants from "expo-constants";

export const apiKey = Constants.expoConfig.extra.WEATHER_API_KEY;

export const weatherImages = {
  "Partly cloudy": require("../assets/images/partlycloudy.png"),
  "Moderate rain": require("../assets/images/moderaterain.png"),
  "Patchy rain nearby": require("../assets/images/weather.png"),
  "Patchy rain possible": require("../assets/images/moderaterain.png"),
  "Sunny": require("../assets/images/sun.png"),
  "Clear": require("../assets/images/clear.png"),
  "Overcast": require("../assets/images/mist.png"),
  "Cloudy": require("../assets/images/cloudy.png"),
  "Light rain": require("../assets/images/light-rain.png"),
  "Light snow": require("../assets/images/snow.png"),
  "Moderate rain at times": require("../assets/images/moderaterain.png"),
  "Heavy rain": require("../assets/images/heavyrain.png"),
  "Heavy rain at times": require("../assets/images/heavyrain.png"),
  "Moderate or heavy freezing rain": require("../assets/images/heavyrain.png"),
  "Moderate or heavy rain shower": require("../assets/images/heavyrain.png"),
  "Moderate or heavy rain with thunder": require("../assets/images/heavyrain.png"),
  "Other": require("../assets/images/moderaterain.png"),
};
