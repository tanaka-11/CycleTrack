import { StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";

// Importação do bottom navigator
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

// Telas
import Home from "./screens/Home";
import Perfil from "./screens/Perfil";

// constante iniciando a criação do navigator
const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="Home" component={Home} />
        <Tab.Screen name="Perfil" component={Perfil} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
