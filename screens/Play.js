import { StyleSheet, View, ScrollView } from "react-native";

// Componentes
import Stopwatch from "../components/Stopwatch";

export default function Play() {
  return (
    <ScrollView>
      <View style={styles.container}>
        <Stopwatch />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
