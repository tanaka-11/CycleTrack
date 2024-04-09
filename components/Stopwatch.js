import { StyleSheet, Text, View, Pressable } from "react-native";
import { useState, useRef } from "react";
import ControlButtons from "./ControlButtons";

export default function Stopwatch() {
  // States
  const [time, setTime] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const [pause, setPause] = useState(false);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef(null);
  const startTimeRef = useRef(0);

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
  };

  // Pause stopwatch
  const pauseStopwatch = () => {
    clearInterval(intervalRef.current);
    setRunning(false);
    setPause(true);
  };

  // Reset stopwatch
  const resetStopwatch = () => {
    clearInterval(intervalRef.current);
    setTime({ hours: 0, minutes: 0, seconds: 0 });
    setRunning(false);
    setPause(false);
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

        <ControlButtons
          running={running}
          pause={pause}
          pauseStopwatch={pauseStopwatch}
          startStopwatch={startStopwatch}
          resetStopwatch={resetStopwatch}
          resumeStopwatch={resumeStopwatch}
        />
      </View>
    </>
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
});
