import { auth, createUserWithEmailAndPassword, db } from './firebase.js';

// Función para registrar un nuevo usuario
async function registerUser(nickname, name, surname, email, age, city, password) {
    try {
        // Crear usuario en Firebase Auth
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Guardar los datos del usuario en Firestore
        await setDoc(doc(db, 'usuarios', user.uid), {
            nickname: nickname,
            name: name,
            surname: surname,
            email: email,
            age: parseInt(age), // Convertir a número
            city: city,
            password: password // Esto es inseguro, considera eliminarlo
        });

        console.log('Usuario registrado con éxito:', user.uid);
        alert('Usuario registrado con éxito');
    } catch (error) {
        console.error('Error al registrar el usuario:', error);
        alert('Error al registrar el usuario: ' + error.message);
    }
}

// Manejar el envío del formulario de registro
document.getElementById('registerForm').addEventListener('submit', function (event) {
    event.preventDefault(); // Evitar el envío del formulario
    const nickname = document.getElementById('registerUsername').value;
    const name = document.getElementById('name').value;
    const surname = document.getElementById('fullName').value;
    const email = document.getElementById('email').value;
    const age = document.getElementById('age').value;
    const city = document.getElementById('city').value;
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (password !== confirmPassword) {
        alert('Las contraseñas no coinciden');
        return;
    }

    // Llama a la función de registro
    registerUser(nickname, name, surname, email, age, city, password);
});
