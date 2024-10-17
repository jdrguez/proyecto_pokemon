import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore"; // Asegúrate de que esta línea esté presente


const firebaseConfig = {
    apiKey: "AIzaSyD-K5LPKyqdwe2_dtzBGVcLY5TBK1ZMWP4",
    authDomain: "pokedex-ee001.firebaseapp.com",
    projectId: "pokedex-ee001",
    storageBucket: "pokedex-ee001.appspot.com",
    messagingSenderId: "153732063408",
    appId: "1:153732063408:web:9cede32834151901209b75"
  };

  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const db = getFirestore(app);


export { auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, db};
