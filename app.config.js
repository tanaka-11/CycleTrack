require("dotenv").config();

export default {
  name: "CycleTrack",
  slug: "cycletrack",
  version: "1.0.0",
  owner: "tanaka-11",
  orientation: "portrait",
  icon: "./assets/icon.png",
  assetBundlePatterns: ["**/*"],
  updates: {
    fallbackToCacheTimeout: 0,
  },
  splash: {
    image: "./assets/splash.png",
    resizeMode: "contain",
    backgroundColor: "#000000",
  },
  ios: {
    supportsTablet: true,
    infoPlist: {
      UIBackgroundModes: ["location", "fetch"],
    },
  },
  android: {
    package: "com.tanaka11.cycletrack",
    permissions: ["ACCESS_FINE_LOCATION", "ACCESS_BACKGROUND_LOCATION"],
    adaptiveIcon: {
      foregroundImage: "./assets/icon.png",
      backgroundColor: "#3A2293",
    },
    config: {
      googleMaps: {
        apiKey: process.env.GOOGLE_MAPS_API_KEY,
      },
    },
  },
  extra: {
    eas: {
      projectId: "10a6294f-c502-4c3c-a42d-39a77a76529e",
    },
  },
};
