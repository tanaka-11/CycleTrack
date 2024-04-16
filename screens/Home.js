import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Image,
} from "react-native";
import { useSpeedContext } from "../components/SpeedContext";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import MapView, { Marker } from "react-native-maps";
import { auth } from "../firebaseConfig";

export default function Home({ navigation }) {
  // dados vindo do hook useContext
  const { mapViewRef, data } = useSpeedContext();
  // State guardando objeto vindo useContext
  const [listaFavoritos, setListaFavoritos] = useState(data);

  // Caso usuario nao esteja logado
  let displayName = "Convidado";
  let photoURL = null;

  // Se estiver logado
  if (auth.currentUser) {
    displayName = auth.currentUser.displayName;
    photoURL = auth.currentUser.photoURL;
  }

  // UseEffect para carregar os dados de atividades sempre que uma nova atividade for salva
  useEffect(() => {
    const carregarFavoritos = async () => {
      try {
        // Recuperando os dados no async
        const dados = await AsyncStorage.getItem("@infosSalvas");

        // Conversão em objetos guardado no State
        if (dados) {
          setListaFavoritos(JSON.parse(dados));
        }
      } catch (error) {
        console.error("Error", "Erro ao carregar dados.");
      }
    };
    carregarFavoritos();
  }, [data]);

  // Funções de soma total
  // Distancia
  let totalDistance = listaFavoritos.reduce((total, favorito) => {
    return total + parseFloat(favorito.storedDistance);
  }, 0);

  // Tempo
  let totalTime = listaFavoritos.reduce(
    (total, favorito) => {
      total.hours += favorito.storedTime.hours;
      total.minutes += favorito.storedTime.minutes;
      total.seconds += favorito.storedTime.seconds;

      if (total.seconds >= 60) {
        total.minutes += Math.floor(total.seconds / 60);
        total.seconds = total.seconds % 60;
      }

      if (total.minutes >= 60) {
        total.hours += Math.floor(total.minutes / 60);
        total.minutes = total.minutes % 60;
      }

      return total;
    },
    { hours: 0, minutes: 0, seconds: 0 }
  );

  // Index
  let totalIndex = listaFavoritos.reduce((total, favorito, index) => {
    return (total = index + 1);
  }, 0);

  return (
    <ScrollView>
      <View style={styles.container}>
        <View style={styles.topo}>
          <View style={styles.dadosUsuario}>
            <View style={styles.infos}>
              <Text style={styles.bemVindo}>Bem-vindo(a)</Text>
              <Text style={styles.nomeUsuario}>{displayName} </Text>
            </View>
            <Pressable
              onPress={() => navigation.navigate("Perfil")}
              title="Perfil"
            >
              <Image
                source={{ uri: photoURL || "https://via.placeholder.com/150" }}
                style={[
                  styles.image,
                  { borderRadius: 85, backgroundColor: "#ad91cc" },
                ]}
              />
            </Pressable>
          </View>
        </View>

        {/* Progresso */}
        <Text style={styles.titulo}>Seu progresso semanal</Text>

        <View style={styles.progresso}>
          <View style={styles.viewAtividade}>
            <Text style={styles.viewTitulo}>Atividade</Text>
            <Text style={styles.textoDados}>{totalIndex}</Text>
          </View>
          <View style={styles.viewTempo}>
            <Text style={styles.viewTitulo}>Tempo</Text>
            <Text style={styles.textoDados}>
              {totalTime.hours} h {totalTime.minutes} m {totalTime.seconds} s
            </Text>
          </View>
          <View style={styles.viewDistancia}>
            <Text style={styles.viewTitulo}>Distancia</Text>
            <Text style={styles.textoDados}>{totalDistance.toFixed(2)} m</Text>
          </View>
        </View>

        {/* Atividade */}
        {listaFavoritos.length > 0 && (
          <>
            <Text style={styles.titulo}>Sua ultima atividade</Text>
            <View style={styles.atividadeRecente}>
              <Text style={styles.textoDados}>(Em Breve)</Text>

              <View style={styles.viewDistancia}>
                <Text style={styles.viewTitulo}>Distancia</Text>
                <Text style={styles.textoDados}>
                  {listaFavoritos[listaFavoritos.length - 1].storedDistance} m
                </Text>
              </View>

              <View style={styles.viewTempo}>
                <Text style={styles.viewTitulo}>Tempo</Text>
                <Text style={styles.textoDados}>
                  {listaFavoritos[listaFavoritos.length - 1].storedTime.hours} h{" "}
                  {listaFavoritos[listaFavoritos.length - 1].storedTime.minutes}{" "}
                  m{" "}
                  {listaFavoritos[listaFavoritos.length - 1].storedTime.seconds}{" "}
                  s
                </Text>
              </View>
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
                  latitude:
                    listaFavoritos[listaFavoritos.length - 1].localizacao
                      .latitude,
                  longitude:
                    listaFavoritos[listaFavoritos.length - 1].localizacao
                      .longitude,
                  latitudeDelta: 0.005,
                  longitudeDelta: 0.005,
                }}
              >
                <Marker
                  coordinate={
                    listaFavoritos[listaFavoritos.length - 1].localizacao
                  }
                  title={`Local da sua corrida!`}
                  pinColor="blue"
                />
              </MapView>
            </View>
          </>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  //Perfil
  topo: {
    padding: 6,
    marginVertical: 32,
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: "#3D2498",
    borderStyle: "dashed",
    borderRadius: 5,
  },

  dadosUsuario: {
    flexDirection: "row",
    gap: 80,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 6,
  },

  bemVindo: {
    fontSize: 22,
    marginVertical: 16,
    fontWeight: "500",
  },

  nomeUsuario: {
    fontSize: 14,
    fontWeight: "300",
  },

  image: {
    width: 64,
    height: 64,

    borderWidth: 1,
    borderRadius: 50,
    borderColor: "#3D2498",
  },

  alterarPerfil: {
    textAlign: "center",
    color: "#3D2498",
    fontSize: 16,
  },

  //Progresso
  progresso: {
    flexDirection: "row",
    justifyContent: "space-between",
    margin: 20,
  },

  atividadeRecente: {
    flexDirection: "row",
    justifyContent: "flex-start",
    margin: 10,
    gap: 20,
  },

  titulo: {
    fontSize: 16,
    fontWeight: "bold",
    margin: 20,
  },

  mapa: {
    width: 400,
    height: 360,
    marginTop: 10,
    marginBottom: 20,
  },

  viewMapa: {
    justifyContent: "flex-start",
  },

  viewTitulo: {},

  textoDados: {},

  viewAtividade: {},

  viewTempo: {},

  viewDistancia: {},
});
