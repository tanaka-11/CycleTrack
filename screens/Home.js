import { ScrollView, StyleSheet, Text, View } from "react-native";
import SafeContainer from "../components/SafeCintainer";

export default function Home() {
  return (
    <SafeContainer>
      <ScrollView>
        <View style={styles.container}>
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
    </SafeContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

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
