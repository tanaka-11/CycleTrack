import { useState, useEffect } from "react";
import {
  Alert,
  Button,
  StyleSheet,
  TextInput,
  View,
  Pressable,
  Text,
  Image,
  StatusBar,
  ScrollView,
  ImageBackground,
} from "react-native";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../firebaseConfig";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { MaterialIcons } from "@expo/vector-icons";
import Fundo from "../assets/fundo.jpg";

export default function Cadastro({ navigation }) {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [nome, setNome] = useState("");

  const [imagem, setImagem] = useState(null);
  const [downloadURL, setDownloadURL] = useState(null);
  const storage = getStorage();

  const [status, requestPermission] = ImagePicker.useCameraPermissions();

  // useEffect(() => {
  //   async function verificaPermissoes() {
  // CameraStatus guardando a requisição da permissão de camera
  // const cameraStatus = await ImagePicker.requestCameraPermissionsAsync();

  // Requisição da permissão recebendo o cameraStatus com o parametro de ter permitido
  //     requestPermission(cameraStatus === "granted");
  //   }

  //   verificaPermissoes();
  // }, []);

  // Função para fazer upload da imagem para o Firebase Storage e depois enviar pela função Cadastrar
  const carregarStorage = async () => {
    try {
      if (imagem) {
        const { uri } = await FileSystem.getInfoAsync(imagem); // Obtém o URI da imagem
        const response = await fetch(uri); // Realiza uma requisição para obter a imagem

        const blob = await response.blob();
        const imageName = imagem.substring(imagem.lastIndexOf("/") + 1);

        if (!response.ok) {
          throw new Error("Falha ao obter a imagem");
        }

        const storageRef = ref(storage, imageName); // Cria uma referência para o local de armazenamento da imagem
        await uploadBytes(storageRef, blob);

        //downloadURL = recebe a url criada para imagem
        const imagemURL = await getDownloadURL(storageRef);
        setDownloadURL(imagemURL);
      }

      cadastrar(); //Cadastro dos demais dados
    } catch (error) {
      console.error(error);
      Alert.alert("Falha ao fazer upload da imagem", error.message);
    }
  };

  // Dados inseridos no input, carregados pelo state e enviados pela função cadastrar
  const cadastrar = async () => {
    if (!email || !senha || !nome || !imagem) {
      Alert.alert("Atenção", "Preecha todos os campos");
      return;
    }

    try {
      const contaUsuario = await createUserWithEmailAndPassword(
        auth,
        email,
        senha
      );

      // Foto e nome do current userr
      if (contaUsuario.user) {
        // Fazer upload no firestore
        // Atualize o perfil do usuário com o nome e a URL da imagem
        await updateProfile(auth.currentUser, {
          displayName: nome,
          photoURL: downloadURL,
        });
      }

      Alert.alert("Cadastro", " Seu cadastro foi concluido com sucesso!", [
        {
          style: "cancel",
          text: "Ficar aqui mesmo",
          onPress: () => {
            return;
          },
        },
        {
          style: "default",
          text: "Ir para a área logada ",
          onPress: () => navigation.navigate("Home"),
        },
      ]);
    } catch (error) {
      console.error(error.code);
      let mensagem;
      switch (error.code) {
        case "auth/email-already-in-use":
          mensagem = "Email já existente!";
          break;
        case "auth/weak-password":
          mensagem = "Senha fraca!";
          break;
        case "auth/invalid-email":
          mensagem = "Endereço de e-mail inválido!";
          break;
        default:
          mensagem = "Houve um erro, tente mais tarde!";
          break;
      }
      Alert.alert("Ops!", mensagem);
    }
  };

  const escolhaImagem = async () => {
    // Resultado guardando a biblioteca de fotos
    const resultado = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [3, 4],
      quality: 1,
    });

    // Se o resultado não for cancelado
    if (!resultado.canceled) {
      setImagem(resultado.assets[0].uri);
    }
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
              <Text style={estilos.textoBotaoFoto}>Escolher Foto</Text>
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
            <TextInput
              placeholder="Senha"
              style={estilos.input}
              secureTextEntry
              onChangeText={(valor) => setSenha(valor)}
            />

            <Pressable style={estilos.botaoCadastro} onPress={carregarStorage}>
              <Text style={estilos.textoBotaoCadastro}>Cadastrar</Text>

              <MaterialIcons name="directions-bike" size={20} color="white" />
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
