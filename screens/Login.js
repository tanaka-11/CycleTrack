import {
  Alert,
  Button,
  Pressable,
  StyleSheet,
  TextInput,
  View,
  Text,
  ActivityIndicator,
} from "react-native";
import { auth, provider } from "../../firebaseConfig";

import { signInWithEmailAndPassword } from "firebase/auth";
import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { AntDesign } from "@expo/vector-icons";

export default function Login({ navigation }) {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);

  const login = async () => {
    if (!email || !senha) {
      Alert.alert("Atenção", "Preecha email e senha");
      return;
    }
    try {
      setLoading(true);
      await signInWithEmailAndPassword(auth, email, senha);
      navigation.replace("AreaLogada");
    } catch (error) {
      console.error(error.code);
      let mensagem;
      switch (error.code) {
        case "auth/invalid-credential":
          mensagem = "Dados inválidos!";
          break;
        case "auth/invalid-email":
          mensagem = "Endereço de e-mail inválido!";
          break;
        default:
          mensagem = "Houve um erro, tente mais tarde!";
          break;
      }
      Alert.alert("Ops!", mensagem);
    } finally {
      setLoading(false); // Desativa o spinner
    }
  };

  return (
    <>
      <View style={estilos.container}>
        <View style={estilos.formulario}>
          <Text style={estilos.logo}>CycleTrack</Text>

          <ActivityIndicator animating={loading} size="large" color="#3D2498" />

          <TextInput
            keyboardType="email-address"
            onChangeText={(valor) => setEmail(valor)}
            placeholder="E-mail"
            style={estilos.input}
          />
          <TextInput
            onChangeText={(valor) => setSenha(valor)}
            placeholder="Senha"
            style={estilos.input}
            secureTextEntry
          />

          <Pressable onPress={login} style={estilos.botaoEntre}>
            <Text style={estilos.textoBotaoEntre}>Entrar</Text>
          </Pressable>

          <Pressable
            style={estilos.botaoEsqueciSenha}
            onPress={() => navigation.navigate("RecuperarSenha")}
          >
            <View style={estilos.esqueciSenha}>
              <Text>Esqueceu a senha?</Text>
              <Text style={estilos.textoBotaoEsqueciSenha}>
                Recuperar Senha
              </Text>
            </View>
          </Pressable>
        </View>
      </View>
    </>
  );
}

const estilos = StyleSheet.create({
  container: {
    flex: 1,

    alignItems: "center",
    justifyContent: "center",
  },
  formulario: {
    marginBottom: 22,
    marginTop: -10,
    width: "85%",
    height: "75%",

    backgroundColor: "rgba(255, 255, 255, 0.88)",
    borderRadius: 20,
    padding: 22,
    alignItems: "center",
    justifyContent: "center",
    // sombra
    shadowColor: "black",
    shadowOffset: { width: 2, height: 4 }, // Sombra para baixo (y = 5)
    shadowOpacity: 0.2,
  },
  logo: {
    marginBottom: 25,
    marginTop: -20,

    fontSize: 35,
    color: "#3D2498",
    fontWeight: "bold",

    shadowColor: "grey",
    shadowOffset: { width: 3, height: 5 }, // Sombra para baixo (y = 5)
    shadowOpacity: 0.2,
  },

  input: {
    borderColor: "#3D2498",
    borderWidth: 1.5,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    width: "100%",
    marginBottom: 16,
    color: "#333",
  },

  botaoEntre: {
    backgroundColor: "#3D2498",
    paddingVertical: 12,
    paddingHorizontal: 50,
    borderRadius: 8,
    marginHorizontal: 10,
  },
  textoBotaoEntre: {
    color: "#E6E6FA",
    fontSize: 16,
    fontWeight: "bold",
  },
  esqueciSenha: {
    marginVertical: 20,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  botaoEsqueciSenha: {
    backgroundColor: "transparent",
  },
  textoBotaoEsqueciSenha: {
    color: "#1D93E9",
    fontSize: 16,
  },
});
