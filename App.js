import { StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
// Importação do bottom navigator
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useState, useEffect } from "react";

// Telas
import Home from "./screens/Home";
import Perfil from "./screens/Perfil";
import Atividades from "./screens/Atividades";
import Play from "./screens/Play";
import Configuracao from "./screens/Configuracao";
import Login from "./screens/Login";
import Cadastro from "./screens/Cadastro";
import RecuperarSenha from "./screens/RecuperarSenha";
// Acesso firebase auth
import { getAuth, onAuthStateChanged } from "firebase/auth";

// useContext
import { SpeedProvider } from "./components/SpeedContext";
import { StatusBar } from "expo-status-bar";

// constante iniciando a criação do navigator
const Tab = createBottomTabNavigator();

export default function App() {
  // Estado para rastrear o status de login do usuário
  const [isUserLoggedIn, setUserLoggedIn] = useState(false);

  // Efeito para verificar o status de login do usuário ao montar o componente
  useEffect(() => {
    const auth = getAuth(); // Obtém a instância de autenticação
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUserLoggedIn(!!user); // Define isUserLoggedIn com base no estado de autenticação do usuário
    });

    return unsubscribe; // Limpa a inscrição quando o componente for desmontado
  }, []);

  return (
    <SpeedProvider>
      <NavigationContainer>
        {/* <Tab.Navigator */}
        <Tab.Navigator
          screenOptions={{
            headerShown: false,
            tabBarLabelStyle: { fontSize: 16, padding: 5 },
            tabBarInactiveTintColor: "#ffffff",
            tabBarActiveTintColor: "#dddddd",
            tabBarActiveBackgroundColor: "#271177",
            tabBarStyle: styles.tabBar,
          }}
          initialRouteName={isUserLoggedIn ? "Home" : "Login"}
        >
          {isUserLoggedIn ? (
            <>
              <Tab.Screen name="Home" component={Home} />
              <Tab.Screen name="Atividades" component={Atividades} />
              <Tab.Screen name="Play" component={Play} />
              <Tab.Screen name="Perfil" component={Perfil} />
              <Tab.Screen name="Configuracao" component={Configuracao} />
            </>
          ) : (
            <>
              <Tab.Screen name="Login" component={Login} />
              <Tab.Screen name="Cadastro" component={Cadastro} />
              <Tab.Screen name="RecuperarSenha" component={RecuperarSenha} />
            </>
          )}
        </Tab.Navigator>
      </NavigationContainer>
    </SpeedProvider>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  tabBar: {
    backgroundColor: "#3D2498",
    height: 80,
  },
});
