// Firebase
import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";

// AsyncStorage
import AsyncStorage from "@react-native-async-storage/async-storage";

// Configuração Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCG-cLXqXjKZya_HY7fgsi6-jixLSMB1t4",
  authDomain: "cycletrack-ts.firebaseapp.com",
  databaseURL: "https://cycletrack-ts-default-rtdb.firebaseio.com/",
  projectId: "cycletrack-ts",
  storageBucket: "cycletrack-ts.appspot.com",
  messagingSenderId: "619328327967",
  appId: "1:619328327967:web:0d0856de25bbe25003202a",
};

// Inicialização do Firebase app
const app = initializeApp(firebaseConfig);

// Inicializando o serviço de autenticação do Firebase com persistência de autenticação
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

export default auth;
