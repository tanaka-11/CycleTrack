import { StyleSheet, Text, View } from "react-native";
import { useEffect } from "react";

// Dependecias
import MapView from "react-native-maps";

// useContext
import { useSpeedContext } from "./SpeedContext";

export default function Mapa() {
  const {
    // States
    myLocation,
    mapViewRef,
    speed,
    distance,

    // Funções
    permissionLocationAndAnimated,
  } = useSpeedContext();

  // useEffect do getLocation
  useEffect(() => {
    permissionLocationAndAnimated();
  }, []);

  return (
    <>
      <View style={styles.viewDados}>
        <Text style={styles.botaoPreenchido}>
          <Text style={styles.tituloBotao}>Velocidade:</Text> {speed.toFixed(2)}
        </Text>

        <Text style={styles.botaoPreenchido}>
          <Text style={styles.tituloBotao}>Distância:</Text>{" "}
          {distance.toFixed(2)} km
        </Text>
      </View>

      <View style={styles.viewMapa}>
        <MapView
          style={styles.mapa}
          mapType="standard"
          ref={mapViewRef}
          region={myLocation}
          followsUserLocation={true}
          showsUserLocation={true}
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  // Mapa
  mapa: {
    width: 400,
    height: 280,
  },

  viewMapa: {
    borderColor: "#3A2293",
    borderWidth: 2,
    borderRadius: 3,
  },

  // Dados
  viewDados: {
    flexDirection: "row",
    gap: 30,
    marginVertical: 30,
  },

  distanceText: {
    fontSize: 18,
    marginTop: 10,
    borderColor: "#3A2293",
    borderWidth: 2,
    padding: 8,
    borderRadius: 8,
  },

  botaoVazado: {
    borderColor: "#3A2293",
    color: "#3A2293",
    borderWidth: 2,
    padding: 8,
    fontWeight: "600",
    width: 100,
    borderRadius: 8,
    textAlign: "center",
  },

  textoBotaoVazado: {
    color: "#3A2293",
    textAlign: "center",
  },

  botaoPreenchido: {
    borderColor: "#3A2293",
    borderWidth: 2,
    padding: 10,
    width: 100,
    borderRadius: 8,
    textAlign: "center",
    backgroundColor: "rgba(65, 44, 171, 0.12)",
  },

  textoBotaoPreenchido: {
    color: "#ffffff",
    textAlign: "center",
  },

  botaoVazadoPreto: {
    borderColor: "rgba(13, 30, 82, 0.5)",
    borderWidth: 2,
    padding: 8,
    width: 100,
    borderRadius: 8,
  },

  textoBotaoVazadoP: {
    color: "#0A045A",
    textAlign: "center",
  },

  botaoPadrao: {
    backgroundColor: "#5442D2",
    padding: 8,
    borderRadius: 8,
    width: 120,
    height: 45,
  },

  textoBotaoPadrao: {
    color: "#fff",
    textAlign: "center",
    alignItems: "center",
    fontSize: 22,
  },

  sessaoBotoes: {
    flexDirection: "row",
    gap: 20,
    marginVertical: 35,
    marginHorizontal: 20,
  },

  tituloBotao: {
    color: "#3A2293",
    fontWeight: "bold",
  },
});
