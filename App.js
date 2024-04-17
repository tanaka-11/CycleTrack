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
                    name="Inicio"
                    component={Home}
                    options={{
                      tabBarIcon: () => {
                        return <Ionicons name="home" size={24} color="white" />
                      }
                    }} />


                  <Tab.Screen
                    name="Atividades"
                    component={Atividades}
                    options={{
                      tabBarIcon: () => {
                        return <MaterialCommunityIcons name="clock-check" size={24} color="white" />
                      }
                    }} />

                  <Tab.Screen
                    name="Play"
                    component={Play}
                    options={{
                      tabBarIcon: () => {
                        return <Ionicons name="bicycle-sharp" size={28} color="white" />
                      }
                    }} />

                  <Tab.Screen
                    name="Perfil"
                    component={Perfil}
                    options={{
                      tabBarIcon: () => {
                        return <FontAwesome name="user" size={24} color="white" />
                      }
                    }} />
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
