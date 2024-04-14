import { Alert, Platform, StyleSheet, Text, View } from "react-native";
import { useEffect, useState, useRef, useCallback } from "react";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import { Accelerometer } from "expo-sensors";

// useContext
import { useSpeedContext } from "./SpeedContext";

export default function Mapa() {
  const {
    // States
    location,
    initialLocation,
    mapViewRef,
    speed,
    steps,
    running,

    // Set
    setSteps,
  } = useSpeedContext();

  // useEffect do acelerometro
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

  useEffect(() => {
    if (running) {
      if (Platform.OS === "android" || Platform.OS === "ios") {
        Accelerometer.setUpdateInterval(1000);
      }
      const subscription = Accelerometer.addListener(handleAccelerometerData);
      return () => subscription.remove();
    }
  }, [running, setSteps, handleAccelerometerData]);

  console.log(speed);
  console.log(steps);

  return (
    <>
      <View style={styles.viewMapa}>
        <MapView
          ref={mapViewRef}
          mapType="standard"
          style={styles.mapa}
          region={location}
          followsUserLocation={true}
          showsUserLocation={true}
        >
          {initialLocation && <Marker coordinate={location} />}
        </MapView>
      </View>

      <View style={styles.viewDados}>
        <Text style={styles.distanceText}>
          {/* Distância percorrida: {(distance / 1000).toFixed(2)} km */}
          Distância percorrida: {steps.toFixed(2)}
        </Text>

        <Text style={styles.distanceText}>Velocidade: {speed.toFixed(3)}</Text>
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
  },
});
