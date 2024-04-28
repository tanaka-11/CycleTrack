import { StyleSheet, Text, View } from "react-native";
import { useRef } from "react";

// Componentes
import ControlButtons from "./ControlButtons";
import Mapa from "./Mapa";

// Context
import { useSpeedContext } from "./SpeedContext";

export default function Stopwatch() {
  const {
    // States
    mapViewRef,
    time,

    // Set
    setRunning,
    setPause,
    setStop,
    setTime,
  } = useSpeedContext();

  // Estados para controlar o tempo do cronômetro
  const intervalRef = useRef(null); // Referência para o intervalo do cronômetro
  const startTimeRef = useRef(0); // Referência para o tempo de início do cronômetro

  // Função para formatar o cronometro
  function formatTime(time) {
    return `${time.hours.toString().padStart(2, "0")}:${time.minutes
      .toString()
      .padStart(2, "0")}:${time.seconds.toString().padStart(2, "0")}`;
  }

  // Função para iniciar o cronômetro
  const startStopwatch = () => {
    // Calcular o tempo de início
    startTimeRef.current =
      Date.now() -
      (time.hours * 3600 + time.minutes * 60 + time.seconds) * 1000;

    // Iniciar o intervalo para atualizar o tempo
    intervalRef.current = setInterval(() => {
      const elapsedTime = Math.floor(
        (Date.now() - startTimeRef.current) / 1000
      );
      const hours = Math.floor(elapsedTime / 3600);
      const minutes = Math.floor((elapsedTime % 3600) / 60);
      const seconds = elapsedTime % 60;
      setTime({ hours, minutes, seconds });
    }, 1000);

    // Definir os estados apropriados
    setRunning(true);
  };

  // Função para pausar o cronômetro
  const pauseStopwatch = () => {
    // Parar o intervalo
    clearInterval(intervalRef.current);

    // Atualizar os estados
    setRunning(false);
    setPause(true);
  };

  // Função para resetar o cronômetro
  const resetStopwatch = () => {
    // Parar o intervalo
    clearInterval(intervalRef.current);

    // Resetar o tempo
    setTime({ hours: 0, minutes: 0, seconds: 0 });

    // Resetar os estados
    setRunning(false);
    setPause(false);
  };

  // Função para retomar o cronômetro
  const resumeStopwatch = () => {
    // Calcular o tempo de início
    startTimeRef.current =
      Date.now() -
      (time.hours * 3600 + time.minutes * 60 + time.seconds) * 1000;

    // Iniciar o intervalo para atualizar o tempo
    intervalRef.current = setInterval(() => {
      const elapsedTime = Math.floor(
        (Date.now() - startTimeRef.current) / 1000
      );
      const hours = Math.floor(elapsedTime / 3600);
      const minutes = Math.floor((elapsedTime % 3600) / 60);
      const seconds = elapsedTime % 60;
      setTime({ hours, minutes, seconds });
    }, 1000);

    // Definir os estados apropriados
    setRunning(true);
    setPause(false);
  };

  // Função para parar o cronômetro
  const stopAll = () => {
    // Parar o intervalo
    clearInterval(intervalRef.current);

    // Manter o tempo atual
    setTime({
      hours: time.hours,
      minutes: time.minutes,
      seconds: time.seconds,
    });

    // Resetar os estados
    setRunning(false);
    setPause(false);
    setStop(true);
  };

  return (
    <>
      <View style={styles.mainContainer}>
        <Text style={styles.subHeader}>Passe seu tempo pedalando</Text>

        <View style={styles.centerSection}>
          <View style={styles.timerBorder}>
            <View style={styles.timerContainer}>
              <Text style={styles.timerText}>{formatTime(time)}</Text>
            </View>
          </View>

          <Mapa mapViewRef={mapViewRef} />

          <ControlButtons
            pauseStopwatch={pauseStopwatch}
            startStopwatch={startStopwatch}
            resetStopwatch={resetStopwatch}
            resumeStopwatch={resumeStopwatch}
            stopAll={stopAll}
            setTime={setTime}
          />
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },

  mainHeader: {
    fontSize: 30,
    color: "#412CAB",
  },

  subHeader: {
    marginTop: 8,
    marginBottom: 20,
    color: "#3A2293",
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
  },

  timerContainer: {
    backgroundColor: "#CFC3EE",
    width: 170,
    height: 170,
    borderRadius: 100,
    borderColor: "#fcfdfb",
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },

  timerText: {
    fontSize: 38,
    color: "#3A2293",
  },

  regularText: {
    fontWeight: "bold",
    fontSize: 22,
    marginVertical: 20,
    marginHorizontal: 10,
    textAlign: "left",
  },

  timerBorder: {
    borderColor: "#5442D2",
    borderWidth: 2,
    borderRadius: 100,
    width: 175,
    height: 175,
  },

  titleIconSection: {
    marginHorizontal: 20,
    marginVertical: 10,
    flexDirection: "row",
    gap: 100,
    alignItems: "center",
  },

  centerSection: {
    alignItems: "center",
  },
});
