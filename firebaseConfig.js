import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCG-cLXqXjKZya_HY7fgsi6-jixLSMB1t4",
  authDomain: "cycletrack-ts.firebaseapp.com",
  projectId: "cycletrack-ts",
  storageBucket: "cycletrack-ts.appspot.com",
  messagingSenderId: "619328327967",
  appId: "1:619328327967:web:0d0856de25bbe25003202a",
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Initialize authentication with AsyncStorage persistence
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

// const googleProvider = new GoogleAuthProvider();

export { auth }; // Exporte o serviço de autenticação
