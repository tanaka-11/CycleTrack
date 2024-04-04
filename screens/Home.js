import { ScrollView, StyleSheet, Text, View } from "react-native";

export default function Home() {
  return (
    <ScrollView>
      <View style={styles.container}>
        {/* Progresso */}
        <View style={styles.progresso}>
          <Text style={styles.titulo}>Seu progresso semanal</Text>

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
        <View style={styles.atividadeRecente}>
          <Text style={styles.titulo}>Sua ultima atividade</Text>
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

  progresso: {
    backgroundColor: "#dbdbdb",
  },

  titulo: {
    fontSize: 16,
    fontWeight: "bold",
  },

  viewTitulo: {},

  textoDados: {},

  viewAtividade: {},

  viewTempo: {},

  viewDistancia: {},
});
