import { Button, Image, Pressable, StyleSheet, Text, View } from "react-native";
import { useRoute } from "@react-navigation/native";

// Importações Dependencias
import MapView, { Marker } from "react-native-maps";
import { useSpeedContext } from "../components/SpeedContext";
import { auth } from "../firebaseConfig";

export default function Detalhes() {
  // Recurso de navegação
  const route = useRoute();

  // Dados da atividade
  const { atividade } = route.params;

  // Referencia do Mapa
  const { mapViewRef } = useSpeedContext();

  // Variaveis para caso usuario não esteja logado
  let displayName = "Convidado";
  let photoURL = null;

  // Condicional caso usuario estiver logado
  if (auth.currentUser) {
    displayName = auth.currentUser.displayName;
    photoURL = auth.currentUser.photoURL;
  }

  // Objeto com os dados
  console.log("Tela Detalhes");
  console.log(atividade);
  return (
    <View style={styles.container}>
      <View style={styles.topo}>
        <View style={styles.dadosUsuario}>
          <Image
            source={{ uri: photoURL || "https://via.placeholder.com/150" }}
            style={[
              styles.image,
              { borderRadius: 85, backgroundColor: "#ad91cc" },
            ]}
          />
          <View style={styles.infos}>
            <Text style={styles.nomeUsuario}>{displayName} </Text>
            <Text style={styles.data}>
              {atividade.currentDate} as {atividade.currentTime}
            </Text>
          </View>
        </View>
      </View>

      <View>
        <View style={styles.viewMapa}>
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

        <View style={styles.viewDados}>
          <View style={styles.viewItem}>
            <Text style={styles.tituloTexto}>Distância</Text>
            <Text style={styles.corpoTexto}>
              {atividade.storedDistance.toFixed(2)}
            </Text>
          </View>

          <View style={styles.viewItem}>
            <Text style={styles.tituloTexto}>Tempo</Text>
            <Text style={styles.corpoTexto}>
              {atividade.storedTime.hours} h : {atividade.storedTime.minutes} m
              : {atividade.storedTime.seconds} s
            </Text>
          </View>

          <View style={styles.viewItem}>
            <Text style={styles.tituloTexto}>Velocidade Média</Text>
            <Text style={styles.corpoTexto}>
              {atividade.storedSpeed.toFixed(2)}
            </Text>
          </View>

          <View style={styles.viewItem}>
            <Text style={styles.tituloTexto}>Velocidade Máxima:</Text>
            <Text style={styles.corpoTexto}>
              {atividade.storedSpeed.toFixed(2)}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.viewBotao}>
        <Pressable style={styles.botaoVazado}>
          <Text style={styles.textoBotaoVazado}>Compartilhar</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },

  //Perfil
  topo: {
    padding: 8,
    marginTop: 16,
  },

  dadosUsuario: {
    flexDirection: "row",
    gap: 20,
    marginVertical: 6,
    marginHorizontal: 6,
  },

  nomeUsuario: {
    fontSize: 20,
    fontWeight: "500",
    color: "#3A2293",
  },

  data: {
    fontSize: 16,
    fontWeight: "300",
  },

  image: {
    width: 64,
    height: 64,
    borderWidth: 1,
    borderRadius: 50,
    borderColor: "#3D2498",
  },

  // Mapa
  mapa: {
    height: 350,
    width: 350,
  },

  viewMapa: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    marginTop: 8,
  },

  // Dados Velocidade/Distancia
  viewDados: {
    flexDirection: "row",
    gap: 16,
    margin: 8,
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "center",
  },

  viewItem: {
    width: "40%",
  },

  tituloTexto: {
    color: "#3A2293",
    fontWeight: "500",
    fontSize: 16,
    textAlign: "center",
  },

  corpoTexto: {
    fontSize: 16,
    textAlign: "center",
  },

  // Pressable
  viewBotao: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },

  botaoVazado: {
    borderColor: "#3A2293",
    borderWidth: 2,
    padding: 8,
    width: 200,
    borderRadius: 8,
  },

  textoBotaoVazado: {
    color: "#3A2293",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 16,
  },
});
