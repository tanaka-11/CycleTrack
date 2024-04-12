import React from "react";
import { StyleSheet, Text, View, Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";

export default function ControlButtons({
  pause,
  running,
  stop,
  pauseStopwatch,
  startStopwatch,
  resetStopwatch,
  resumeStopwatch,
  stopAll,
  startMonitoringSpeed,
  stopMonitoringSpeed,
  pauseMonitoring,
  resumeMonitoring,
}) {
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
                  stopMonitoringSpeed;
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
                stopMonitoringSpeed;
              }}
            >
              <Text style={styles.buttonText}>Reset</Text>
            </Pressable>

            <Pressable
              style={[styles.button, styles.resumeButton]}
              onPress={() => {
                resumeStopwatch();
                resumeMonitoring;
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
              startStopwatch();
              startMonitoringSpeed;
            }}
          >
            <Text style={styles.buttonText}>Começar</Text>
          </Pressable>
        )}

        {stop && (
          <Pressable
            style={[styles.button, styles.resumeButton]}
            onPress={() => {
              stopAll();
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
