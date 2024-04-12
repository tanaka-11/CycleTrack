import { StyleSheet, Text, View, Pressable } from "react-native";
import { useState, useRef } from "react";
import ControlButtons from "./ControlButtons"; // Componente para os botões de controle
import {
  startMonitoringSpeed,
  stopMonitoringSpeed,
  pauseMonitoring,
  resumeMonitoring,
} from "./Mapa";

export default function Stopwatch({}) {
  // Estados para controlar o tempo do cronômetro
  const [time, setTime] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const [pause, setPause] = useState(false); // Estado para indicar pausa
  const [running, setRunning] = useState(false); // Estado para indicar se o cronômetro está em execução
  const [stop, setStop] = useState(false); // Estado para indicar se o cronômetro foi parado
  const intervalRef = useRef(null); // Referência para o intervalo do cronômetro
  const startTimeRef = useRef(0); // Referência para o tempo de início do cronômetro

  // Estados para a contagem de passos e velocidade
  const [steps, setSteps] = useState(0);
  const [speed, setSpeed] = useState(0);
  const [distance, setDistance] = useState(0);

  const [locationSubscription, setLocationSubscription] = useState(null);

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
  };

  // Função para pausar o cronômetro
  const pauseStopwatch = () => {
    // Parar o intervalo
    clearInterval(intervalRef.current);

    // Atualizar os estados
    setRunning(false);
    setPause(true);
    setDistance(steps);

    // Pausar o monitoramento de velocidade
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

    // Parar o monitoramento de velocidade
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

    // Retomar o monitoramento de velocidade
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
    setSteps(steps);

    // Parar o monitoramento de velocidade
  };

  /* 1) Função teste está no PAI (Stopwatch) 
  e queremos torná-la acessível pelo FILHO (Mapa). */
  const teste = () => {
    console.log("oi");
  };

  return (
    <>
      <View style={styles.container}>
        <Text style={styles.header}></Text>
        <Text style={styles.subHeader}>Tempo</Text>

        {/* Exibir o tempo atual */}
        <Text style={styles.timeText}>
          {`${time.hours.toString().padStart(2, "0")}:${time.minutes
            .toString()
            .padStart(2, "0")}:${time.seconds.toString().padStart(2, "0")}`}
        </Text>

        {/* Componente do mapa para exibir a localização */}
        <Mapa
          pause={pause}
          running={running}
          setRunning={setRunning}
          setPause={setPause}
          setSpeed={setSpeed}
          setDistance={setDistance}
          setSteps={setSteps}
          setLocationSubscription={setLocationSubscription}
          /* 2) Criamos uma prop especificamente para a função
          PAI ficar acessível pelo FILHO, e passamos o nome da função nesta prop. */
        />

        {/* Componente para os botões de controle */}
        <ControlButtons
          // States
          running={running}
          pause={pause}
          stop={stop}
          // Função do Cronometro
          pauseStopwatch={pauseStopwatch}
          startStopwatch={startStopwatch}
          resetStopwatch={resetStopwatch}
          resumeStopwatch={resumeStopwatch}
          stopAll={stopAll}
          // Função de Speed e Steps
          startMonitoringSpeed={startMonitoringSpeed}
          stopMonitoringSpeed={stopMonitoringSpeed}
          pauseMonitoring={pauseMonitoring}
          resumeMonitoring={resumeMonitoring}
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
