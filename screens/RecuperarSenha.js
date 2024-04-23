import React, { useState } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  Alert,
  Pressable,
  Text,
  ActivityIndicator,
} from "react-native";
import { sendPasswordResetEmail } from "firebase/auth";
import { getAuth } from "firebase/auth";

export default function RecuperarSenha() {
  const [email, setEmail] = useState("");
  const auth = getAuth();

  // State de Loading
  const [loadingRecuperar, setLoadingRecuperar] = useState(false);

  const recuperarSenha = async () => {
    setLoadingRecuperar(true);
    try {
      await sendPasswordResetEmail(auth, email);
      Alert.alert("Recuperar senha", "Verifique seu e-mail.");
      setEmail(null);
    } catch (error) {
      Alert.alert("Erro", "Ocorreu um erro ao recuperar a senha.");
    } finally {
      setLoadingRecuperar(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.textos}>
        <Text style={styles.titulo}>Informe seu e-mail</Text>
        <Text style={styles.info}>
          Informe o email corretamente e tentaremos enviar um link de
          redefinição
        </Text>
      </View>

      <TextInput
        keyboardType="email-address"
        onChangeText={(valor) => setEmail(valor)}
        placeholder="E-mail"
        style={styles.input}
      />

      <Pressable onPress={recuperarSenha} style={styles.botao}>
        {loadingRecuperar ? (
          <ActivityIndicator animating={loadingRecuperar} color="#fff" />
        ) : (
          <Text style={styles.textoBotao}>Recuperar Senha</Text>
        )}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#E9E4F8",
  },

  textos: {
    justifyContent: "flex-start",
    marginBottom: 30,
    width: "81%",
  },

  titulo: {
    fontSize: 24,
    color: "#3D2498",
    fontWeight: "bold",
  },

  info: {
    color: "#3D2498",
  },

  input: {
    borderColor: "#3D2498",
    borderWidth: 1.5,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 15,
    width: "80%",
    marginBottom: 16,
    fontSize: 16,
    color: "#333",
  },

  botao: {
    backgroundColor: "#3D2498",
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 8,
    marginHorizontal: 10,
  },

  textoBotao: {
    color: "#E6E6FA",
    fontSize: 16,
    fontWeight: "bold",
  },
});
