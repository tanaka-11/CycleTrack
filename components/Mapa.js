import { Alert, Platform, StyleSheet, Text, View } from "react-native";
import { useEffect, useState, useRef } from "react";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import { Accelerometer } from "expo-sensors";

/* 3) Acessar a prop que tem a função do PAI */
export default function Mapa({
  running,
  startMonitoringSpeed,
  stopMonitoringSpeed,
  resumeMonitoring,
  pauseMonitoring,
}) {
  // States utizados para as funções de "Location"
  const [myLocation, setMyLocation] = useState(null); // Localização do usuário
  const [location, setLocation] = useState(null); // Localização atual
  const [initialLocation, setInitialLocation] = useState(null); // Localização inicial
  const [pause, setPause] = useState(null);
  const [distance, setDistance] = useState(0); // Distância percorrida
  const mapViewRef = useRef(null);

  // States utilizados para a contagem de passos
  const [steps, setSteps] = useState(0); // Contagem de passos
  const [speed, setSpeed] = useState(0); // Velocidade do usuário

  const [locationSubscription, setLocationSubscription] = useState(); // Assinatura para monitorar a localização

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

  // Dentro do useEffect para monitorar a permissão de localização
  useEffect(() => {
    async function getLocation() {
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

      // Iniciar monitoramento da velocidade se a atividade já começou
      if (running) {
        startMonitoringSpeed();
      } else if (!pause) {
        pauseMonitoring();
      } else if (pause) {
        resumeMonitoring();
      } else {
        stopMonitoringSpeed();
      }
    }
    getLocation();
  }, [running]);

  // Função para iniciar o monitoramento da velocidade do usuário
  async function startMonitoringSpeed() {
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

      // Remover a assinatura anterior, se existir
      if (locationSubscription) {
        locationSubscription.remove();
      }
      setLocationSubscription(newLocationSubscription);
    } catch (error) {
      console.error(error);
    }
  }

  // Função para parar o monitoramento da velocidade
  async function stopMonitoringSpeed(subscription) {
    if (!pause && running) {
      if (subscription) {
        subscription.remove();
        setSpeed(0);
        setSteps(0);
        setDistance(0);
      }
    }
  }

  // Função para pausar o monitoramento da velocidade
  async function pauseMonitoring(subscription) {
    if (pause && !running) {
      if (subscription) {
        subscription.pause();
        setPause(true);
        setDistance(steps);
        setSpeed(0);
      }
    }
  }

  // Função para retomar o monitoramento da velocidade
  async function resumeMonitoring(subscription) {
    if (!running && pause) {
      if (subscription) {
        subscription.resume();
        setPause(false);
        setDistance(steps);
        setSpeed(speed);
      }
    }
  }

  // Efeito para parar o monitoramento da velocidade quando a atividade é encerrada
  useEffect(() => {
    if (!running && !pause) {
      stopMonitoringSpeed();
      setLocationSubscription(null);
    }
  }, [running, locationSubscription]);

  // useEffect do acelerometro
  useEffect(() => {
    if (running) {
      if (Platform.OS === "android" || Platform.OS === "ios") {
        Accelerometer.setUpdateInterval(1000);
      }
      const subscription = Accelerometer.addListener((accelerometerData) => {
        const { x, y, z } = accelerometerData;
        const magnitude = Math.sqrt(x * x + y * y + z * z);
        const THRESHOLD = 1.2;
        if (magnitude > THRESHOLD) {
          setSteps((prevSteps) => prevSteps + 1);
        }
      });
      return () => subscription.remove();
    }
  }, [running]);

  // Exibindo a velocidade atual e a distância percorrida
  console.log(speed);
  console.log(steps);

  return (
    <>
      <View style={styles.viewMapa}>
        <MapView
          ref={mapViewRef}
          mapType="standard"
          style={styles.mapa}
          region={location}
          followsUserLocation={true}
          showsUserLocation={true}
        >
          {initialLocation && <Marker coordinate={location} />}
        </MapView>
      </View>

      <View style={styles.viewDados}>
        <Text style={styles.distanceText}>
          {/* Distância percorrida: {(distance / 1000).toFixed(2)} km */}
          Distância percorrida: {steps.toFixed(2)}
        </Text>

        <Text style={styles.distanceText}>Velocidade: {speed.toFixed(3)}</Text>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  // Mapa
  mapa: {
    width: 280,
    height: 280,
  },

  // Dados
  viewDados: {
    flexDirection: "row",
    gap: 30,
    marginTop: 10,
  },

  distanceText: {
    fontSize: 18,
    marginTop: 10,
  },
});
