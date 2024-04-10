import { StyleSheet, Text, View, Pressable } from "react-native";
import { useState, useRef } from "react";
import ControlButtons from "./ControlButtons";
import Mapa from "./Mapa";

export default function Stopwatch() {
  // States
  const [time, setTime] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const [pause, setPause] = useState(false);
  const [running, setRunning] = useState(false);
  const [stop, setStop] = useState(false);
  const intervalRef = useRef(null);
  const startTimeRef = useRef(0);

  // States utilizados para a contagem de passos
  const [steps, setSteps] = useState(0);
  const [speed, setSpeed] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const [locationSubscription, setLocationSubscription] = useState(null);

  // Play
  const startStopwatch = () => {
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

    // State
    setRunning(true);
    setHasStarted(true);
  };

  // Pause stopwatch
  const pauseStopwatch = () => {
    clearInterval(intervalRef.current);
    setRunning(false);
    setPause(true);
    setHasStarted(false);
  };

  // Reset stopwatch
  const resetStopwatch = () => {
    // Parar o intervalo, se estiver em execução
    clearInterval(intervalRef.current);

    // Resetar o tempo para 0
    setTime({ hours: 0, minutes: 0, seconds: 0 });

    // Definir os estados para seus valores padrão
    setRunning(false);
    setPause(false);
    setSpeed(0);
    setSteps(0);
    setHasStarted(false);
  };

  // Resume stopwatch
  const resumeStopwatch = () => {
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
    setHasStarted(true);
  };

  // Stop stopwtach
  const stopAll = () => {
    clearInterval(intervalRef.current);
    setTime({
      hours: time.hours,
      minutes: time.minutes,
      seconds: time.seconds,
    });
    setRunning(false);
    setPause(false);
    setStop(true);
    setSteps(steps);
    setHasStarted(speed);
  };

  return (
    <>
      <View style={styles.container}>
        <Text style={styles.header}></Text>
        <Text style={styles.subHeader}>Tempo</Text>

        <Text style={styles.timeText}>
          {`${time.hours.toString().padStart(2, "0")}:${time.minutes
            .toString()
            .padStart(2, "0")}:${time.seconds.toString().padStart(2, "0")}`}
        </Text>

        <Mapa
          running={running}
          speed={speed}
          hasStarted={hasStarted}
          locationSubscription={locationSubscription}
        />

        <ControlButtons
          running={running}
          pause={pause}
          stop={stop}
          pauseStopwatch={pauseStopwatch}
          startStopwatch={startStopwatch}
          resetStopwatch={resetStopwatch}
          resumeStopwatch={resumeStopwatch}
          stopAll={stopAll}
        />
      </View>
    </>
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
});
