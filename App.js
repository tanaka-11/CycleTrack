import { useState, useEffect } from "react";
import { StyleSheet } from "react-native";

// Navigation
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";

// Screens
import Home from "./screens/Home";
import Perfil from "./screens/Perfil";
import Atividades from "./screens/Atividades";
import Play from "./screens/Play";
import Login from "./screens/Login";
import Cadastro from "./screens/Cadastro";
import RecuperarSenha from "./screens/RecuperarSenha";
import Detalhes from "./screens/Detalhes";

// Firebase Auth
import { getAuth, onAuthStateChanged } from "firebase/auth";

// useContext
import { SpeedProvider } from "./components/SpeedContext";

// Bibliotecas de icones
import { AntDesign } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";

// Criação dos Navigator
const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Icones
const homeIcon = () => <Ionicons name="home-outline" size={24} color="white" />;
const atividadesIcon = () => (
  <MaterialCommunityIcons name="clock-check-outline" size={24} color="white" />
);
const playIcon = () => (
  <MaterialCommunityIcons name="bike" size={24} color="white" />
);
const perfilIcon = () => <AntDesign name="user" size={24} color="white" />;

// StackScreen para Login
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

// StackScreen para Atividades
const AtividadesStack = () => (
  <Stack.Navigator
    initialRouteName="Atividades"
    screenOptions={{
      headerShown: false,
    }}
  >
    <Stack.Screen name="AtividadesDetalhes" component={Atividades} />
    <Stack.Screen name="Detalhes" component={Detalhes} />
  </Stack.Navigator>
);

export default function App() {
  // State para rastrear o status de login do usuário
  const [isUserLoggedIn, setUserLoggedIn] = useState(false);

  // useEffect para verificar o status de login do usuário ao montar o componente
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
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
          }}
        >
          {isUserLoggedIn ? (
            <Stack.Screen name="MainApp">
              {() => (
                <Tab.Navigator
                  screenOptions={{
                    tabBarLabelStyle: { fontSize: 16, padding: 5 },
                    tabBarInactiveTintColor: "#ffffff",
                    tabBarActiveTintColor: "#dddddd",
                    tabBarActiveBackgroundColor: "#271177",
                    tabBarStyle: styles.tabBar,
                    headerShown: false,
                  }}
                  initialRouteName="Home"
                >
                  <Tab.Screen
                    name="Home"
                    component={Home}
                    options={{
                      tabBarIcon: homeIcon,
                    }}
                  />
                  <Tab.Screen
                    name="Atividades"
                    component={AtividadesStack}
                    options={{
                      tabBarIcon: atividadesIcon,
                    }}
                  />
                  <Tab.Screen
                    name="Pedalar"
                    component={Play}
                    options={{
                      tabBarIcon: playIcon,
                    }}
                  />
                  <Tab.Screen
                    name="Perfil"
                    component={Perfil}
                    options={{
                      tabBarIcon: perfilIcon,
                    }}
                  />
                </Tab.Navigator>
              )}
            </Stack.Screen>
          ) : (
            <Stack.Screen name="Auth" component={AuthStack} />
          )}
        </Stack.Navigator>
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
