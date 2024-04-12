import { StyleSheet, Text, View, SafeAreaView } from 'react-native'
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from 'react';
  
SplashScreen.preventAutoHideAsync();

export default function SafeContainer({ children }) {
    
    return (
        <SafeAreaView style={estilos.container} >
            {children}
        </SafeAreaView>
    );
}

const estilos = StyleSheet.create({
    container: {
        paddingLeft: 0,
        paddingRight: 0,
        flex: 1,
    },
});