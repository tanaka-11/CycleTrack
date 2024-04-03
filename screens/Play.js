
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { useState, useRef } from "react";
export default function Play() {
  const [time, setTime] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const [running, setRunning] = useState(false);
  const intervalRef = useRef(null);
  const startTimeRef = useRef(0);

  // play
  const startStopwatch = () => {
    startTimeRef.current = Date.now() - (time.hours * 3600 + time.minutes * 60 + time.seconds) * 1000;
    intervalRef.current = setInterval(() => {
      const elapsedTime = Math.floor((Date.now() - startTimeRef.current) / 1000);
      const hours = Math.floor(elapsedTime / 3600);
      const minutes = Math.floor((elapsedTime % 3600) / 60);
      const seconds = elapsedTime % 60;
      setTime({ hours, minutes, seconds });
    }, 1000);
    setRunning(true);
  };

  /* Pause stopwatch */
  const pauseStopwatch = () => {
    clearInterval(intervalRef.current);
    setRunning(false);
  };

  /* Reset stopwatch */
  const resetStopwatch = () => {
    clearInterval(intervalRef.current);
    setTime({ hours: 0, minutes: 0, seconds: 0 });
    setRunning(false);
  };

  /* Resume stopwatch */
  const resumeStopwatch = () => {
    startTimeRef.current = Date.now() - (time.hours * 3600 + time.minutes * 60 + time.seconds) * 1000;
    intervalRef.current = setInterval(() => {
      const elapsedTime = Math.floor((Date.now() - startTimeRef.current) / 1000);
      const hours = Math.floor(elapsedTime / 3600);
      const minutes = Math.floor((elapsedTime % 3600) / 60);
      const seconds = elapsedTime % 60;
      setTime({ hours, minutes, seconds });
    }, 1000);
    setRunning(true);
  };
  return (
   
    <View style={styles.container}>
    <Text style={styles.header}></Text>
    <Text style={styles.subHeader}>Tempo</Text>
    <Text style={styles.timeText} > {`${time.hours.toString().padStart(2, '0')}:${time.minutes.toString().padStart(2, '0')}:${time.seconds.toString().padStart(2, '0')}`}</Text>
    <View style={styles.buttonContainer}>
      {running ? (
        <TouchableOpacity
          style={[styles.button, styles.pauseButton]}
          onPress={pauseStopwatch}
        >
          <Text style={styles.buttonText}>Pausar</Text>
        </TouchableOpacity>
      ) : (
        <>
          <TouchableOpacity
            style={[styles.button, styles.startButton]}
            onPress={startStopwatch}
          >
            <Text style={styles.buttonText}>Começar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.resetButton]}
            onPress={resetStopwatch}
          >
            <Text style={styles.buttonText}>Reset</Text>
          </TouchableOpacity>
        </>
      )}
      {!running && (
        <TouchableOpacity
          style={[styles.button, styles.resumeButton]}
          onPress={resumeStopwatch}
        >
          <Text style={styles.buttonText}>Retomar</Text>
        </TouchableOpacity>
      )}
    </View>
  </View>
);
}

const styles = StyleSheet.create({
container: {
  flex: 1,
  backgroundColor: "#fff",
  alignItems: "center",
  justifyContent: "center",
},
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
});
