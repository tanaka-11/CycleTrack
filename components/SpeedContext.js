import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
} from "react";
import * as Location from "expo-location";
import MapView from "react-native-maps";

// Criar o Contexto
const SpeedContext = createContext();

// Exportar um hook customizado para acessar o contexto
export const useSpeedContext = () => useContext(SpeedContext);

// Provedor do contexto que envolve a árvore de componentes
export const SpeedProvider = ({ children }) => {
  // States para uso geral das funções de monitoramento
  const [speed, setSpeed] = useState(0);
  const [distance, setDistance] = useState(0);
  const [steps, setSteps] = useState(0);
  const [pause, setPause] = useState();
  const [running, setRunning] = useState();
  const [stop, setStop] = useState();

  // States para uso da localização
  // Localização do usuário
  const [myLocation, setMyLocation] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(null);
  // Monitoramento da distancia e velocidade
  const [locationSubscription, setLocationSubscription] = useState();
  const [location, setLocation] = useState(null);
  const [initialLocation, setInitialLocation] = useState(null);

  // Definir mapViewRef dentro da função SpeedProvider
  const mapViewRef = useRef(null);

  // Função para obter a localização do usuário
  const getLocation = async () => {
    // Solicitar permissão para acessar a localização do usuário
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permissão negada");
      return;
    }

    // Obter a localização atual do usuário
    let currentLocation = await Location.getCurrentPositionAsync({});
    setMyLocation(currentLocation);
    setLocation({
      latitude: currentLocation.coords.latitude,
      longitude: currentLocation.coords.longitude,
    });

    // Animação do mapa para a localização atual do usuário
    mapViewRef.current.animateToRegion({
      latitude: currentLocation.coords.latitude,
      longitude: currentLocation.coords.longitude,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    });
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
  const startMonitoringSpeed = async () => {
    // Função para calcular a distância entre dois pontos geográficos
    if (!stop) {
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
    }
  };

  // Função para parar o monitoramento
  const stopMonitoringSpeed = (locationSubscription) => {
    // Função para parar o monitoramento da velocidade
    if (stop && locationSubscription) {
      locationSubscription.remove();
      setSpeed(0);
      setSteps(0);
      setDistance(0);
    }
  };

  // Função para pausar o monitoramento
  const pauseMonitoring = (locationSubscription) => {
    if (pause && !running && locationSubscription) {
      subscription.pause();
      setPause(true);
      setDistance(steps);
      setSpeed(0);
    }
  };

  // Função para retomar o monitoramento
  const resumeMonitoring = () => {
    if (!running && pause) {
      setPause(false);
      setDistance(steps);
      setSpeed(speed);
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

    // Funções
    startMonitoringSpeed,
    stopMonitoringSpeed,
    pauseMonitoring,
    resumeMonitoring,
    permissionLocationAndAnimated,
    getLocation,
  };

  return (
    <SpeedContext.Provider value={value}>{children}</SpeedContext.Provider>
  );
};
