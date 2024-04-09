import React from "react";
import { StyleSheet, StatusBar } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import Home from "./screens/Home";
import Perfil from "./screens/Perfil";
import Atividades from "./screens/Atividades";
import Play from "./screens/Play";
import Configuracao from "./screens/Configuracao";

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <>
      <StatusBar barStyle="light-content" />
      <NavigationContainer>
        <Tab.Navigator 
          screenOptions={{ headerShown: false }}
          initialRouteName="Home"
        >
          <Tab.Screen name="Home" component={Home} />
          <Tab.Screen name="Atividades" component={Atividades} />
          <Tab.Screen name="Play" component={Play} />
          <Tab.Screen name="Perfil" component={Perfil} />
          <Tab.Screen name="Configuracao" component={Configuracao} />
        </Tab.Navigator>
      </NavigationContainer>
    </>
  );
}

const styles = StyleSheet.create({
  
});
