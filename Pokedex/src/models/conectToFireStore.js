import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";
import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";

// Configuración de Firebase
const firebaseConfig = {

  apiKey: "AIzaSyD-K5LPKyqdwe2_dtzBGVcLY5TBK1ZMWP4",

  authDomain: "pokedex-ee001.firebaseapp.com",

  projectId: "pokedex-ee001",

  storageBucket: "pokedex-ee001.appspot.com",

  messagingSenderId: "153732063408",

  appId: "1:153732063408:web:9cede32834151901209b75"

};


// Inicializa Firebase
export const app = initializeApp(firebaseConfig);

// Inicializa Firestore
export const db = getFirestore(app);

class ConectToFirebase {
  constructor() {
    this.collectionRef = collection(db, "usuarios");
  }

  // Crear un nuevo documento
  async create(data) {
    try {
      const docRef = await addDoc(this.collectionRef, data);
      console.log("Documento escrito con ID: ", docRef.id);
      return docRef.id;
    } catch (e) {
      console.error("Error añadiendo documento: ", e);
    }
  }

  // Leer todos los documentos
  async readAll() {
    try {
      const querySnapshot = await getDocs(this.collectionRef);
      const dataList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      console.log("Documentos:", dataList);
      return dataList;
    } catch (e) {
      console.error("Error obteniendo documentos: ", e);
    }
  }

  // Actualizar un documento por ID
  async update(id, data) {
    try {
      const docRef = doc(this.collectionRef, id);
      await updateDoc(docRef, data);
      console.log("Documento actualizado con ID: ", id);
    } catch (e) {
      console.error("Error actualizando documento: ", e);
    }
  }

  // Eliminar un documento por ID
  async delete(id) {
    try {
      const docRef = doc(this.collectionRef, id);
      await deleteDoc(docRef);
      console.log("Documento eliminado con ID: ", id);
    } catch (e) {
      console.error("Error eliminando documento: ", e);
    }
  }
}

export default ConectToFirebase;
