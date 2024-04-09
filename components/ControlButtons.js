import React from "react";
import { StyleSheet, Text, View, Pressable } from "react-native";

export default function ControlButtons({
  pause,
  running,
  pauseStopwatch,
  startStopwatch,
  resetStopwatch,
  resumeStopwatch,
}) {
  return (
    <>
      <View style={styles.buttonContainer}>
        {!pause && running && (
          <>
            <View style={styles.stopButtons}>
              <Pressable
                style={[styles.button, styles.pauseButton]}
                onPress={pauseStopwatch}
              >
                <Text style={styles.buttonText}>Pausar</Text>
              </Pressable>

              <Pressable
                style={[styles.button, styles.stopButton]}
                onPress={resetStopwatch}
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
              onPress={resetStopwatch}
            >
              <Text style={styles.buttonText}>Reset</Text>
            </Pressable>

            <Pressable
              style={[styles.button, styles.resumeButton]}
              onPress={resumeStopwatch}
            >
              <Text style={styles.buttonText}>Retomar</Text>
            </Pressable>
          </>
        )}

        {!running && !pause && (
          <Pressable
            style={[styles.button, styles.startButton]}
            onPress={startStopwatch}
          >
            <Text style={styles.buttonText}>Começar</Text>
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
