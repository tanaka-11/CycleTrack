import { SafeAreaView, StatusBar } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from '@react-navigation/stack';

// Telas
import Home from "./screens/Home";
import Perfil from "./screens/Perfil";
import Atividades from "./screens/Atividades";
import Play from "./screens/Play";
import Configuracao from "./screens/Configuracao";
import Login from "./screens/Login";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Icones
import { FontAwesome } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';

function StackNavigator() {
  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen
        name="ScreenHome"
        component={TabNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ScreenAtividades"
        component={TabNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ScreenPlay"
        component={TabNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ScreenLogin"
        component={TabNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ScreenPerfil"
        component={TabNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ScreenConfiguracao"
        component={TabNavigator}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  )
}

function TabNavigator() {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          headerShown: false, tabBarIcon: () => {
            return <Ionicons name="home" size={24} color="white" />
          }
        }}
      />

      <Tab.Screen
        name="Atividades"
        component={Atividades}
        options={{
          headerShown: false, tabBarIcon: () => {
            return <MaterialCommunityIcons name="clock-check" size={24} color="white" />
          }
        }}
      />

      <Tab.Screen
        name="Play"
        component={Play}
        options={{
          headerShown: false, tabBarIcon: () => {
            return <Ionicons name="bicycle-sharp" size={28} color="white" />
          }
        }}
      />

      <Tab.Screen
        name="Perfil"
        component={Perfil}
        options={{
          headerShown: false, tabBarIcon: () => {
            return <FontAwesome name="user" size={24} color="white" />
          }
        }}
      />

      <Tab.Screen
        name="Configuracao"
        component={Configuracao}
        options={{
          headerShown: false, tabBarIcon: () => {
            return <Ionicons name="settings-sharp" size={24} color="white" />
          }
        }} />
    </Tab.Navigator>
  )
}

export default function App() {
  return (
    <>
      <StatusBar barStyle="light-content" />
      <NavigationContainer>
        <TabNavigator />
      </NavigationContainer>
    </>
  );
}
