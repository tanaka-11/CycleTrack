import {
  View,
  Text,
  TextInput,
  Alert,
  StyleSheet,
  Pressable,
  Image,
  Vibration,
} from "react-native";
import { useState, useEffect } from "react";
import { ActivityIndicator, ScrollView } from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";

// Imports Firebase
import { auth } from "../firebaseConfig";
import { signOut } from "firebase/auth";
import { updateEmail, updateProfile } from "firebase/auth";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

export default function Perfil({ navigation }) {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [fotoPerfil, setfotoPerfil] = useState("");
  const storage = getStorage();
  const [carregandoImagem, setCarregandoImagem] = useState(false);
  const [atualizarFoto, setAtualizarFoto] = useState(false);

  // UseEffect para mostrar os dados do usuario ou vazio
  useEffect(() => {
    const carregarUsuarioAtual = async () => {
      const usuarioAtual = auth.currentUser;
      if (usuarioAtual) {
        setNome(usuarioAtual.displayName || "");
        setEmail(usuarioAtual.email || "");
        setfotoPerfil(usuarioAtual.photoURL || "");
      }
    };

    carregarUsuarioAtual();
  }, []);

  // Função salvar perfil
  const salvarPerfil = async () => {
    try {
      const usuarioAtual = auth.currentUser;
      const uid = auth.currentUser.uid;

      if (!usuarioAtual) {
        throw new Error("Usuário não autenticado.");
      }

      // Chamando a função para tualizar a foto de perfil
      if (atualizarFoto) {
        await atualizarFotoPerfil(uid, fotoPerfil);
      }

      // Atualizar o email do usuário
      await updateEmail(usuarioAtual, email);

      //  Chamando a função para Atualizar o nome do usuário
      await atualizarNome(nome);
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error);
      Alert.alert(
        "Erro ao atualizar perfil. Por favor, tente novamente mais tarde."
      );
    }
  };

  // Função Atualizar Nome
  const atualizarNome = async (novoNome) => {
    const usuarioAtual = auth.currentUser;
    if (!usuarioAtual) {
      throw new Error("Usuário não autenticado.");
    }
    await updateProfile(usuarioAtual, { displayName: novoNome });
  };

  // Função escolha imagem
  const escolhaImagem = async () => {
    try {
      setCarregandoImagem(true); // Define o estado de carregamento como true
      //acesso a galeria para escolher e definir a foto
      const resultado = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [3, 4],
        quality: 1,
      });

      if (!resultado.canceled) {
        setfotoPerfil(resultado.assets[0].uri);
        setAtualizarFoto(true); // verifica se o usuario vai alterar a foto
      }
    } catch (error) {
      console.error("Erro ao escolher uma imagem:", error);
    } finally {
      setCarregandoImagem(false); // Define o estado de carregamento como false ao finalizar
    }
  };

  // Função atualizar foto perfil
  const atualizarFotoPerfil = async (uid, fotoPerfil) => {
    try {
      const { uri } = await FileSystem.getInfoAsync(fotoPerfil); // Obtém o URI da imagem

      // Esta linha faz uma requisição para o URI da imagem utilizando a função fetch, obtém os dados da imagem.
      const response = await fetch(uri); // Realiza uma requisição para obter a imagem

      const blob = await response.blob();
      const imageName = fotoPerfil.substring(fotoPerfil.lastIndexOf("/") + 1);

      const storageRef = ref(storage, imageName); //CRIA uma referência no Firebase usando o nome do arquivo como o caminho para a referência.

      await uploadBytes(storageRef, blob); // a imagem é carregada para o Firebase Storage, faz o upload dos bytes do objeto Blob usando a referência storageRef.

      // Pegando url de nova foto selecionada
      const fotoURL = await getDownloadURL(storageRef);

      // Atualizar o nome do usuário com parametro que será state fotoUrl
      await updateProfile(auth.currentUser, { photoURL: fotoURL });
    } catch (error) {
      console.error("Erro ao atualizar foto de perfil:", error);
      throw error;
    }
  };

  // Logout
  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error(error.code);
    }
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <View style={styles.containerFoto}>
          <Image
            source={{ uri: fotoPerfil || "https://via.placeholder.com/300" }}
            style={[
              styles.image,
              { borderRadius: 85, backgroundColor: "gray" },
            ]}
          />

          <Pressable onPress={escolhaImagem} style={styles.botao}>
            {carregandoImagem ? (
              <ActivityIndicator
                // size="large"
                color="#3D2498"
                style={styles.loadingIndicator}
              />
            ) : (
              <Text style={styles.botaoText}>Selecionar foto de perfil</Text>
            )}
          </Pressable>
        </View>

        <View style={styles.containerInput}>
          <TextInput
            style={styles.input}
            value={nome}
            onChangeText={setNome}
            placeholder="Nome"
          />

          <TextInput
            style={[
              styles.input,
              { backgroundColor: "lightgray", borderColor: "#5F5E65" },
            ]}
            value={email}
            placeholder="E-mail"
            editable={false}
          />
        </View>

        <Pressable
          style={styles.botao}
          onPress={() => {
            salvarPerfil();
            Alert.alert("Perfil atualizado com sucesso!");
            Vibration.vibrate();
          }}
        >
          <Text style={styles.botaoText}>Salvar Alterações</Text>
        </Pressable>

        <Pressable
          onPress={() => {
            logout();
            Vibration.vibrate(200);
          }}
          style={styles.botaoLogout}
        >
          <Text style={styles.botaoTextLogout}>Logout</Text>
        </Pressable>
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

  containerInput: {
    marginTop: 60,
  },

  containerFoto: {
    alignItems: "center",
  },

  input: {
    backgroundColor: "#fff",
    borderColor: "#8279BD",
    borderWidth: 1.5,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 14,
    width: 310,
    marginBottom: 16,
    color: "#333",
  },

  botao: {
    borderRadius: 4,
    marginVertical: 12,
    borderColor: "#4631B4",
    borderWidth: 2,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },

  botaoLogout: {
    borderRadius: 4,
    marginVertical: 12,
    borderColor: "#be2414",
    borderWidth: 2,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },

  botaoTextLogout: {
    fontWeight: "bold",
    color: "#be2414",
  },

  botaoText: {
    fontWeight: "bold",
    color: "#4631B4",
  },

  image: {
    width: 170,
    height: 170,
    borderRadius: 50,
    marginTop: 20,
    alignSelf: "center",

    borderWidth: 4,
    borderRadius: 50,
    borderColor: "#EBE6F6",

    shadowColor: "black",
    shadowOffset: { width: 0, height: 4 }, // Sombra para baixo (y = 5)
    shadowOpacity: 0.2,
  },
});
