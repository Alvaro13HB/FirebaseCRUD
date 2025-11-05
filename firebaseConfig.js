import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyATwqGiJvLM03Ine9vSvMLog1kJqRtfhLs",
  authDomain: "crudlivros-287f3.firebaseapp.com",
  projectId: "crudlivros-287f3",
  storageBucket: "crudlivros-287f3.appspot.com",
  messagingSenderId: "185933087501",
  appId: "1:185933087501:web:9e97ee059cc035bf646644",
  measurementId: "G-XL65P1RH6F"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);