import { useState, useEffect } from "react";
import { StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
// Importação do bottom navigator
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";

// Telas
import Home from "./screens/Home";
import Perfil from "./screens/Perfil";
import Atividades from "./screens/Atividades";
import Play from "./screens/Play";
import Login from "./screens/Login";
import Cadastro from "./screens/Cadastro";
import RecuperarSenha from "./screens/RecuperarSenha";

// Acesso firebase auth
import { getAuth, onAuthStateChanged } from "firebase/auth";

// useContext
import { SpeedProvider } from "./components/SpeedContext";

// constante iniciando a criação do navigator
const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const AuthStack = () => (
  <Stack.Navigator
    initialRouteName="Login"
    screenOptions={{
      headerShown: false,
    }}
  >
    <Stack.Screen name="Login" component={Login} />
    <Stack.Screen name="Cadastro" component={Cadastro} />
    <Stack.Screen name="RecuperarSenha" component={RecuperarSenha} />
  </Stack.Navigator>
);

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
        {isUserLoggedIn === false && <AuthStack />}
        {isUserLoggedIn === true && (
          <Tab.Navigator
            screenOptions={{
              headerShown: false,
              tabBarLabelStyle: { fontSize: 16, padding: 5 },
              tabBarInactiveTintColor: "#ffffff",
              tabBarActiveTintColor: "#dddddd",
              tabBarActiveBackgroundColor: "#271177",
              tabBarStyle: styles.tabBar,
            }}
            initialRouteName="Home"
          >
            <Tab.Screen name="Home" component={Home} />
            <Tab.Screen name="Atividades" component={Atividades} />
            <Tab.Screen name="Play" component={Play} />
            <Tab.Screen name="Perfil" component={Perfil} />
          </Tab.Navigator>
        )}
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
