import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../../firebaseConfig";
import styles from "./style";

export function Login({navigation}: any){
    const [erro, setErro] = useState("");
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");

    const login = async() => {
        
        try{
            await signInWithEmailAndPassword(auth, email, senha);
        }
        catch(error){
            setErro("Erro ao entrar: " + error);
        }
    };

    const cadastrar = async () => {
       try{
           await createUserWithEmailAndPassword(auth, email, senha);
           navigation.navigate("Login");
       }
       catch(error){
            try{
                await signInWithEmailAndPassword(auth, email, senha);
            }
            catch(error){
                setErro("Erro ao entrar: " + error);
            }
       }
    };
    
    return(
        <View style={styles.container}>

            <Text style={styles.title}>Login/Cadastro</Text>
            
            <View style={styles.inputGroup}>
                <Text style={styles.label}>E-Mail:</Text>
                <TextInput 
                    style={styles.input}
                    placeholder="Digite seu email..." 
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                    placeholderTextColor="#999"
                />
            </View>
            <View style={styles.inputGroup}>
                <Text style={styles.label}>Senha:</Text>
                <TextInput 
                    style={styles.input}
                    placeholder="Digite sua senha..." 
                    value={senha}
                    onChangeText={setSenha}
                    autoCapitalize="none"
                    secureTextEntry={true}
                    placeholderTextColor="#999"
                />
            </View>

            {erro ? <Text style={styles.errorText}>{erro}</Text> : null}

            <TouchableOpacity style={styles.button} onPress={cadastrar}>
                <Text style={styles.buttonText}>Enviar</Text>
            </TouchableOpacity>

        </View>
    );
};
