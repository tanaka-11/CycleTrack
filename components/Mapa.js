import { Alert, Platform, StyleSheet, Text, View } from "react-native";
import { useEffect, useState, useRef } from "react";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import { Accelerometer } from "expo-sensors";

// useContext
import { useSpeedContext } from "./SpeedContext";

export default function Mapa({}) {
  const {
    myLocation,
    location,
    currentLocation,
    initialLocation,
    mapViewRef,
    speed,
    steps,
    distance,
    stop,
    pause,
    running,
    locationSubscription,
    startMonitoringSpeed,
    stopMonitoringSpeed,
    pauseMonitoring,
    resumeMonitoring,
  } = useSpeedContext();

  // Função para iniciar o monitoramento da velocidade do usuário
  useEffect(() => {
    if (!running) {
      startMonitoringSpeed();
    }
  }, [running]);

  // Função para parar o monitoramento da velocidade
  useEffect(() => {
    if (running && !stop && !pause) {
      stopMonitoringSpeed();
    }
  }, [!running]);

  // Função para pausar o monitoramento da velocidade
  useEffect(() => {
    if (pause && !running) {
      pauseMonitoring();
    }
  }, [!running, pause]);

  // Função para retomar o monitoramento da velocidade
  useEffect(() => {
    if (!pause) {
      resumeMonitoring();
    }
  }, [!pause]);

  // Efeito para parar o monitoramento da velocidade quando a atividade é encerrada
  useEffect(() => {
    if (!running && !pause) {
      stopMonitoringSpeed();
    }
  }, [running, locationSubscription]);

  // useEffect do acelerometro
  useEffect(() => {
    if (running) {
      if (Platform.OS === "android" || Platform.OS === "ios") {
        Accelerometer.setUpdateInterval(1000);
      }
      const subscription = Accelerometer.addListener((accelerometerData) => {
        const { x, y, z } = accelerometerData;
        const magnitude = Math.sqrt(x * x + y * y + z * z);
        const THRESHOLD = 1.2;
        if (magnitude > THRESHOLD) {
          setSteps((prevSteps) => prevSteps + 1);
        }
      });
      return () => subscription.remove();
    }
  }, [running]);

  // Exibindo a velocidade atual e a distância percorrida
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
