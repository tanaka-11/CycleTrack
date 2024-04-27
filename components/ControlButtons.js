import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  Alert,
  Vibration,
} from "react-native";
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

    // Funções
    startMonitoring,
    pauseMonitoring,
    resumeMonitoring,
    resetMonitoring,
    stopMonitoringAndStoreData,
    savedInfos,
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
                <Text style={styles.buttonTextPause}>Pausar</Text>
              </Pressable>

              <Pressable
                style={[styles.button, styles.stopButton]}
                onPress={() => {
                  stopAll();
                  stopMonitoringAndStoreData();
                }}
              >
                <Text style={styles.buttonTextStop}>Parar</Text>
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
                resetMonitoring();
              }}
            >
              <Text style={styles.buttonTextReset}>Reset</Text>
            </Pressable>

            <Pressable
              style={[styles.button, styles.resumeButton]}
              onPress={() => {
                resumeStopwatch();
                resumeMonitoring();
              }}
            >
              <Text style={styles.buttonTextResume}>Retomar</Text>
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
            <Text style={styles.buttonTextStart}>Começar</Text>
          </Pressable>
        )}

        {stop && (
          <>
            <Pressable
              style={[styles.button, styles.resetButton]}
              onPress={() => {
                // Redefinir os states para seus valores iniciais
                // State do Cronometro
                setStop(false);
                setPause(false);
                setRunning(false);
                setTime({ hours: 0, minutes: 0, seconds: 0 });

                // State da Localização
                setSpeed(0);
                setDistance(0);

                // Função
                resetMonitoring();
              }}
            >
              <Text style={styles.buttonTextReset}>Reset</Text>
            </Pressable>

            <Pressable
              style={[styles.button, styles.resumeButton]}
              onPress={() => {
                // Redefinir os states para seus valores iniciais
                // State do Cronometro
                setStop(false);
                setPause(false);
                setRunning(false);
                setTime({ hours: 0, minutes: 0, seconds: 0 });

                // State da Localização
                setSpeed(0);
                setDistance(0);

                // Alerta de operação bem sucedida
                Vibration.vibrate();
                Alert.alert(
                  "Corrida salva!",
                  "Sua corrida foi salva com sucesso",
                  [
                    {
                      text: "Visualizar informações",
                      onPress: () => navigation.navigate("Atividades"),
                    },
                    {
                      text: "Okay",
                      style: "cancel",
                    },
                  ]
                );

                // Função
                savedInfos();
                resetMonitoring();
              }}
            >
              <Text style={styles.buttonTextResume}>Salvar</Text>
            </Pressable>
          </>
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
    backgroundColor: "rgba(46,204,113,0.13)",
    borderColor: "#2ecc71",
    borderWidth: 2,
    width: 240,
  },

  buttonTextStart: {
    color: "green",
    fontSize: 16,
    textAlign: "center",
    fontWeight: "bold",
  },

  resetButton: {
    backgroundColor: "rgba(58,34,147,0.13)",
    borderColor: "#3A2293",
    borderWidth: 2,
    marginRight: 10,
  },

  buttonTextReset: {
    color: "#3A2293",
    fontSize: 16,
    textAlign: "center",
    fontWeight: "bold",
  },

  pauseButton: {
    backgroundColor: "rgba(243,156,18,0.13)",
    borderColor: "#f39c12",
    borderWidth: 2,
  },

  buttonTextPause: {
    color: "#f39c12",
    fontSize: 16,
    textAlign: "center",
    fontWeight: "bold",
  },

  stopButton: {
    backgroundColor: "rgba(231,76,60,0.13)",
    borderColor: "#e74c3c",
    borderWidth: 2,
  },

  buttonTextStop: {
    color: "#e74c3c",
    fontSize: 16,
    textAlign: "center",
    fontWeight: "bold",
  },

  resumeButton: {
    backgroundColor: "rgba(52,152,219,0.13)",
    borderColor: "#3498db",
    borderWidth: 2,
  },

  buttonTextResume: {
    color: "#3498db",
    fontSize: 16,
    textAlign: "center",
    fontWeight: "bold",
  },

  stopButtons: {
    flexDirection: "row",
    gap: 30,
  },
});
