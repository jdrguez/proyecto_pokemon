<script type="module" src="signup.js"></script>

import { ManageAccount } from './firebaseconect.js';

document.getElementById("registerForm").addEventListener("submit", (event) => {
  event.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("registerPassword").value;

  const account = new ManageAccount();
  account.register(email, password);

});

console.log('Formulario de Registro');