import { initializeApp } from "firebase/app";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-analytics.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js";

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth();



const firebaseConfig = {

  apiKey: "AIzaSyD-K5LPKyqdwe2_dtzBGVcLY5TBK1ZMWP4",

  authDomain: "pokedex-ee001.firebaseapp.com",

  projectId: "pokedex-ee001",

  storageBucket: "pokedex-ee001.appspot.com",

  messagingSenderId: "153732063408",

  appId: "1:153732063408:web:9cede32834151901209b75"

};

export class ManageAccount {
    register(email, password) {
      createUserWithEmailAndPassword(auth, email, password)
        .then((_) => {
          window.location.href = "index.html";
          alert("Registro exitoso. Serás redirigido a la página de inicio de sesión.");
        })
        .catch((error) => {
          console.error(error.message);
              alert("Error al registrar: " + error.message);
        });
    }
  
    authenticate(email, password) {
      signInWithEmailAndPassword(auth, email, password)
        .then((_) => {
          window.location.href = "index.html";
          alert("Has iniciado sesión correctamente. Serás redirigido a la página principal.");
        })
        .catch((error) => {
          console.error(error.message);
                  alert("Error al iniciar sesión: " + error.message);
        });
    }
  
    signOut() {
      signOut(auth)
        .then((_) => {
          window.location.href = "index.html";
        })
        .catch((error) => {
          console.error(error.message);
        });
    }
  }