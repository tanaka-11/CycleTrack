import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  Pressable,
} from "react-native";
import { useState, useEffect } from "react";
import { useSpeedContext } from "../components/SpeedContext";

// Dependecias
import MapView, { Marker, Polyline } from "react-native-maps";
import auth from "../firebase.config.js";
import { getDatabase, ref, onValue } from "firebase/database";

// Recursos de navegação
import { useNavigation } from "@react-navigation/native";

export default function Atividades() {
  // State para loading
  const [loading, setLoading] = useState(false);

  // Dados vindo do useContext
  const { mapViewRef, data } = useSpeedContext();

  // State para registrar os dados carregados no storage
  const [listaFavoritos, setListaFavoritos] = useState(data);

  // Recursos de navegação
  const navigation = useNavigation();

  // useEffect é acionado toda vez que o data(State vindo do Context) atualizar
  useEffect(() => {
    const carregarFavoritos = async () => {
      setLoading(true);
      try {
        // Identificador de Usuario
        const userUID = auth.currentUser.uid;

        // Referência para o local no banco de dados onde você salvou suas informações
        const db = getDatabase();
        const dbRef = ref(db, "infosSalvas/" + userUID);

        // Ouvindo as alterações nos dados
        onValue(dbRef, (snapshot) => {
          const data = snapshot.val();
          if (data) {
            // Convertendo os dados em uma lista e guardando no state
            const listaFavoritos = Object.values(data);
            setListaFavoritos(listaFavoritos);
          }
        });
        setLoading(false);
      } catch (error) {
        console.error("Erro ao carregar os dados: " + error);
        Alert.alert("Erro", "Erro ao carregar os dados");
      }
    };

    carregarFavoritos();
  }, [data]);

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Suas Atividades</Text>

      {loading ? (
        <ActivityIndicator animating={loading} size="large" color="#3D2498" />
      ) : listaFavoritos.length > 0 ? (
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
                      <Text style={styles.textoTitulo}>
                        Distancia:{" "}
                        <Text style={styles.textoCorpo}>
                          {favorito.storedDistance.toFixed(2)} km
                        </Text>
                      </Text>

                      <Text style={styles.textoTitulo}>
                        Tempo:{" "}
                        <Text style={styles.textoCorpo}>
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  titulo: {
    margin: 20,
    color: "#3A2293",
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
    borderRadius: 6,
    borderColor: "#412CAB",
    borderWidth: 1,
    margin: 20,
  },

  viewTexto: {
    alignItems: "flex-start",
    justifyContent: "flex-start",
  },

  textoTitulo: {
    fontSize: 16,
    color: "#3A2293",
    fontWeight: "bold",
  },

  textoCorpo: {
    fontSize: 16,
    color: "#000",
    fontWeight: "400",
  },
});
