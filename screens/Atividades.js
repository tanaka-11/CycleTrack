import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Vibration,
} from "react-native";
import { useState, useEffect } from "react";
import MapView, { Marker, Polyline } from "react-native-maps";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useSpeedContext } from "../components/SpeedContext";

export default function Atividades() {
  const { mapViewRef, data } = useSpeedContext();

  // State para registrar os dados carregados no storage
  const [listaFavoritos, setListaFavoritos] = useState(data);

  // Excluir TODAS corrida (Depois Excluir)
  const excluirTodasCorridas = async () => {
    Alert.alert("Excluir TODAS?", "Quer mesmo excluir TODAS suas corridas?", [
      {
        text: "Excluir",
        onPress: async () => {
          await AsyncStorage.removeItem("@infosSalvas");
          setListaFavoritos([]);
          Vibration.vibrate();
        }, // removendo itens e atualizando o state
      },
      {
        text: "Cancelar",
        style: "cancel",
      },
    ]); // Passado 3º parametro como um array com um objeto para texto do alert
  };

  // useEffect é acionado toda vez que o data(State vindo do Context) atualizar
  useEffect(() => {
    const carregarFavoritos = async () => {
      try {
        // Recuperando os dados em formato string do asyncstorage atraves do "getItem"
        const dados = await AsyncStorage.getItem("@infosSalvas");

        // Convertendo dados em objeto com JSON.parse e os guardando no state
        if (dados) {
          setListaFavoritos(JSON.parse(dados));
        }
      } catch (error) {
        console.error("Erro ao carregar os dados: " + error);
        Alert.alert("Erro", "Erro ao carregar dados.");
      }
    };
    carregarFavoritos();
  }, [data]);

  // console.log(listaFavoritos[0].time.seconds);

  return (
    <View style={styles.container}>
      {listaFavoritos.length > 0 ? (
        <ScrollView>
          {listaFavoritos.map((favorito, index) => {
            if (favorito.localizacao) {
              console.log("Favorito:");
              console.log(favorito);
              return (
                <View key={index} style={styles.viewDados}>
                  <View style={styles.viewTexto}>
                    <Text style={styles.texto}>
                      Distancia: {favorito.storedDistance.toFixed(2)}
                    </Text>
                    <Text style={styles.texto}>
                      Tempo: {favorito.storedTime.hours} h :{" "}
                      {favorito.storedTime.minutes} m :{" "}
                      {favorito.storedTime.seconds} s
                    </Text>
                  </View>

                  <MapView
                    ref={mapViewRef}
                    style={styles.mapa}
                    scrollEnabled={false}
                    zoomEnabled={false}
                    rotateEnabled={false}
                    pitchEnabled={false}
                    initialRegion={{
                      latitude: favorito.localizacao.latitude,
                      longitude: favorito.localizacao.longitude,
                      latitudeDelta: 0.005,
                      longitudeDelta: 0.005,
                    }}
                  >
                    <Marker
                      coordinate={favorito.localizacao}
                      title={`Local da sua corrida!`}
                      pinColor="blue"
                    />
                    <Polyline
                      coordinates={[favorito.localizacao]}
                      strokeWidth={5}
                    />
                  </MapView>
                </View>
              );
            }
          })}
        </ScrollView>
      ) : (
        <Text style={styles.textoSemAtividade}>
          Você não possui atividades.
        </Text>
      )}
      {listaFavoritos.length > 0 && (
        <Pressable style={styles.botao} onPress={excluirTodasCorridas}>
          <Text>Apagar</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  mapa: {
    height: 300,
    width: 300,
  },

  textoSemAtividade: {
    fontSize: 24,
    textAlign: "center",
    marginTop: 100,
  },

  viewDados: {
    justifyContent: "center",
    alignItems: "center",
    margin: 20,
  },

  viewTexto: {
    flexDirection: "row",
    gap: 20,
    justifyContent: "flex-start",
  },

  texto: {
    fontSize: 18,
  },
});
