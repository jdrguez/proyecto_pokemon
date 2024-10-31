// script.js
import { PokemonController } from "./controllers/PokemonController.js";

document.addEventListener("DOMContentLoaded", () => {
  const controller = new PokemonController();


  document.querySelector("#button").addEventListener("click", () => {
        controller.init();
    });


});
