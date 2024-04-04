import { StyleSheet, Text, View, Pressable, ScrollView } from "react-native";
import React, { useState, useRef, useEffect } from "react";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";

export default function Play() {
  // States do Play
  const [time, setTime] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const [running, setRunning] = useState(null);
  const [pause, setPause] = useState();
  const intervalRef = useRef(null);
  const startTimeRef = useRef(0);

  // Guardando a referencia no mapRef (MapView)
  const mapRef = React.createRef();

  // Localizacao
  const [minhaLocalizacao, setMinhaLocalizacao] = useState(null); // State para monitorar dados da atualização atual do usuário
  const [localizacao, setLocalizacao] = useState(null); // State com finalidade de determinar a localização no MapView junto com o Marker
  const [coordinates, setCoordinates] = useState([]); // Cordenadas

  // Play
  const startStopwatch = () => {
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
  const pauseStopwatch = () => {
    clearInterval(intervalRef.current);
    setPause(true);
    setRunning(false);
  };

  /* Reset stopwatch */
  const resetStopwatch = () => {
    clearInterval(intervalRef.current);
    setTime({ hours: 0, minutes: 0, seconds: 0 });
    setPause(false);
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

  // Localizacao
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
    }
    obterLocalizacao();
  }, []);

  // Função localizacao atual
  useEffect(() => {
    // Condicional
    if (minhaLocalizacao) {
      const { latitude, longitude } = minhaLocalizacao.coords; // Objeto com mais informações da latitude e longitude

      // Animação do mapa
      mapRef.current.animateToRegion({
        latitude,
        longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.05,
      });
    }
  }, [minhaLocalizacao]); // Parametro (minhaLocalizacao)

  // Função para começar a gravar
  const startRecording = async () => {
    // Variavel guardando a função de localização atual
    let initialLocation = await Location.getCurrentPositionAsync({});

    // States
    setLocalizacao(initialLocation);
    setCurrentLocation(initialLocation);
    startRecording(new Date().getTime());
    setRunning(true);
    setCoordinates([initialLocation.coords]);

    // Variavel guardando função que monitora o movimento do usuario com o primeiro parametro de objeto vazio que recebe a option "default" e uma callback
    let subscriber = await Location.watchPositionAsync({}, (newLocation) => {
      // Atualização do state recebendo a nova localização
      setMinhaLocalizacao(newLocation);

      // States
      setPause((new Date().getTime() - startTimeRef) / 1000);
      setCoordinates([...coordinates, newLocation.coords]);
    });

    // Die
    return () => {
      if (subscriber) {
        subscriber.remove();
      }
    };
  };

  console.log(minhaLocalizacao);

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
            mapType="standard"
            style={styles.mapa}
            region={localizacao}
            ref={mapRef}
          >
            {localizacao && <Marker coordinate={localizacao} />}
          </MapView>
        </View>

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
              onPress={(startStopwatch, startRecording)}
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
    backgroundColor: "#fff",
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
});
