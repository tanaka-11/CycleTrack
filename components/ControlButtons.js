import React from "react";
import { StyleSheet, Text, View, Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";

// useContext
import { useSpeedContext } from "./SpeedContext";

export default function ControlButtons({
  // Funções vindo do componente PAI (StopWatch)
  pauseStopwatch,
  startStopwatch,
  resetStopwatch,
  resumeStopwatch,
  stopAll,
  setTime,
}) {
  // Funções vindo do componente Context
  const {
    // States
    stop,
    pause,
    running,

    // Set
    setPause,
    setRunning,
    setStop,
    setDistance,
    setSpeed,
    setSteps,

    // Funções
    startMonitoring,
    stopMonitoring,
    pauseMonitoring,
    resumeMonitoring,
    stopMonitoringAndStoreData,
  } = useSpeedContext();

  // Recurso de navegação
  const navigation = useNavigation();

  return (
    <>
      <View style={styles.buttonContainer}>
        {!pause && running && (
          <>
            <View style={styles.stopButtons}>
              <Pressable
                style={[styles.button, styles.pauseButton]}
                onPress={() => {
                  pauseStopwatch();
                  pauseMonitoring();
                }}
              >
                <Text style={styles.buttonText}>Pausar</Text>
              </Pressable>

              <Pressable
                style={[styles.button, styles.stopButton]}
                onPress={() => {
                  stopAll();
                  stopMonitoringAndStoreData();
                }}
              >
                <Text style={styles.buttonText}>Parar</Text>
              </Pressable>
            </View>
          </>
        )}

        {pause && (
          <>
            <Pressable
              style={[styles.button, styles.resetButton]}
              onPress={() => {
                resetStopwatch();
                stopMonitoring();
              }}
            >
              <Text style={styles.buttonText}>Reset</Text>
            </Pressable>

            <Pressable
              style={[styles.button, styles.resumeButton]}
              onPress={() => {
                resumeStopwatch();
                resumeMonitoring();
              }}
            >
              <Text style={styles.buttonText}>Retomar</Text>
            </Pressable>
          </>
        )}

        {!running && !pause && !stop && (
          <Pressable
            style={[styles.button, styles.startButton]}
            onPress={() => {
              // State para funcionar apos Salvar
              setRunning(true);
              startStopwatch();
              startMonitoring();
            }}
          >
            <Text style={styles.buttonText}>Começar</Text>
          </Pressable>
        )}

        {stop && (
          <Pressable
            style={[styles.button, styles.resumeButton]}
            onPress={() => {
              // Redefinir os states para seus valores iniciais
              // State do Cronometro
              setStop(false);
              setPause(false);
              setRunning(false);
              setTime({ hours: 0, minutes: 0, seconds: 0 });

              // State do Acelerometro
              setSpeed(0);
              setDistance(0);
              setSteps(0);

              // Trocando de tela
              navigation.navigate("Atividades");
            }}
          >
            <Text style={styles.buttonText}>Salvar</Text>
          </Pressable>
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: "row",
    margin: 20,
    gap: 30,
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
    backgroundColor: "#4b371c",
    marginRight: 10,
  },

  pauseButton: {
    backgroundColor: "#f39c12",
  },

  stopButton: {
    backgroundColor: "#e74c3c",
  },

  resumeButton: {
    backgroundColor: "#3498db",
  },

  stopButtons: {
    flexDirection: "row",
    gap: 30,
  },

  buttonText: {
    color: "white",
    fontSize: 16,
  },
});
