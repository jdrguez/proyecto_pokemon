import {db} from '../models/conectToFireStore.js'
import {getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";
import {doc, setDoc} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";

export class Signup{
    constructor(){
        this.form = document.querySelector('.form-container');
    
    // Función para registrar un nuevo usuario
    // Función para registrar un nuevo usuario
}
    registerUser(nickname, name, surname, email, age, city, password) {
    try {
        const auth = getAuth();
        const userCredential = createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        
        setDoc(doc(db, 'usuarios', user.uid), {
            nickname: nickname,
            name: name,
            surname: surname,
            email: email,
            city: city,
            age: parseInt(age), 
            password: password 
        });

        console.log('Usuario registrado con éxito:', user.uid);
        alert('Usuario registrado con éxito');
    } catch (error) {
        console.error('Error al registrar el usuario:', error);
        alert('Error al registrar el usuario: ' + error.message);
    }
}


};

