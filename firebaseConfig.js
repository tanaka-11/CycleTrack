import { initializeApp } from "firebase/app";
import {
  initializeAuth,
  getReactNativePersistence,
  onAuthStateChanged,
} from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Configurações firebase
const firebaseConfig = {
  apiKey: "AIzaSyCG-cLXqXjKZya_HY7fgsi6-jixLSMB1t4",
  authDomain: "cycletrack-ts.firebaseapp.com",
  projectId: "cycletrack-ts",
  storageBucket: "cycletrack-ts.appspot.com",
  messagingSenderId: "619328327967",
  appId: "1:619328327967:web:0d0856de25bbe25003202a",
  databaseURL: "https://cycletrack-ts-default-rtdb.firebaseio.com/",
};

const app = initializeApp(firebaseConfig);

// Inicializando o serviço de autenticação do Firebase
const auth = initializeAuth(app);

// Verificar o estado de autenticação do usuário
onAuthStateChanged(auth, (user) => {
  if (user) {
    // Se o usuário estiver logado, defina a persistência
    auth.setPersistence(getReactNativePersistence(AsyncStorage));
  }
});

export default auth;
