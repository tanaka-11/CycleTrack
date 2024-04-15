import { Button, StyleSheet, Text, View } from "react-native";
import { auth } from "../firebaseConfig";
import { signOut } from "firebase/auth";
export default function Configuracao() {
  const logout = async () => {
    try {
      await signOut(auth);
      navigation.replace("Login");
    } catch (error) {
      console.error(error.code);
    }
  };

  return (
    <View>
      <Text>Configuracao</Text>
      <Button onPress={logout} title="Logout" color="#D35400" />
    </View>
  );
}

const estilos = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
});
