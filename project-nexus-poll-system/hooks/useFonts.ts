import * as Font from 'expo-font';
import { useEffect, useState } from 'react';

export default function useFonts() {
    const [fontsLoaded, setFontsLoaded] = useState(false);

    useEffect(() => {
        async function loadFonts() {
            await Font.loadAsync({
                Modak: require('../assets/fonts/Modak.ttf'),
                Mochiy: require('../assets/fonts/Mochiy.ttf'),
            });
            setFontsLoaded(true);
        }

        loadFonts();
    }, []);

    return fontsLoaded;
}