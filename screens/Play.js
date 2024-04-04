import { StyleSheet, Text, View, Pressable, ScrollView } from "react-native";
import { useState, useRef, useEffect } from "react";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";

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
  const [distance, setDistance] = useState(0);
  const mapViewRef = useRef(null);

  // Play
  const startStopwatch = async () => {
    // Obtendo localização ainicial
    const location = await Location.getCurrentPositionAsync({});
    setInitialLocation(location.coords);
    setMyLocation(location);
    setLocation({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    });

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
    setRunning(true);
    setPause(false);
  };

  // Pause stopwatch  (Função Pausar)
  const pauseStopwatch = async () => {
    clearInterval(intervalRef.current);
    setPause(true);
    setRunning(false);

    // Calcular Distancia
    const currentLocation = await Location.getCurrentPositionAsync({});
    const currentCoords = currentLocation.coords;
    const distanceInMeters = Location.distanceBetween(
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

      // Funçãr para obter localização atual
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

        <Text style={styles.distanceText}>
          {/* Distância percorrida: {(distance / 1000).toFixed(2)} km */}
          Distância percorrida: {distance} m
        </Text>

        <View style={styles.buttonContainer}>
          {!pause && running && (
            <Pressable
              style={[styles.button, styles.pauseButton]}
              onPress={pauseStopwatch}
            >
              <Text style={styles.buttonText}>Pausar</Text>
            </Pressable>
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
    backgroundColor: "#e74c3c",
    marginRight: 10,
  },

  pauseButton: {
    backgroundColor: "#f39c12",
  },

  resumeButton: {
    backgroundColor: "#3498db",
  },

  buttonText: {
    color: "white",
    fontSize: 16,
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
