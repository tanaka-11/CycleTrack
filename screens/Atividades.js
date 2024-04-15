import { Alert, ScrollView, StyleSheet, Text, View } from "react-native";
import { useState, useEffect, useRef } from "react";
import MapView, { Marker } from "react-native-maps";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useSpeedContext } from "../components/SpeedContext";

export default function Atividades() {
  const { mapViewRef } = useSpeedContext();

  // State para registrar os dados carregados no storage
  const [listaFavoritos, setListaFavoritos] = useState([]);

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
  }, []);

  console.log(listaFavoritos);

  return (
    <View style={styles.container}>
      <ScrollView>
        {listaFavoritos.map((favorito, index) => {
          if (favorito.localizacao) {
            return (
              <>
                <View key={index} style={styles.viewDados}>
                  <View style={styles.cardDados}>
                    <MapView
                      ref={mapViewRef}
                      style={styles.mapa}
                      scrollEnabled={false}
                      initialRegion={{
                        latitude: listaFavoritos[0].localizacao.latitude,
                        longitude: listaFavoritos[0].localizacao.longitude,
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
                </View>
              </>
            );
          }
        })}
      </ScrollView>
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

  viewDados: {
    justifyContent: "center",
    alignItems: "center",
    margin: 20,
  },

  cardDados: {
    flex: 1,
  },
});
