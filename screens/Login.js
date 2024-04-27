import {
  Alert,
  Pressable,
  StyleSheet,
  TextInput,
  View,
  Text,
  ActivityIndicator,
  ScrollView,
  ImageBackground,
} from "react-native";
import { useState } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import Fundo from "../assets/fundo.jpg";

// Importações de Autenticação
import auth from "../firebase.config.js";
import { signInWithEmailAndPassword } from "firebase/auth";

export default function Login({ navigation }) {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [senhaVisivel, setSenhaVisivel] = useState(false);
  const [loading, setLoading] = useState(false);

  // Função para validar o email e a senha
  const validateInput = (email, senha) => {
    if (!email || !senha) {
      Alert.alert("Atenção", "Preecha email e senha");
      return false;
    }
    return true;
  };

  // Função para lidar com erros
  const handleError = (error) => {
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
  };

  // Função para login
  const login = async () => {
    if (!validateInput(email, senha)) {
      return;
    }

    try {
      setLoading(true);
      await signInWithEmailAndPassword(auth, email, senha);
      navigation.navigate("Home");
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false); // Desativa o spinner
    }
  };

  return (
    <>
      <ImageBackground source={Fundo} style={{ height: "100%" }}>
        <ScrollView>
          <View style={estilos.container}>
            <View style={estilos.formulario}>
              <Text style={estilos.logo}>CycleTrack</Text>
              <TextInput
                keyboardType="email-address"
                onChangeText={(valor) => setEmail(valor)}
                placeholder="E-mail"
                style={estilos.input}
              />

              <View style={estilos.viewSenha}>
                <TextInput
                  onChangeText={(valor) => setSenha(valor)}
                  placeholder="Senha"
                  style={estilos.input}
                  secureTextEntry={!senhaVisivel}
                />
                <MaterialIcons
                  name={senhaVisivel ? "visibility-off" : "visibility"}
                  size={20}
                  color={"#3D2498"}
                  onPress={() => setSenhaVisivel(!senhaVisivel)}
                  style={estilos.icon}
                />
              </View>

              <Pressable onPress={login} style={estilos.botaoEntre}>
                {loading ? (
                  <ActivityIndicator animating={loading} color="#fff" />
                ) : (
                  <Text style={estilos.textoBotaoEntre}>Entrar</Text>
                )}
              </Pressable>

              <View style={estilos.esqueciSenha}>
                <Pressable
                  style={estilos.botaoCriarConta}
                  onPress={() => navigation.navigate("Cadastro")}
                >
                  <Text style={estilos.textoCriarConta}>Criar Conta</Text>
                </Pressable>

                <Pressable
                  style={estilos.botaoEsqueciSenha}
                  onPress={() => navigation.navigate("RecuperarSenha")}
                >
                  <Text style={estilos.textoBotaoEsqueciSenha}>
                    Recuperar Senha
                  </Text>
                </Pressable>
              </View>
            </View>
          </View>
        </ScrollView>
      </ImageBackground>
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
    marginTop: 80,
    width: "85%",
    height: 450,
    backgroundColor: "rgba(255, 255, 255, 0.96)",
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

  viewSenha: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
  },

  icon: {
    position: "absolute",
    right: 16,
    top: 20,
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
    gap: 12,
  },

  botaoEsqueciSenha: {
    backgroundColor: "transparent",
  },

  textoBotaoEsqueciSenha: {
    color: "#8b0000",
    fontSize: 16,
  },

  botaoCriarConta: {
    backgroundColor: "transparent",
  },

  textoCriarConta: {
    color: "#3D2498",
    fontSize: 16,
  },
});
