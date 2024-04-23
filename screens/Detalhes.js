import { StyleSheet, Text, View } from "react-native";
import { useRoute } from "@react-navigation/native";
import MapView, { Marker } from "react-native-maps";
import { useSpeedContext } from "../components/SpeedContext";

export default function Detalhes() {
  // Recurso de navegação
  const route = useRoute();

  // Dados da atividade
  const { atividade } = route.params;

  const { mapViewRef } = useSpeedContext();
  console.log(atividade);
  return (
    <View>
      <Text>Atividade Detalhes</Text>
      <Text>
        Data: {atividade.currentDate} as {atividade.currentTime}
      </Text>
      <Text>Distância: {atividade.storedDistance.toFixed(2)}</Text>
      <Text>Velocidade: {atividade.storedSpeed.toFixed(2)} </Text>
      <Text>
        Tempo: {atividade.storedTime.hours} h : {atividade.storedTime.minutes} m
        : {atividade.storedTime.seconds} s
      </Text>
      <MapView
        ref={mapViewRef}
        style={styles.mapa}
        scrollEnabled={false}
        zoomEnabled={false}
        rotateEnabled={false}
        pitchEnabled={false}
        initialRegion={{
          latitude: atividade.localizacao.latitude,
          longitude: atividade.localizacao.longitude,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        }}
      >
        <Marker
          coordinate={atividade.localizacao}
          title={`Local da sua corrida!`}
          pinColor="blue"
        />
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  mapa: {
    marginVertical: 15,
    height: 300,
    width: 300,
  },
});
