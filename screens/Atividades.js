import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Vibration,
} from "react-native";
import { useState, useEffect, useRef } from "react";
import MapView, { Marker } from "react-native-maps";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useSpeedContext } from "../components/SpeedContext";

export default function Atividades() {
  const { mapViewRef, data } = useSpeedContext();

  // State para registrar os dados carregados no storage
  const [listaFavoritos, setListaFavoritos] = useState(data);

  // Excluir TODAS corrida
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

  // useEffect é acionado assim que entrar na tela favoritos
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

  return (
    <View style={styles.container}>
      {listaFavoritos.length > 0 ? (
        <ScrollView>
          {listaFavoritos.map((favorito, index) => {
            if (favorito.localizacao) {
              return (
                <View key={index} style={styles.viewDados}>
                  <MapView
                    ref={mapViewRef}
                    style={styles.mapa}
                    scrollEnabled={false}
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
                  </MapView>
                  <Text>Distancia: {favorito.storedDistance}</Text>
                  <Text>Velocidade: {favorito.storedSpeed}</Text>
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

  cardDados: {
    flex: 1,
  },
});
