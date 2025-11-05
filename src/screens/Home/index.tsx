import { addDoc, collection, deleteDoc, doc, onSnapshot, updateDoc, query, where } from 'firebase/firestore';
import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, FlatList, Modal, KeyboardAvoidingView, Platform } from "react-native";
import { db, auth } from "../../../firebaseConfig";
import { Ionicons } from '@react-native-vector-icons/ionicons';
import styles from './styles';
import { signOut } from 'firebase/auth';

export function Home({navigation, usuario}: any) {
    const [modalAddVisible, setModalAddVisible] = useState(false);
    const [modalEditVisible, setModalEditVisible] = useState(false);

    type Livro = {
        id: number,
        titulo: string;
        autor: string;
    }

    const [ID, setID] = useState("");
    const [titulo, setTitulo] = useState("");
    const [autor, setAutor] = useState("");

    const [livros, setLivros] = useState<Livro[]>([]);

    useEffect(() => {
        const user = auth.currentUser;
        if (!user){
           return;
        }       
        const q = query(
           collection(db, "livros"),
           where("uid", "==", user.uid)
        );
        const consulta = onSnapshot(q, (snapshot) => {
            const lista: any[] = [];
            snapshot.forEach((doc) => {
                lista.push({ id: doc.id, ...doc.data() })
            });
            setLivros(lista);
        });
        return () => consulta();
    }, []);

    const adicionarLivro = async () => {
        if (titulo.trim() === "") {
            return;
        }
        console.log("Teste")
        await addDoc(collection(db, "livros"), {
            titulo: titulo,
            autor: autor,
            uid: usuario.uid,
        });
        console.log(titulo)
        setTitulo("");
        setAutor("");
    }

    const atualizarLivro = async (id: string) => {
        const docReferencia = doc(db, "livros", id);
        await updateDoc(docReferencia, {
            titulo: titulo,
            autor: autor,
        });
        setTitulo("");
        setAutor("");
    }

    const deletarLivro = async (id: string) => {
        const docReferencia = doc(db, "livros", id);
        await deleteDoc(docReferencia);
    }

    const renderItem = ({ item }: any) => (
        <View style={styles.contactItem}>

            <View style={styles.contactInfo}>
                <Text style={styles.contactName}>{item.titulo}</Text>
                <Text style={styles.contactDetail}>{item.autor}</Text>
            </View>

            <View style={styles.actionIcons}>
                <TouchableOpacity onPress={() => deletarLivro(item.id)} style={styles.iconButton}>
                    <Ionicons name="trash-outline" size={24} color="#ff3b30" />
                </TouchableOpacity>
            </View>

            <View style={styles.actionIcons}>
                <TouchableOpacity onPress={() => { setModalEditVisible(true), setID(item.id), setTitulo(item.titulo), setAutor(item.autor) }} style={styles.iconButton}>
                    <Ionicons name="pencil-outline" size={24} color="#007aff" />
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Agenda de Livros</Text>

            <FlatList
                data={livros}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderItem}
                ItemSeparatorComponent={() => <View style={styles.separator} />}
            />

            <TouchableOpacity style={styles.exitContainer} onPress={() => signOut(auth)}>
                <Ionicons name="exit" size={24} color="#fff" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.floatingButton} onPress={() => { setModalAddVisible(true), setTitulo(""), setAutor("") }}>
                <Ionicons name="add" color="#fff" size={32} />
            </TouchableOpacity>

            {/* MODAL ADICIONAR */}

            <Modal
                animationType="fade"
                transparent={true}
                visible={modalAddVisible}
                onRequestClose={() => {
                    setModalAddVisible(!modalAddVisible);
                }}
            >
                <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    style={styles.modalOverlay}
                >
                    <View style={styles.modalView}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Adicionar livro</Text>
                            <TouchableOpacity onPress={() => { setModalAddVisible(false) }}>
                                <Ionicons name="close" color="#000" size={20} />
                            </TouchableOpacity>
                        </View>

                        <TextInput
                            placeholder="Titulo"
                            placeholderTextColor="#888"
                            style={styles.input}
                            value={titulo}
                            onChangeText={setTitulo}
                        />
                        <TextInput
                            placeholder="Autor"
                            placeholderTextColor="#888"
                            style={styles.input}
                            value={autor}
                            onChangeText={setAutor}
                        />

                        <TouchableOpacity style={styles.saveButton} onPress={() => {
                            adicionarLivro();
                            setModalAddVisible(false);
                        }}>
                            <Text style={styles.saveButtonText}>Salvar</Text>
                        </TouchableOpacity>

                    </View>
                </KeyboardAvoidingView>
            </Modal>

            {/* MODAL ADICIONAR */}

            {/* MODAL EDITAR */}

            <Modal
                animationType="fade"
                transparent={true}
                visible={modalEditVisible}
                onRequestClose={() => {
                    setModalEditVisible(!modalEditVisible);
                }}
            >
                <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    style={styles.modalOverlay}
                >
                    <View style={styles.modalView}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Editar livro</Text>
                            <TouchableOpacity onPress={() => { setModalEditVisible(false) }}>
                                <Ionicons name="close" color="#000" size={20} />
                            </TouchableOpacity>
                        </View>

                        <TextInput
                            placeholder="Titulo"
                            placeholderTextColor="#888"
                            style={styles.input}
                            value={titulo}
                            onChangeText={setTitulo}
                        />
                        <TextInput
                            placeholder="Autor"
                            placeholderTextColor="#888"
                            style={styles.input}
                            value={autor}
                            onChangeText={setAutor}
                        />

                        <TouchableOpacity style={styles.saveButton} onPress={() => {
                            atualizarLivro(ID);
                            setModalEditVisible(false);
                        }}>
                            <Text style={styles.saveButtonText}>Atualizar</Text>
                        </TouchableOpacity>

                    </View>
                </KeyboardAvoidingView>
            </Modal>

            {/* MODAL EDITAR */}

        </View>
    );
};

