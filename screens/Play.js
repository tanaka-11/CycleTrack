import {
  StyleSheet,
  Text,
  View,
  Pressable,
  ScrollView,
  Platform,
} from "react-native";
import { useState, useEffect, useRef } from "react";

// Componentes
import Stopwatch from "../components/Stopwatch";
import Mapa from "../components/Mapa";

export default function Play() {
  // States utilizados para as funções de "Play"
  const [time, setTime] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const [running, setRunning] = useState(null);
  const [pause, setPause] = useState();
  const intervalRef = useRef(null);
  const startTimeRef = useRef(0);

  // States de Velocidade e Distancia
  const [steps, setSteps] = useState(0);
  const [speed, setSpeed] = useState(0);

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

  return (
    <ScrollView>
      <View style={styles.container}>
        <Stopwatch
          time={time}
          running={running}
          pause={pause}
          setTime={setTime}
          setRunning={setRunning}
          setPause={setPause}
          intervalRef={intervalRef}
          startTimeRef={startTimeRef}
        />

        <Mapa setSteps={setSteps} setSpeed={setSpeed} />
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
});
