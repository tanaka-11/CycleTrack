import {
  Alert,
  StyleSheet,
  TextInput,
  View,
  Pressable,
  Text,
  Image,
  StatusBar,
  ScrollView,
  ImageBackground,
  ActivityIndicator,
} from "react-native";
import { useState } from "react";

// Firebase
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import auth from "../firebase.config.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

// Dependencias
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import { MaterialIcons } from "@expo/vector-icons";
import Fundo from "../assets/fundo.jpg";

export default function Cadastro({ navigation }) {
  // Campos do Formulario
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [senhaVisivel, setSenhaVisivel] = useState(false);
  const [nome, setNome] = useState("");

  // Campo de imagem
  const [imagem, setImagem] = useState(null);
  const [downloadURL, setDownloadURL] = useState(null);
  const storage = getStorage();

  // State de Loading
  const [loadingImagem, setLoadingImagem] = useState(false);
  const [loadingStorage, setLoadingStorage] = useState(false);

  // Função para obter o blob da imagem
  const getImageBlob = async (imagem) => {
    const { uri } = await FileSystem.getInfoAsync(imagem);
    const response = await fetch(uri);

    if (!response.ok) {
      throw new Error("Não foi possível obter a imagem.");
    }

    return await response.blob();
  };

  // Função para fazer upload da imagem para o firebase storage
  const uploadImageToStorage = async (blob, imageName) => {
    const storageRef = ref(storage, imageName);
    await uploadBytes(storageRef, blob);

    return await getDownloadURL(storageRef);
  };

  // Função para carregarStorage
  const carregarStorage = async () => {
    setLoadingStorage(true); // Inicia o carregamento

    try {
      if (imagem) {
        const blob = await getImageBlob(imagem);
        const imageName = imagem.substring(imagem.lastIndexOf("/") + 1);
        const imagemURL = await uploadImageToStorage(blob, imageName);

        setDownloadURL(imagemURL);
      }

      cadastrar(); //Cadastro dos demais dados
    } catch (error) {
      console.error(error);
      Alert.alert("Falha ao fazer upload da imagem");
    } finally {
      setLoadingStorage(false); // Termina o carregamento
    }
  };

  // Função para criar um usuário
  const createUser = async (email, senha) => {
    const contaUsuario = await createUserWithEmailAndPassword(
      auth,
      email,
      senha
    );
    if (!contaUsuario.user) {
      throw new Error("Não foi possível criar o usuário.");
    }
    return contaUsuario.user;
  };

  // Função para atualizar o perfil do usuário
  const updateUserProfile = async (user, nome, downloadURL) => {
    await updateProfile(user, {
      displayName: nome,
      photoURL: downloadURL,
    });
    await user.reload();
  };

  // Função para lidar com erros
  const handleError = (error) => {
    let mensagem;
    switch (error.code) {
      case "auth/email-already-in-use":
        mensagem = "Este e-mail já está sendo usado por outra conta.";
        break;
      case "auth/weak-password":
        mensagem = "Por favor, escolha uma senha mais forte.";
        break;
      case "auth/invalid-email":
        mensagem = "Por favor, insira um endereço de e-mail válido.";
        break;
      default:
        mensagem =
          "Desculpe, algo deu errado. Por favor, tente novamente mais tarde.";
        break;
    }
    Alert.alert("Ops!", mensagem);
  };

  // Função para cadastrar
  const cadastrar = async () => {
    if (!email || !senha || !nome || !imagem) {
      Alert.alert("Atenção", "Preecha todos os campos");
      return;
    }

    try {
      const user = await createUser(email, senha);
      if (imagem) {
        const blob = await getImageBlob(imagem);
        const imageName = imagem.substring(imagem.lastIndexOf("/") + 1);
        const storageRef = ref(storage, imageName);
        await uploadBytes(storageRef, blob);
        const fotoURL = await getDownloadURL(storageRef);
        await updateProfile(user, { displayName: nome, photoURL: fotoURL });
      } else {
        await updateProfile(user, { displayName: nome });
      }
      navigation.navigate("Home", {
        displayName: user.displayName,
        photoURL: user.photoURL,
      });
      Alert.alert(
        "Cadastro",
        "Seu cadastro foi concluido com sucesso! Hora de começar pedalar!"
      );
    } catch (error) {
      handleError(error);
    }
  };

  // Função para escolher imagem de perfil
  const escolhaImagem = async () => {
    setLoadingImagem(true); // Inicia o carregamento
    // Resultado guardando a biblioteca de fotos
    const resultado = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [3, 4],
      quality: 0.9,
    });

    // Se o resultado não for cancelado
    if (!resultado.canceled) {
      setImagem(resultado.assets[0].uri);
    }
    setLoadingImagem(false); // Termina o carregamento
  };

  return (
    <ImageBackground source={Fundo} style={{ height: "100%" }}>
      <ScrollView>
        <View style={estilos.container}>
          <StatusBar barStyle="dark-content" />
          <View style={estilos.formulario}>
            <Text style={estilos.logo}>CycleTrack</Text>

            {imagem && (
              <Image
                source={{ uri: imagem }}
                style={{ width: 260, height: 260, borderRadius: 5 }}
              />
            )}

            <Pressable style={estilos.botaoFoto} onPress={escolhaImagem}>
              {loadingImagem ? (
                <ActivityIndicator animating={loadingImagem} color="#3D2498" />
              ) : (
                <Text style={estilos.textoBotaoFoto}>Escolher Foto</Text>
              )}
            </Pressable>

            <TextInput
              placeholder="Nome"
              style={estilos.input}
              keyboardType="default"
              onChangeText={(valor) => setNome(valor)}
            />

            <TextInput
              placeholder="E-mail"
              style={estilos.input}
              keyboardType="email-address"
              onChangeText={(valor) => setEmail(valor)}
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

            <Pressable style={estilos.botaoCadastro} onPress={carregarStorage}>
              {loadingStorage ? (
                <ActivityIndicator animating={loadingStorage} color="#fff" />
              ) : (
                <View
                  style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
                >
                  <Text style={estilos.textoBotaoCadastro}>Cadastrar</Text>
                  <MaterialIcons
                    name="directions-bike"
                    size={20}
                    color="white"
                  />
                </View>
              )}
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </ImageBackground>
  );
}

const estilos = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  logo: {
    marginBottom: 25,

    fontSize: 28,
    color: "#3D2498",
    fontWeight: "bold",

    shadowColor: "grey",
    shadowOffset: { width: 3, height: 5 }, // Sombra para baixo (y = 5)
    shadowOpacity: 0.2,
  },

  formulario: {
    marginBottom: 22,
    marginTop: 80,
    width: "85%",
    flex: 2,
    backgroundColor: "rgba(255, 255, 255, 0.96)",
    borderRadius: 20,
    padding: 22,
    alignItems: "center",
    justifyContent: "center",

    // sombra
    shadowColor: "black",
    shadowOffset: { width: 0, height: 4 }, // Sombra para baixo (y = 5)
    shadowOpacity: 0.2,
  },

  input: {
    backgroundColor: "#fff",
    borderColor: "#3D2498",
    borderWidth: 1.5,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 13,

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

  botaoCadastro: {
    backgroundColor: "#3D2498",
    paddingVertical: 12,
    paddingHorizontal: 50,
    borderRadius: 8,
    marginTop: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },

  textoBotaoCadastro: {
    color: "#E6E6FA",
    fontSize: 16,
    fontWeight: "bold",
  },

  textoBotaoFoto: {
    fontSize: 16,
    textAlign: "center",
    color: "#3631a4",
    fontWeight: "bold",
  },

  botaoFoto: {
    backgroundColor: "#E6E6FA",
    borderColor: "#4631B4",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 2,
    margin: 15,
    width: "100%",
  },
});
