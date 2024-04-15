import {
  Button,
  Image,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { auth } from "../firebaseConfig";
import { signOut } from "firebase/auth";

import imagem from "../assets/favicon.png";

export default function Home({ navigation }) {
  // const { email } = auth.currentUser;
  // const { displayName } = auth.currentUser;
  // const { photoURL } = auth.currentUser;

  return (
    <ScrollView>
      <View style={styles.container}>
        <View style={styles.containerPerfil}>
          <StatusBar barStyle="dark-content" />
          <Pressable onPress={() => navigation.navigate("Perfil")}>
            <Image
              source={{ uri: "https://via.placeholder.com/150" || photoURL }}
              style={[styles.image, { borderRadius: 85 }]}
            />
          </Pressable>

          <View style={styles.topo}>
            <View style={styles.infos}>
              <Text style={styles.bemVindo}>Bem-vindo(a)</Text>
              <Text style={styles.nomeUsuario}>Dsiplay nome </Text>
            </View>
            <Pressable onPress={() => navigation.navigate("Perfil")}>
              <Text style={styles.alterarPerfil}>Alterar Perfil</Text>
            </Pressable>
          </View>
        </View>

        {/* Progresso */}
        <Text style={styles.titulo}>Seu progresso semanal</Text>
        <View style={styles.progresso}>
          <View style={styles.viewAtividade}>
            <Text style={styles.viewTitulo}>Atividade</Text>
            <Text style={styles.textoDados}>4</Text>
          </View>

          <View style={styles.viewTempo}>
            <Text style={styles.viewTitulo}>Tempo</Text>
            <Text style={styles.textoDados}>1h 45min</Text>
          </View>

          <View style={styles.viewDistancia}>
            <Text style={styles.viewTitulo}>Distancia</Text>
            <Text style={styles.textoDados}>20km</Text>
          </View>
        </View>

        {/* Atividade */}
        <Text style={styles.titulo}>Sua ultima atividade</Text>
        <View style={styles.atividadeRecente}>
          <Text style={styles.textoDados}>14/03/2024 às 14:00</Text>

          <View style={styles.viewDistancia}>
            <Text style={styles.viewTitulo}>Distancia</Text>
            <Text style={styles.textoDados}>8.5km</Text>
          </View>

          <View style={styles.viewTempo}>
            <Text style={styles.viewTitulo}>Tempo</Text>
            <Text style={styles.textoDados}>39min 10s</Text>
          </View>
        </View>
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
    padding: 10,
    marginVertical: 20,
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: "#3D2498",
    borderStyle: "dashed",
    borderRadius: 5,
  },
  infos: {
    marginLeft: 5,
  },
  bemVindo: {
    fontSize: 24,
    marginVertical: 16,
    fontWeight: "500",
  },
  nomeUsuario: {
    fontSize: 16,
    fontWeight: "300",
  },
  image: {
    width: 64,
    height: 64,
    marginTop: 40,

    position: "absolute",
    right: 20,
    top: 20,

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
    // alignItems: "flex-start",
  },

  titulo: {
    fontSize: 16,
    fontWeight: "bold",
    margin: 20,
  },

  viewTitulo: {},

  textoDados: {},

  viewAtividade: {},

  viewTempo: {},

  viewDistancia: {},
});
