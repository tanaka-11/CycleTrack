import { StyleSheet, Text, View } from "react-native";
import { useSpeedContext } from "../components/SpeedContext";

export default function Atividades() {
  const { storedSpeed, storedDistance } = useSpeedContext();
  return (
    <View style={styles.container}>
      <Text>Distancia: {storedDistance}</Text>
      <Text>Velocidade: {storedSpeed}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
