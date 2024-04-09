import React from "react";
import { StyleSheet, StatusBar } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import Home from "./screens/Home";
import Perfil from "./screens/Perfil";
import Atividades from "./screens/Atividades";
import Play from "./screens/Play";
import Configuracao from "./screens/Configuracao";

// Icones
import { FontAwesome } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <>
      <StatusBar barStyle="light-content" />
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={{
            headerShown: false,
            tabBarLabelStyle: { fontSize: 16, padding: 5 },
            tabBarStyle: styles.tabBar,
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
            name="Histórico"
            component={Atividades}
            options={{
              tabBarIcon: () => {
                return <MaterialCommunityIcons name="clock-check" size={24} color="white" />
              }
            }} />

          <Tab.Screen
            name="Pedalar"
            component={Play}
            options={{
              tabBarIcon: () => {
                return <Ionicons name="bicycle-sharp" size={28} color="white" />
              }
            }} />

          <Tab.Screen
            name="Conta"
            component={Perfil}
            options={{
              tabBarIcon: () => {
                return <FontAwesome name="user" size={24} color="white" />
              }
            }} />

          <Tab.Screen
            name="Ajustes"
            component={Configuracao}
            options={{
              tabBarIcon: () => {
                return <Ionicons name="settings-sharp" size={24} color="white" />
              }
            }} />

        </Tab.Navigator>
      </NavigationContainer>
    </>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: "#3D2498",
    height: 80,
  }
});


