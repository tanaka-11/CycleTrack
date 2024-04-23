import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Pressable, // Não apagar, botão para poder apagar atividades
} from "react-native";
import { useState, useEffect } from "react";
import MapView, { Marker, Polyline } from "react-native-maps";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useSpeedContext } from "../components/SpeedContext";

// Recursos de navegação
import { useNavigation } from "@react-navigation/native";

export default function Atividades() {
  const { mapViewRef, data } = useSpeedContext();

  // State para registrar os dados carregados no storage
  const [listaFavoritos, setListaFavoritos] = useState(data);

  // Recursos de navegação
  const navigation = useNavigation();

  // Excluir TODAS corrida
  const excluirTodasCorridas = async () => {
    Alert.alert("Excluir TODAS?", "Quer mesmo excluir TODAS suas corridas?", [
      {
        text: "Excluir",
        onPress: async () => {
          await AsyncStorage.removeItem("@infosSalvas");
          setListaFavoritos([]);
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

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Suas Atividades</Text>
      {listaFavoritos.length > 0 ? (
        <ScrollView>
          {listaFavoritos.reverse().map((favorito, index) => {
            if (favorito.localizacao) {
              return (
                <Pressable
                  key={index}
                  onPress={() =>
                    navigation.navigate("Detalhes", { atividade: favorito })
                  }
                >
                  <View key={index} style={styles.viewDados}>
                    <View style={styles.viewTexto}>
                      <Text style={styles.texto}>
                        Distancia:{" "}
                        <Text style={styles.texto2}>
                          {favorito.storedDistance.toFixed(2)}
                        </Text>
                      </Text>

                      <Text style={styles.texto}>
                        Tempo:{" "}
                        <Text style={styles.texto2}>
                          {favorito.storedTime.hours} h :{" "}
                          {favorito.storedTime.minutes} m :{" "}
                          {favorito.storedTime.seconds} s
                        </Text>
                      </Text>
                    </View>

                    <View style={styles.viewMapa}>
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
                          pinColor="blue"
                          title={`Local inicial da sua corrida`}
                        />

                        <Marker
                          coordinate={favorito.localizacaoFinal}
                          pinColor="red"
                          title={`Local final da sua corrida`}
                        />

                        <Polyline
                          coordinates={[
                            favorito.localizacao,
                            favorito.localizacaoFinal,
                          ]}
                          strokeWidth={5}
                        />
                      </MapView>
                    </View>
                  </View>
                </Pressable>
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

  titulo: {
    margin: 20,
    color: "#000",
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "left",
  },

  mapa: {
    marginVertical: 15,
    height: 300,
    width: 300,
  },

  viewMapa: {
    justifyContent: "center",
    alignItems: "center",
  },

  textoSemAtividade: {
    fontSize: 24,
    textAlign: "center",
    marginTop: 100,
  },

  viewDados: {
    backgroundColor: "rgba(65, 44, 171, 0.15)",
    padding: 20,
    borderRadius: 20,

    margin: 20,
  },

  viewTexto: {
    alignItems: "flex-start",
    justifyContent: "flex-start",
  },

  texto: {
    fontSize: 16,
    color: "#3A2293",
    fontWeight: "bold",
  },

  texto2: {
    fontSize: 16,
    color: "#000",
    fontWeight: "400",
  },
});
