import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import React, { useState, useRef } from "react";
// Importação de Navegação
import { useRoute } from "@react-navigation/native";

// Importações Dependencias
import auth from "../firebase.config.js";
import ViewShot from "react-native-view-shot";
import * as Sharing from "expo-sharing";
import MapView, { Marker, Polyline } from "react-native-maps";
import { useSpeedContext } from "../components/SpeedContext";

export default function Detalhes() {
  // Recurso de navegação
  const route = useRoute();

  // Dados da atividade vindo da tela "Atividades"
  const { atividade } = route.params;

  // Referencia do Mapa
  const { mapViewRef } = useSpeedContext();

  // Variaveis para caso usuario não esteja logado
  let displayName = "Convidado";
  let photoURL = null;

  // Condicional caso usuario estiver logado
  if (auth.currentUser) {
    displayName = auth.currentUser.displayName;
    photoURL = auth.currentUser.photoURL;
  }

  // Referencia para a função handleShare (Compartilhar)
  const viewRef = useRef();

  // State para a função handleShare
  const [isSharing, setIsSharing] = useState(false);

  // Função para tirar print e compartilhar a imagem
  const handleShare = async () => {
    if (isSharing || !viewRef.current) {
      // Se já estiver compartilhando ou a referência da visualização não estiver disponível, simplesmente retorne
      return;
    }

    try {
      setIsSharing(true); // Inicia o compartilhamento
      const uri = await viewRef.current.capture();
      await Sharing.shareAsync(uri);
    } catch (error) {
      console.error("Erro ao capturar e compartilhar: ", error);
    } finally {
      setIsSharing(false); // Termina o compartilhamento
    }
  };

  return (
    <View style={styles.container}>
      {/* Area de Print  */}
      <ViewShot
        ref={viewRef}
        options={{ format: "jpg", quality: 0.9 }}
        style={styles.viewPrint}
      >
        <View style={styles.topo}>
          <View style={styles.dadosUsuario}>
            <Image
              source={{ uri: photoURL || "https://via.placeholder.com/150" }}
              style={[
                styles.image,
                { borderRadius: 85, backgroundColor: "#ad91cc" },
              ]}
            />
            <View style={styles.infos}>
              <Text style={styles.nomeUsuario}>{displayName} </Text>
              <Text style={styles.data}>
                {atividade.currentDate} às {atividade.currentTime}
              </Text>
            </View>
          </View>
        </View>

        <View>
          <View style={styles.viewMapa}>
            <MapView
              ref={mapViewRef}
              style={styles.mapa}
              scrollEnabled={false}
              zoomEnabled={false}
              rotateEnabled={false}
              pitchEnabled={false}
              initialRegion={{
                latitude: atividade.localizacao.latitude,
                longitude: atividade.localizacao.longitude,
                latitudeDelta: 0.005,
                longitudeDelta: 0.005,
              }}
            >
              <Marker
                coordinate={atividade.localizacao}
                pinColor="blue"
                title={`Local inicial da sua corrida`}
              />

              <Marker
                coordinate={atividade.localizacaoFinal}
                pinColor="red"
                title={`Local final da sua corrida`}
              />

              <Polyline
                coordinates={[
                  atividade.localizacao,
                  atividade.localizacaoFinal,
                ]}
                strokeWidth={5}
              />
            </MapView>
          </View>

          <View style={styles.viewDados}>
            <View style={styles.viewItem}>
              <Text style={styles.tituloTexto}>Distância</Text>
              <Text style={styles.corpoTexto}>
                {atividade.storedDistance.toFixed(2)} km
              </Text>
            </View>

            <View style={styles.viewItem}>
              <Text style={styles.tituloTexto}>Tempo</Text>
              <Text style={styles.corpoTexto}>
                {atividade.storedTime.hours} h : {atividade.storedTime.minutes}{" "}
                m : {atividade.storedTime.seconds} s
              </Text>
            </View>

            <View style={styles.viewItem}>
              <Text style={styles.tituloTexto}>Velocidade Média</Text>
              <Text style={styles.corpoTexto}>
                {atividade.averageSpeed.toFixed(2)} km/s
              </Text>
            </View>

            <View style={styles.viewItem}>
              <Text style={styles.tituloTexto}>Velocidade Máxima:</Text>
              <Text style={styles.corpoTexto}>
                {atividade.maxSpeed.toFixed(2)} km/s
              </Text>
            </View>
          </View>
        </View>

        {!isSharing && (
          <View style={styles.viewBotao}>
            <Pressable style={styles.botaoVazado} onPress={handleShare}>
              <Text style={styles.textoBotaoVazado}>Compartilhar</Text>
            </Pressable>
          </View>
        )}
      </ViewShot>
      {/* Fim area de print */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },

  viewPrint: {
    backgroundColor: "white",
    flex: 1,
  },

  //Perfil
  topo: {
    padding: 8,
    marginTop: 16,
  },

  dadosUsuario: {
    flexDirection: "row",
    gap: 20,
    marginVertical: 6,
    marginHorizontal: 6,
  },

  nomeUsuario: {
    fontSize: 20,
    fontWeight: "500",
    color: "#3A2293",
  },

  data: {
    fontSize: 16,
    fontWeight: "300",
  },

  image: {
    width: 64,
    height: 64,
    borderWidth: 1.5,
    borderColor: "#3D2498",
  },

  // Mapa
  mapa: {
    height: 350,
    width: 400,
  },

  viewMapa: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    marginTop: 8,
    borderColor: "#3A2293",
    borderWidth: 2.5,
  },

  // Dados Velocidade/Distancia
  viewDados: {
    flexDirection: "row",
    gap: 16,
    margin: 8,
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "center",
  },

  viewItem: {
    width: "40%",
  },

  tituloTexto: {
    color: "#3A2293",
    fontWeight: "500",
    fontSize: 16,
    textAlign: "center",
  },

  corpoTexto: {
    fontSize: 16,
    textAlign: "center",
  },

  // Pressable
  viewBotao: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },

  botaoVazado: {
    backgroundColor: "rgba(58,34,147,0.06)",
    borderColor: "#3A2293",
    borderWidth: 2,
    padding: 8,
    width: 200,
    borderRadius: 8,
  },

  textoBotaoVazado: {
    color: "#3A2293",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 16,
  },
});
