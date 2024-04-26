import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Image,
  StatusBar,
} from "react-native";
import { useEffect, useState } from "react";
import { useRoute } from "@react-navigation/native";
import { useSpeedContext } from "../components/SpeedContext";

// Dependencias
import MapView, { Marker, Polyline } from "react-native-maps";
import { getDatabase, ref, onValue } from "firebase/database";
import auth from "../firebaseConfig.js";

export default function Home({ navigation }) {
  // dados vindo do hook useContext
  const { mapViewRef, data } = useSpeedContext();
  // State guardando objeto vindo useContext
  const [listaFavoritos, setListaFavoritos] = useState(data);

  // Recuro de navegação
  const route = useRoute();

  // Caso usuario nao esteja logado
  let displayName = "Convidado";
  let photoURL = null;

  if (route.params) {
    // Se houver parâmetros de rota, use-os
    displayName = route.params.displayName;
    photoURL = route.params.photoURL;
  } else if (auth.currentUser) {
    // Se não houver parâmetros de rota, mas o usuário estiver logado, use os dados do usuário
    displayName = auth.currentUser.displayName;
    photoURL = auth.currentUser.photoURL;
  } else {
    // Se não houver parâmetros de rota e o usuário não estiver logado, use os valores padrão
    displayName;
    photoURL;
  }

  // UseEffect para carregar os dados de atividades sempre que uma nova atividade for salva
  useEffect(() => {
    const carregarFavoritos = async () => {
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
      } catch (error) {
        console.error("Erro ao carregar os dados: " + error);
        Alert.alert("Erro", "Erro ao carregar os dados");
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
  let totalIndex = listaFavoritos.reduce((index) => {
    return (total = index + 1);
  }, 0);

  return (
    <ScrollView>
      <StatusBar backgroundColor="#A8A0D0" />
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
        <Text style={styles.titulo}>Seu progresso</Text>

        <View style={styles.progresso}>
          <View style={styles.viewAtividade}>
            <Text style={styles.viewTitulo}>Atividade</Text>
            <Text style={styles.textoDados}>{totalIndex}</Text>
          </View>
          <View style={styles.viewAtividade}>
            <Text style={styles.viewTitulo}>Tempo</Text>
            <Text style={styles.textoDados}>
              {totalTime.hours} h {totalTime.minutes} m {totalTime.seconds} s
            </Text>
          </View>
          <View style={styles.viewAtividade}>
            <Text style={styles.viewTitulo}>Distancia</Text>
            <Text style={styles.textoDados}>
              {(totalDistance / 1000).toFixed(2)} km
            </Text>
          </View>
        </View>

        {/* Atividade */}
        {listaFavoritos.length > 0 && (
          <>
            <Text style={styles.tituloUltimaAtividade}>
              Sua ultima atividade
            </Text>
            <View style={styles.atividadeRecente}>
              <View style={styles.viewDistanciaRecentes}>
                <View style={styles.viewDistanciaRecentes2}>
                  <View style={styles.viewData}>
                    <Text style={styles.viewTitulo}>Data</Text>
                    <Text style={styles.textoDados}>
                      {listaFavoritos[listaFavoritos.length - 1].currentDate}
                    </Text>
                  </View>

                  <View style={styles.viewDistancia}>
                    <Text style={styles.viewTitulo}>Distancia</Text>
                    <Text style={styles.textoDados}>
                      {listaFavoritos[
                        listaFavoritos.length - 1
                      ].storedDistance.toFixed(2)}{" "}
                      km
                    </Text>
                  </View>

                  <View style={styles.viewTempo}>
                    <Text style={styles.viewTitulo}>Tempo</Text>
                    <Text style={styles.textoDados}>
                      {
                        listaFavoritos[listaFavoritos.length - 1].storedTime
                          .hours
                      }{" "}
                      h{" "}
                      {
                        listaFavoritos[listaFavoritos.length - 1].storedTime
                          .minutes
                      }{" "}
                      m{" "}
                      {
                        listaFavoritos[listaFavoritos.length - 1].storedTime
                          .seconds
                      }{" "}
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
                      pinColor="blue"
                      title={`Local inicial da sua corrida`}
                    />

                    <Marker
                      coordinate={
                        listaFavoritos[listaFavoritos.length - 1]
                          .localizacaoFinal
                      }
                      pinColor="red"
                      title={`Local final da sua corrida`}
                    />

                    <Polyline
                      coordinates={[
                        listaFavoritos[listaFavoritos.length - 1].localizacao,
                        listaFavoritos[listaFavoritos.length - 1]
                          .localizacaoFinal,
                      ]}
                      strokeWidth={5}
                    />
                  </MapView>
                </View>
              </View>
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
    marginHorizontal: 20,
    borderWidth: 1.4,
    borderColor: "#3D2498",
    borderStyle: "dashed",
    borderRadius: 5,
    backgroundColor: "rgba(65, 44, 171, 0.15)",
  },

  dadosUsuario: {
    flexDirection: "row",
    gap: 80,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 6,
    marginHorizontal: 6,
  },

  bemVindo: {
    fontSize: 22,
    marginVertical: 2,
    fontWeight: "500",
    color: "#3A2293",
  },

  nomeUsuario: {
    fontSize: 18,
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
    marginBottom: 34,
  },

  titulo: {
    fontSize: 20,
    color: "#3A2293",
    fontWeight: "bold",
    marginHorizontal: 20,
    marginVertical: 15,
  },

  tituloUltimaAtividade: {
    fontSize: 20,
    color: "#3A2293",
    fontWeight: "bold",
    marginHorizontal: 20,
    marginVertical: 15,
    textAlign: "center",
  },

  mapa: {
    width: 400,
    height: 300,
  },

  viewMapa: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 30,
  },

  viewTitulo: {
    textAlign: "center",
    color: "#3A2293",
    fontWeight: "bold",
  },

  textoDados: {
    textAlign: "center",
  },

  viewAtividade: {
    borderColor: "#3A2293",
    borderWidth: 2,
    padding: 8,
    width: 100,
    borderRadius: 8,
    backgroundColor: "rgba(65, 44, 171, 0.08)",
  },

  viewTempo: {
    justifyContent: "flex-start",
  },

  viewDistancia: {
    marginRight: 40,
    marginLeft: 40,
  },

  textoBotaoVazado: {
    color: "#3A2293",
    textAlign: "center",
  },

  botaoPreenchido: {
    backgroundColor: "#412CAB",
    padding: 8,
    width: 100,
    borderRadius: 8,
  },

  textoBotaoPreenchido: {
    color: "#ffffff",
    textAlign: "center",
  },

  botaoVazadoPreto: {
    borderColor: "rgba(13, 30, 82, 0.5)",
    borderWidth: 2,
    padding: 8,
    width: 100,
    borderRadius: 8,
  },

  textoBotaoVazadoP: {
    color: "#0A045A",
    textAlign: "center",
  },

  botaoPadrao: {
    backgroundColor: "#5442D2",
    padding: 8,
    borderRadius: 8,
    flex: 1,
    width: 120,
    height: 45,
  },

  textoBotaoPadrao: {
    color: "#fff",
    textAlign: "center",
    alignItems: "center",
    fontSize: 22,
  },

  sessaoTituloIcon: {
    marginHorizontal: 20,
    marginVertical: 10,
    flexDirection: "row",
    gap: 100,
    alignItems: "center",
  },

  viewDistanciaRecentes: {
    marginBottom: 16,
    gap: 15,
    alignItems: "center",
    backgroundColor: "rgba(65, 44, 171, 0.15)",
    padding: 16,
    borderColor: "#412CAB",
    borderWidth: 1.3,
  },

  viewDistanciaRecentes2: {
    flexDirection: "row",
  },
});
