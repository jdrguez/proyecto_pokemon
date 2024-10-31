import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";


export class Login {
    constructor(){
        this.form = document.querySelector('.form-container')
    }

    manageacount(email, password){
        const auth = getAuth();
        signInWithEmailAndPassword(auth, email, password)
          .then((userCredential) => {
            // Signed in 
            const user = userCredential.user;
            console.log('se ha iniciado sesion')
            window.location.href = "../../pokedex.html";
            // ...
          })
          .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
          });

    }
    
}

