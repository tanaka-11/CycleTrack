import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
} from "react";
import * as Location from "expo-location";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Criar o Contexto
const SpeedContext = createContext();

// Exportar um hook customizado para acessar o contexto
export const useSpeedContext = () => useContext(SpeedContext);

// Provedor do contexto que envolve a árvore de componentes
export const SpeedProvider = ({ children }) => {
  // States para uso geral das funções de monitoramento
  const [time, setTime] = useState({ hours: 0, minutes: 0, seconds: 0 });
  console.log(time);
  const [speed, setSpeed] = useState(0);
  const [distance, setDistance] = useState(0);
  const [steps, setSteps] = useState(0);
  const [pause, setPause] = useState();
  const [running, setRunning] = useState();
  const [stop, setStop] = useState(false);
  const [data, setData] = useState([]);

  // Localização do usuário
  const [myLocation, setMyLocation] = useState();
  const [currentLocation, setCurrentLocation] = useState(null);
  const [location, setLocation] = useState();
  const [initialLocation, setInitialLocation] = useState();

  // Monitoramento da distancia e velocidade
  const [locationSubscription, setLocationSubscription] = useState();
  const [storedSpeed, setStoredSpeed] = useState(0);
  const [storedDistance, setStoredDistance] = useState(0);

  // Definir mapViewRef dentro da função SpeedProvider
  const mapViewRef = useRef();

  // Função para obter a localização do usuário
  const getLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permissão negada");
      return;
    }

    try {
      let currentLocation = await Location.getCurrentPositionAsync({});

      setMyLocation(currentLocation);
      setLocation({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
      });

      if (mapViewRef.current) {
        mapViewRef.current.animateToRegion({
          latitude: currentLocation.coords.latitude,
          longitude: currentLocation.coords.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        });
      }
    } catch (error) {
      console.error("Erro ao obter a localização: ", error);
    }
  };

  // useEffect da permissão de localização e animação no mapa
  useEffect(() => {
    permissionLocationAndAnimated();
  }, []);

  // Função de permissão de localização e animação no mapa
  const permissionLocationAndAnimated = async () => {
    try {
      await getLocation();
    } catch (error) {
      console.error(error);
    }
  };

  // Função para começar o monitoramento
  const startMonitoring = async () => {
    // Função para calcular a distância entre dois pontos geográficos
    const calculateDistance = (lat1, lon1, lat2, lon2) => {
      // Raio da Terra
      const R = 6371;

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
      return distance;
    };

    try {
      const newLocationSubscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.Highest,
          timeInterval: 1000,
          distanceInterval: 0,
          activityType: Location.ActivityType.Fitness,
        },

        (position) => {
          setSpeed(position.coords.speed || 0);
          // Calcule a distância aqui e atualize o estado 'distance'
          if (myLocation) {
            const newDistance = calculateDistance(
              myLocation.coords.latitude,
              myLocation.coords.longitude,
              position.coords.latitude,
              position.coords.longitude
            );
            setDistance(newDistance);
          }
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
  };

  // Função para parar o monitoramento
  const stopMonitoring = () => {
    if (locationSubscription) {
      locationSubscription.remove();
    }
    setSpeed(0);
    setSteps(0);
    setDistance(0);
  };

  const pauseMonitoring = () => {
    setPause(true);
    if (locationSubscription) {
      locationSubscription.remove();
      setLocationSubscription(null);
    }
  };

  // useEffect do pause
  useEffect(() => {
    if (pause && !running) {
      setDistance(steps);
      setSpeed(0);
    }
  }, [pause, running]);

  // Função para retomar o monitoramento
  const resumeMonitoring = async () => {
    if (!running && pause) {
      setPause(false);
      await startMonitoring();
    }
  };

  // Função para pausar o monitoramento e armazenar os dados
  const stopMonitoringAndStoreData = () => {
    // Pausar o monitoramento
    if (locationSubscription) {
      locationSubscription.remove();
      setLocationSubscription(null);
    }

    // Armazenar os dados atuais
    setStoredSpeed(speed);
    setStoredDistance(steps);
  };

  // Função para salvarInfos
  const savedInfos = async () => {
    const infos = {
      localizacao: {
        latitude: location.latitude,
        longitude: location.longitude,
      },
      storedDistance: steps,
      storedSpeed: speed,
      storedTime: time,
    };

    try {
      const infosSalvas = await AsyncStorage.getItem("@infosSalvas");
      const listaDeInfos = infosSalvas ? JSON.parse(infosSalvas) : [];

      // Adicionando as informações na lista
      listaDeInfos.push(infos);
      // console.log(listaDeInfos);
      setData(listaDeInfos);

      // Salvando a lista de informações de volta no AsyncStorage
      await AsyncStorage.setItem("@infosSalvas", JSON.stringify(listaDeInfos));
    } catch (error) {
      console.log("Erro ao salvar as informações", error.message);
      Alert.alert("Erro ao salvar as informações", "Tente novamente");
    }
  };

  // Valor do contexto
  const value = {
    // States
    location,
    currentLocation,
    initialLocation,
    myLocation,
    speed,
    steps,
    distance,
    stop,
    pause,
    running,
    locationSubscription,
    mapViewRef,
    storedSpeed,
    storedDistance,
    data,
    time,

    // Set
    setSpeed,
    setRunning,
    setDistance,
    setSteps,
    setPause,
    setStop,
    setMyLocation,
    setCurrentLocation,
    setLocationSubscription,
    setLocation,
    setInitialLocation,
    setStoredSpeed,
    setStoredDistance,
    setData,
    setTime,

    // Funções
    startMonitoring,
    stopMonitoring,
    pauseMonitoring,
    resumeMonitoring,
    stopMonitoringAndStoreData,
    savedInfos,
    permissionLocationAndAnimated,
    getLocation,
  };

  return (
    <SpeedContext.Provider value={value}>{children}</SpeedContext.Provider>
  );
};
