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

// Inicializa Firebase y Firestore
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

class ConectToFirebase {
  constructor(collectionName = "usuarios") {
    this.collectionRef = collection(db, collectionName);
  }

  // Crear un nuevo documento en Firebase
  async create(data) {
    try {
      const docRef = await addDoc(this.collectionRef, data);
      console.log("Documento creado con ID:", docRef.id);
      return docRef.id;
    } catch (error) {
      console.error("Error al añadir documento:", error);
      throw error;
    }
  }

  // Leer todos los documentos en la colección
  async readAll() {
    try {
      const querySnapshot = await getDocs(this.collectionRef);
      const dataList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      console.log("Documentos obtenidos:", dataList);
      return dataList;
    } catch (error) {
      console.error("Error al obtener documentos:", error);
      throw error;
    }
  }

  // Actualizar un documento en Firebase por su ID
  async update(id, data) {
    try {
      const docRef = doc(db, this.collectionRef.path, id);
      await updateDoc(docRef, data);
      console.log("Documento actualizado con ID:", id);
      return true;
    } catch (error) {
      console.error("Error al actualizar documento:", error);
      throw error;
    }
  }

  // Eliminar un documento en Firebase por su ID
  async delete(id) {
    try {
      const docRef = doc(db, this.collectionRef.path, id);
      await deleteDoc(docRef);
      console.log("Documento eliminado con ID:", id);
      return true;
    } catch (error) {
      console.error("Error al eliminar documento:", error);
      throw error;
    }
  }
}

export default ConectToFirebase;
