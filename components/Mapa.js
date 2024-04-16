import { Alert, Platform, StyleSheet, Text, View } from "react-native";
import { useEffect, useState, useRef, useCallback } from "react";
import MapView, { Marker } from "react-native-maps";
import { Accelerometer } from "expo-sensors";

// useContext
import { useSpeedContext } from "./SpeedContext";

export default function Mapa() {
  const {
    // States
    myLocation,
    initialLocation,
    mapViewRef,
    speed,
    steps,
    running,

    // Set
    setSteps,

    // Funções
    getLocation,
  } = useSpeedContext();

  // Função do acelerometro
  const handleAccelerometerData = useCallback(
    (accelerometerData) => {
      const { x, y, z } = accelerometerData;
      const magnitude = Math.sqrt(x * x + y * y + z * z);
      const THRESHOLD = 1.2;
      if (magnitude > THRESHOLD) {
        setSteps((prevSteps) => prevSteps + 1);
      }
    },
    [setSteps]
  );

  // useEffect do acelerometro
  useEffect(() => {
    if (running) {
      if (Platform.OS === "android" || Platform.OS === "ios") {
        Accelerometer.setUpdateInterval(1000);
      }
      const subscription = Accelerometer.addListener(handleAccelerometerData);
      return () => subscription.remove();
    }
  }, [running, setSteps, handleAccelerometerData]);

  // useEffect do getLocation
  useEffect(() => {
    getLocation();
  }, [running]);

  console.log(speed);
  console.log(steps);

  return (
    <>
      <View style={styles.viewMapa}>
        <MapView
          style={styles.mapa}
          mapType="standard"
          ref={mapViewRef}
          region={myLocation}
          followsUserLocation={true}
          showsUserLocation={true}
        >
          {initialLocation && <Marker coordinate={initialLocation} />}
        </MapView>
      </View>

      <View style={styles.viewDados}>
        <Text style={styles.distanceText}>
          {/* Distância percorrida: {(distance / 1000).toFixed(2)} km */}
          Distância percorrida: {steps.toFixed(2)}
        </Text>

        <Text style={styles.distanceText}>Velocidade: {speed.toFixed(2)}</Text>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  // Mapa
  mapa: {
    width: 280,
    height: 280,
  },

  // Dados
  viewDados: {
    flexDirection: "row",
    gap: 30,
    marginTop: 10,
  },

  distanceText: {
    fontSize: 18,
    marginTop: 10,
    borderColor: "#3A2293",
    borderWidth: 2,
    padding: 8,
    fontSize: 16,
    borderRadius: 8,
  },
});
