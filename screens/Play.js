import {
  StyleSheet,
  Text,
  View,
  Pressable,
  ScrollView,
  Platform,
} from "react-native";
import { useState, useRef, useEffect } from "react";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import { Accelerometer } from "expo-sensors";

export default function Play() {
  // States utizados para as funções de "Play"
  const [time, setTime] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const [running, setRunning] = useState(null);
  const [pause, setPause] = useState();
  const intervalRef = useRef(null);
  const startTimeRef = useRef(0);

  // States utizados para as funções de "Location"
  const [myLocation, setMyLocation] = useState(null);
  const [location, setLocation] = useState(null);
  const [initialLocation, setInitialLocation] = useState(null);
  const [distance, setDistance] = useState(null);
  const mapViewRef = useRef(null);

  // States utilizados para a contagem de passos
  const [steps, setSteps] = useState(0);
  const [speed, setSpeed] = useState(0);

  // useEffect do acelerometro
  useEffect(() => {
    // Solicitar permissão de acesso ao acelerômetro
    if (Platform.OS === "android" || Platform.OS === "ios") {
      Accelerometer.setUpdateInterval(1000);
    }
    const subscription = Accelerometer.addListener((accelerometerData) => {
      // Sua lógica para contar passos aqui
      // Esta é uma lógica de exemplo simples. Você pode precisar ajustá-la.
      const { x, y, z } = accelerometerData;
      const magnitude = Math.sqrt(x * x + y * y + z * z);
      const THRESHOLD = 1.2;
      if (magnitude > THRESHOLD) {
        setSteps((prevSteps) => prevSteps + 1);
      }
    });

    return () => subscription.remove();
  }, []);

  // Atualizar o tempo decorrido
  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        const elapsedTime = Math.floor(
          (Date.now() - startTimeRef.current) / 1000
        );
        const hours = Math.floor(elapsedTime / 3600);
        const minutes = Math.floor((elapsedTime % 3600) / 60);
        const seconds = elapsedTime % 60;
        setTime({ hours, minutes, seconds });
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [running]);

  // Play
  const startStopwatch = async () => {
    // Obtendo localização inicial
    const location = await Location.getCurrentPositionAsync({});
    setInitialLocation(location.coords);
    setMyLocation(location);
    setLocation({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    });

    // Iniciando o monitoramento de velocidade
    startMonitoringSpeed();

    // Cronometro
    startTimeRef.current =
      Date.now() -
      (time.hours * 3600 + time.minutes * 60 + time.seconds) * 1000;

    intervalRef.current = setInterval(() => {
      const elapsedTime = Math.floor(
        (Date.now() - startTimeRef.current) / 1000
      );
      const hours = Math.floor(elapsedTime / 3600);
      const minutes = Math.floor((elapsedTime % 3600) / 60);
      const seconds = elapsedTime % 60;
      setTime({ hours, minutes, seconds });
    }, 1000);

    // Atualizando states
    setRunning(true);
    setPause(false);
    setSteps(0);
  };

  // Formula de Harvesine para calcular a distancia em metros
  const haversineDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371e3; // Raio da Terra em metros
    const φ1 = lat1 * (Math.PI / 180); // Latitude em radianos
    const φ2 = lat2 * (Math.PI / 180); // Latitude em radianos
    const Δφ = (lat2 - lat1) * (Math.PI / 180); // Diferença de latitude em radianos
    const Δλ = (lon2 - lon1) * (Math.PI / 180); // Diferença de longitude em radianos

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distância em metros
  };

  // Pause stopwatch  (Função Pausar)
  const pauseStopwatch = async () => {
    // States
    clearInterval(intervalRef.current);
    setPause(true);
    setRunning(false);

    // Calcular Distancia
    const currentLocation = await Location.getCurrentPositionAsync({});
    const currentCoords = currentLocation.coords;
    const distanceInMeters = haversineDistance(
      initialLocation.latitude,
      initialLocation.longitude,
      currentCoords.latitude,
      currentCoords.longitude
    );

    // Defina a distância em metros
    setDistance(distanceInMeters);
  };

  // Reset stopwatch (Função Reset)
  const resetStopwatch = () => {
    clearInterval(intervalRef.current);
    setTime({ hours: 0, minutes: 0, seconds: 0 });
    setPause(false);
    setDistance(0);
    setSteps(0);
  };

  // Resume stopwatch (Função Retomar)
  const resumeStopwatch = () => {
    if (time.hours > 0 || time.minutes > 0 || time.seconds > 0) {
      startTimeRef.current =
        Date.now() -
        (time.hours * 3600 + time.minutes * 60 + time.seconds) * 1000;
      intervalRef.current = setInterval(() => {
        const elapsedTime = Math.floor(
          (Date.now() - startTimeRef.current) / 1000
        );
        const hours = Math.floor(elapsedTime / 3600);
        const minutes = Math.floor((elapsedTime % 3600) / 60);
        const seconds = elapsedTime % 60;
        setTime({ hours, minutes, seconds });
      }, 1000);
      setPause(false);
      setRunning(true);
    }
  };

  // useEffect monitorando permissão do Location
  useEffect(() => {
    async function getLocation() {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("Permissão negada");
        return;
      }

      // Função para obter localização atual
      let currentLocation = await Location.getCurrentPositionAsync({});
      setMyLocation(currentLocation);
      setLocation({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
      });

      // Animação do mapa para localização atual
      mapViewRef.current.animateToRegion({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
    }
    getLocation();
  }, []);

  // Função de velocidade
  async function startMonitoringSpeed() {
    try {
      const locationSubscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.Highest,
          timeInterval: 1000,
          distanceInterval: 0,
          activityType: Location.ActivityType.Fitness,
        },

        (position) => {
          setSpeed(position.coords.speed || 0);
        }
      );

      return locationSubscription;
    } catch (error) {
      console.error(error);
    }
  }

  // Para o monitoramento da velocidade e remove a assinatura.
  async function stopMonitoringSpeed(subscription) {
    if (subscription) {
      subscription.remove();
    }
  }

  console.log(distance);
  return (
    <ScrollView>
      <View style={styles.container}>
        <Text style={styles.header}></Text>
        <Text style={styles.subHeader}>Tempo</Text>
        <Text style={styles.timeText}>
          {`${time.hours.toString().padStart(2, "0")}:${time.minutes
            .toString()
            .padStart(2, "0")}:${time.seconds.toString().padStart(2, "0")}`}
        </Text>

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

          <Text style={styles.distanceText}>
            Velocidade: {speed.toFixed(2)}
          </Text>
        </View>

        <View style={styles.buttonContainer}>
          {!pause && running && (
            <>
              <View style={styles.stopButtons}>
                <Pressable
                  style={[styles.button, styles.pauseButton]}
                  onPress={() => pauseStopwatch(stopMonitoringSpeed)}
                >
                  <Text style={styles.buttonText}>Pausar</Text>
                </Pressable>

                <Pressable
                  style={[styles.button, styles.stopButton]}
                  // onPress={}
                >
                  <Text style={styles.buttonText}>Parar</Text>
                </Pressable>
              </View>
            </>
          )}

          {pause && (
            <>
              <Pressable
                style={[styles.button, styles.resetButton]}
                onPress={resetStopwatch}
              >
                <Text style={styles.buttonText}>Reset</Text>
              </Pressable>

              <Pressable
                style={[styles.button, styles.resumeButton]}
                onPress={resumeStopwatch}
              >
                <Text style={styles.buttonText}>Retomar</Text>
              </Pressable>
            </>
          )}

          {!running && !pause && (
            <Pressable
              style={[styles.button, styles.startButton]}
              onPress={startStopwatch}
            >
              <Text style={styles.buttonText}>Começar</Text>
            </Pressable>
          )}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  // Play, Pause
  header: {
    fontSize: 30,
    color: "green",
    marginBottom: 10,
  },

  subHeader: {
    fontSize: 18,
    marginBottom: 10,
    color: "blue",
  },

  timeText: {
    fontSize: 48,
  },

  buttonContainer: {
    flexDirection: "row",
    marginTop: 20,
    marginBottom: 20,
  },

  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },

  startButton: {
    backgroundColor: "#2ecc71",
    marginRight: 10,
  },

  resetButton: {
    backgroundColor: "#4b371c",
    marginRight: 10,
  },

  pauseButton: {
    backgroundColor: "#f39c12",
  },

  stopButton: {
    backgroundColor: "#e74c3c",
  },

  resumeButton: {
    backgroundColor: "#3498db",
  },

  stopButtons: {
    gap: 20,
    flexDirection: "row",
  },

  buttonText: {
    color: "white",
    fontSize: 16,
  },

  // Dados
  viewDados: {
    flexDirection: "row",
    gap: 30,
    marginTop: 10,
  },

  // Map
  mapa: {
    width: 280,
    height: 280,
  },

  distanceText: {
    fontSize: 18,
    marginTop: 10,
  },
});
