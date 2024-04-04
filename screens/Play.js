import { StyleSheet, Text, View, Pressable, ScrollView } from "react-native";
import { useState, useRef, useEffect } from "react";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";

export default function Play() {
  // States
  const [time, setTime] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const [running, setRunning] = useState(null);
  const [pause, setPause] = useState();
  const [initialLocation, setInitialLocation] = useState(null);
  const [distance, setDistance] = useState(0);
  const intervalRef = useRef(null);
  const startTimeRef = useRef(0);

  // Localizacao
  const [minhaLocalizacao, setMinhaLocalizacao] = useState(null);
  const [localizacao, setLocalizacao] = useState(null);
  const mapViewRef = useRef(null);

  // Play
  const startStopwatch = async () => {
    // Capturar a localização inicial
    const location = await Location.getCurrentPositionAsync({});
    setInitialLocation(location.coords);
    setMinhaLocalizacao(location);
    setLocalizacao({
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

  /* Pause stopwatch */
  const pauseStopwatch = async () => {
    clearInterval(intervalRef.current);
    setPause(true);
    setRunning(false);

    // Calcular a distância percorrida
    const currentLocation = await Location.getCurrentPositionAsync({});
    const currentCoords = currentLocation.coords;
    const distanceInMeters = Location.distanceBetween(
      initialLocation.latitude,
      initialLocation.longitude,
      currentCoords.latitude,
      currentCoords.longitude
    );
    const distanceInKm = distanceInMeters / 1000;
    setDistance(distanceInKm);
  };

  /* Reset stopwatch */
  const resetStopwatch = () => {
    clearInterval(intervalRef.current);
    setTime({ hours: 0, minutes: 0, seconds: 0 });
    setPause(false);
    setDistance(0);
  };

  /* Resume stopwatch */
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

  // useEffect monitorando permissões
  useEffect(() => {
    async function obterLocalizacao() {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("Permissão negada");
        return;
      }
      let localizacaoAtual = await Location.getCurrentPositionAsync({});
      setMinhaLocalizacao(localizacaoAtual);
      setLocalizacao({
        latitude: localizacaoAtual.coords.latitude,
        longitude: localizacaoAtual.coords.longitude,
      });
      mapViewRef.current.animateToRegion({
        latitude: localizacaoAtual.coords.latitude,
        longitude: localizacaoAtual.coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
    }
    obterLocalizacao();
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
            region={localizacao}
            followsUserLocation={true}
            showsUserLocation={true}
          >
            {localizacao && <Marker coordinate={localizacao} />}
          </MapView>
        </View>

        <Text style={styles.distanceText}>
          Distância percorrida: {distance.toFixed(2)} km
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

  // Mapa
  mapa: {
    width: 280,
    height: 280,
  },

  distanceText: {
    fontSize: 18,
    marginTop: 10,
  },
});
