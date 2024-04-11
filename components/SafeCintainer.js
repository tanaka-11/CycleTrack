import { StyleSheet, Text, View, SafeAreaView } from 'react-native'
import * as SplashScreen from "expo-splash-screen";
import { useCallback } from "react";

SplashScreen.preventAutoHideAsync();

export default function SafeContainer({ children }) {
    /* const [fontsLoaded, fontError] = useFonts({
        Montserrat: require("../../assets/fonts/Montserrat-Regular.ttf"),
    }); 

    const aoAtualizarLayout = useCallback(async () => {
        if (fontsLoaded || fontError) {
            await SplashScreen.hideAsync();
        }
    }, [fontsLoaded, fontError]);

    if (!fontsLoaded && !fontError) {
        return null;
    } */

    return (
        <SafeAreaView style={estilos.container} /* onLayout={aoAtualizarLayout} */>
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