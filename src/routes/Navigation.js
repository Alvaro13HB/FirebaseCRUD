import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../firebaseConfig";
import { ScreenLogin, ScreenHome } from "../screens";

const Stack = createNativeStackNavigator();

export default function Navigator() {
    const [usuario, setUsuario] = useState(null);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUsuario(user);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    if (loading) return null;

    return (
        <NavigationContainer>
            <Stack.Navigator>
                {usuario ? (
                    <Stack.Screen name="Home">
                        {(props) => <ScreenHome {...props} usuario={usuario} />}
                    </Stack.Screen>
                ) : (
                    <>
                        <Stack.Screen name="Login" component={ScreenLogin} />
                    </>
                )}
            </Stack.Navigator>
        </NavigationContainer>
    );
}