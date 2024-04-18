import { StyleSheet, Text, View, Pressable } from "react-native";
import { useState, useRef } from "react";

// Componentes
import ControlButtons from "./ControlButtons";
import Mapa from "./Mapa";

// Context
import { useSpeedContext } from "./SpeedContext";

export default function Stopwatch() {
  const {
    // States
    mapViewRef,
    speed,
    steps,
    time,

    // Set
    setSpeed,
    setRunning,
    setDistance,
    setSteps,
    setPause,
    setStop,
    setTime,
  } = useSpeedContext();

  // Estados para controlar o tempo do cronômetro
  // const [time, setTime] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const intervalRef = useRef(null); // Referência para o intervalo do cronômetro
  const startTimeRef = useRef(0); // Referência para o tempo de início do cronômetro

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
    setDistance(0);
    setSteps(0);
    setSpeed(0);
  };

  // Função para pausar o cronômetro
  const pauseStopwatch = () => {
    // Parar o intervalo
    clearInterval(intervalRef.current);

    // Atualizar os estados
    setRunning(false);
    setPause(true);
    setDistance(steps);
    setSpeed(0);
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
    setSpeed(0);
    setSteps(0);
    setDistance(0);
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
    setDistance(steps);
    setSpeed(speed);
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
      <View style={styles.container}>
        <Text style={styles.subHeader}>Passe seu tempo pedalando</Text>

        {/* Cronometro */}
        <View style={styles.sessaoCentralizar}>
          <View style={styles.bordaContador}>
            <View style={styles.timeText}>
              <Text style={styles.timeText2}>
                {`${time.hours.toString().padStart(2, "0")}:${time.minutes
                  .toString()
                  .padStart(2, "0")}:${time.seconds
                  .toString()
                  .padStart(2, "0")}`}
              </Text>
            </View>
          </View>

          {/* Componente do mapa para exibir a localização */}
          <Mapa mapViewRef={mapViewRef} />

          {/* Componente para os botões de controle */}
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
  container: {
    flex: 1,
    marginVertical: 40,
  },

  header: {
    fontSize: 30,
    color: "#412CAB",
    marginBottom: 10,
  },

  subHeader: {
    marginBottom: 30,
    color: "#000",
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "left",
  },

  timeText: {
    color: "#5442D2",
    backgroundColor: "#CFC3EE",
    width: 170,
    height: 170,
    borderRadius: 100,
    borderColor: "#fcfdfb",
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },

  timeText2: {
    fontSize: 38,
    color: "#5442D2",
  },

  textoComum: {
    fontWeight: "bold",
    fontSize: 22,
    marginVertical: 20,
    marginHorizontal: 10,
    textAlign: "left",
  },

  bordaContador: {
    borderColor: "#5442D2",
    borderWidth: 2,
    borderRadius: 100,
    width: 175,
    height: 175,
  },

  sessaoTituloIcon: {
    marginHorizontal: 20,
    marginVertical: 10,
    flexDirection: "row",
    gap: 100,
    alignItems: "center",
  },

  sessaoCentralizar: {
    alignItems: "center",
  },
});
