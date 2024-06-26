import React, { createContext, useContext, useState, useRef } from "react";
import { Alert } from "react-native";
import * as Location from "expo-location";
import * as TaskManager from "expo-task-manager";

// Recursos de Storage
import { getDatabase, ref, push } from "firebase/database";
import AsyncStorage from "@react-native-async-storage/async-storage";
import auth from "../firebase.config.js";

// Criar o Contexto
const SpeedContext = createContext();

// Exportar um hook customizado para acessar o contexto
export const useSpeedContext = () => useContext(SpeedContext);

// Nome da tarefa de localização em segundo plano
const BACKGROUND_LOCATION_TASK = "background-location-task";

// Definir a tarefa de localização em segundo plano
TaskManager.defineTask(
  BACKGROUND_LOCATION_TASK,
  async ({ data: { locations }, error }) => {
    if (error) {
      console.error(error);
      return;
    }

    // Armazene a localização em AsyncStorage
    try {
      await AsyncStorage.setItem(
        "@localLocationData",
        JSON.stringify(locations[0].coords)
      );
    } catch (error) {
      console.error(error);
    }
  }
);

// Provedor do contexto que envolve a árvore de componentes
export const SpeedProvider = ({ children }) => {
  // States para uso geral das funções de monitoramento
  const [time, setTime] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const [speed, setSpeed] = useState(0);
  const [distance, setDistance] = useState(0);
  const [pause, setPause] = useState();
  const [running, setRunning] = useState();
  const [stop, setStop] = useState(false);
  const [data, setData] = useState([]);

  // Data atual e hora
  const [currentDate, setCurrentDate] = useState();
  const [currentTime, setCurrentTime] = useState();

  // Localização do usuário
  const [myLocation, setMyLocation] = useState();
  const [currentLocation, setCurrentLocation] = useState(null);
  const [location, setLocation] = useState();
  const [initialLocation, setInitialLocation] = useState(null);
  const [finalLocation, setFinalLocation] = useState(null);
  const [locations, setLocations] = useState([]);

  // Monitoramento da distancia e velocidade
  const [locationSubscription, setLocationSubscription] = useState();
  const [storedSpeed, setStoredSpeed] = useState(0);
  const [storedDistance, setStoredDistance] = useState(0);
  const [storedLocations, setStoredLocations] = useState([]);
  const [maxSpeed, setMaxSpeed] = useState(0);
  const [speedSum, setSpeedSum] = useState(0);
  const [speedCount, setSpeedCount] = useState(0);

  // Referencia para o mapa
  const mapViewRef = useRef(null);

  // Função para solicitar permissão de localização
  const requestLocationPermission = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    return status === "granted";
  };

  // Função para obter a localização do usuário
  const getUserLocation = async () => {
    try {
      return await Location.getCurrentPositionAsync({});
    } catch (error) {
      console.error("Erro ao obter a localização: ", error);
      Alert.alert("Erro", "Não foi possível obter a localização.");
      return null;
    }
  };

  // Função para atualizar a localização no state
  const updateLocation = async () => {
    try {
      const permissionGranted = await requestLocationPermission();
      if (!permissionGranted) {
        Alert.alert(
          "Erro",
          "Permissão de localização não concedida. A permissão de localização é necessária para o funcionamento do aplicativo."
        );
        return;
      }

      const location = await getUserLocation();

      setMyLocation(location);
      setLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
    } catch (error) {
      Alert.alert("Erro", "Tente Novamente");
      console.error("Erro ao atualizar localização:", error);
    }
  };

  // Função para calcular a distância entre dois pontos geográficos
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    // Raio da Terra em metros
    const R = 6371000;

    // Distancia da Latitude
    const dLat = (lat2 - lat1) * (Math.PI / 180);

    // Distancia da Longitude
    const dLon = (lon2 - lon1) * (Math.PI / 180);

    // Constante guardando a primeira parte da formula de Haversine
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    // Constante guardando a distancia final
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    // Distancia recebendo o raio vezes a distancia final
    const distance = R * c;

    // Retornando a const Distancia
    return distance / 10;
  };

  // Função para atualizar velocidade e distancia
  const updatePosition = (position) => {
    // Pega a velocidade atual do objeto em metros por segundo (m/s)
    const currentSpeedMPS = position.coords.speed || 0;

    // Converte a velocidade de m/s para km/h multiplicando por 3.6
    const currentSpeed = currentSpeedMPS * 3.6;

    // Atualiza o estado 'speed' com a velocidade atual em km/h
    setSpeed(currentSpeed);

    // Atualiza o estado 'maxSpeed' com a maior velocidade registrada até agora
    setMaxSpeed((prevMaxSpeed) => Math.max(prevMaxSpeed, currentSpeed));

    // Atualiza a soma total das velocidades registradas e a contagem de velocidades
    setSpeedSum((prevSpeedSum) => prevSpeedSum + currentSpeed);
    setSpeedCount((prevSpeedCount) => prevSpeedCount + 1);

    // Se a localização anterior existir e a velocidade atual for maior que 0.51 km/h, calcula a distância entre a localização anterior e a atual e adiciona ao estado 'distance'
    if (myLocation && currentSpeed > 0.51) {
      const newDistance = calculateDistance(
        myLocation.coords.latitude,
        myLocation.coords.longitude,
        position.coords.latitude,
        position.coords.longitude
      );
      setDistance((prevDistance) => prevDistance + newDistance);
    }

    // Adiciona a localização atual ao array de localizações
    setLocations((prevLocations) => [...prevLocations, position]);

    // Atualiza a localização anterior com a localização atual
    setMyLocation(position);
  };

  // Função para iniciar o monitoramento
  const startMonitoring = async () => {
    try {
      const newLocationSubscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.Highest,
          timeInterval: 5000, // Atualiza a posição a cada 5s
          distanceInterval: 5, // Atualiza a posição a cada 5m
          activityType: Location.ActivityType.Fitness,
        },
        (position) => {
          // Armazenar a posição inicial
          if (!initialLocation) {
            setInitialLocation({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            });
          }

          // Atualizar a posição
          updatePosition(position);
        }
      );

      // Remove o monitoramento anterior de velocidade atraves do "subscription".
      if (locationSubscription) {
        locationSubscription.remove();
      }

      setLocationSubscription(newLocationSubscription);
    } catch (error) {
      console.error(error);
    }

    // Iniciando monitoramento da localização em segundo plano
    const { status } = await Location.requestBackgroundPermissionsAsync();
    if (status === "granted") {
      try {
        await Location.startLocationUpdatesAsync(BACKGROUND_LOCATION_TASK, {
          accuracy: Location.Accuracy.Highest,
          timeInterval: 5000,
          distanceInterval: 2,
          activityType: Location.ActivityType.Fitness,
          showsBackgroundLocationIndicator: true,
          foregroundService: {
            notificationTitle: "Monitoramento de localização",
            notificationBody: "Estamos monitorando sua distância e velocidade.",
            notificationColor: "#3A2293",
          },
        });
      } catch (error) {
        console.error(error);
      }
    } else {
      Alert.alert("Permissão negada");
    }
  };

  // Função para resetar o monitoramento
  const resetMonitoring = async () => {
    await Location.stopLocationUpdatesAsync(BACKGROUND_LOCATION_TASK);
    setSpeed(0);
    setDistance(0);
  };

  // Função para remover a inscrição de localização
  const removeLocationSubscription = () => {
    if (locationSubscription) {
      locationSubscription.remove();
      setLocationSubscription(null);
    }
  };

  // Função para pausar o monitoramento
  const pauseMonitoring = () => {
    setPause(true);
    setSpeed(0);
    removeLocationSubscription();
  };

  // Função para retomar o monitoramento
  const resumeMonitoring = async () => {
    if (!running && pause) {
      setPause(false);
      await startMonitoring();
    }
  };

  // Função para parar o monitoramento e armazenar os dados
  const stopMonitoringAndStoreData = () => {
    // Parar o monitoramento
    removeLocationSubscription();

    // Atualiza a localização final
    setFinalLocation({
      latitude: myLocation.coords.latitude,
      longitude: myLocation.coords.longitude,
    });

    // Armazenar os dados atuais
    setStoredSpeed(speed);
    setStoredDistance(distance);

    // Armazenar todas as localizações
    setStoredLocations(locations);
  };

  // Função para formatar a data e a hora atual
  const formatDateTime = () => {
    const date = new Date();
    const dateOptions = { year: "numeric", month: "2-digit", day: "2-digit" };
    const timeOptions = { hour: "2-digit", minute: "2-digit" };
    const formattedDate = date.toLocaleString("pt-BR", dateOptions);
    const formattedTime = date.toLocaleString("pt-BR", timeOptions);
    return { formattedDate, formattedTime };
  };

  // Função para recuperar a localização de segundo plano
  const getBackgroundLocation = async () => {
    try {
      const value = await AsyncStorage.getItem("@localLocationData");
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.error(error);
    }
  };

  // Função para salvar as informações no banco de dados
  const saveInfosToDatabase = async (infos) => {
    // Identificador de Usuario
    const userUID = auth.currentUser.uid;

    try {
      // Obtendo referência para o banco de dados
      const db = getDatabase();

      // Referência para o local no banco de dados vai salvar as informações
      const dbRef = ref(db, "infosSalvas/" + userUID);

      // Adicionando as informações no Realtime Database
      await push(dbRef, infos);
    } catch (error) {
      console.log("Erro ao salvar as informações", error.message);
      Alert.alert("Erro ao salvar as informações", "Tente novamente");
    }
  };

  // Função para salvarInfos
  const savedInfos = async () => {
    const { formattedDate, formattedTime } = formatDateTime();

    // Salvando os dados
    const infos = {
      localizacao: {
        latitude: location.latitude,
        longitude: location.longitude,
      },
      localizacaoFinal: finalLocation,
      storedLocations: locations,
      storedDistance: distance / 1000,
      storedSpeed: speed,
      averageSpeed: speedSum / speedCount,
      maxSpeed: maxSpeed,
      storedTime: time,
      currentDate: formattedDate,
      currentTime: formattedTime,
    };

    infos.localizacaoEmSegundoPlano = await getBackgroundLocation();

    await saveInfosToDatabase(infos);
  };

  // Valor do contexto
  const value = {
    // States
    location,
    currentLocation,
    initialLocation,
    finalLocation,
    myLocation,
    speed,
    distance,
    stop,
    pause,
    running,
    locationSubscription,
    mapViewRef,
    storedSpeed,
    storedDistance,
    storedLocations,
    data,
    time,
    currentDate,
    currentTime,

    // Set
    setLocation,
    setCurrentLocation,
    setInitialLocation,
    setFinalLocation,
    setMyLocation,
    setSpeed,
    setDistance,
    setStop,
    setPause,
    setRunning,
    setLocationSubscription,
    setStoredSpeed,
    setStoredDistance,
    setStoredLocations,
    setData,
    setTime,
    setCurrentDate,
    setCurrentTime,

    // Funções
    startMonitoring,
    pauseMonitoring,
    resumeMonitoring,
    resetMonitoring,
    stopMonitoringAndStoreData,
    savedInfos,
    updateLocation,
  };

  return (
    <SpeedContext.Provider value={value}>{children}</SpeedContext.Provider>
  );
};
