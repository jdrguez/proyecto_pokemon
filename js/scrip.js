// Selecciono el botón de del DOM
const button = document.querySelector("button");


function mostrarPokemon(){
    document.querySelector(".cargandoDatos").style.visibility = "visible";
};


button.addEventListener("click", () =>{
    document.querySelectorAll("#filtro").forEach( (e) => {
        e.style.visibility = "visible";
    });

    document.querySelectorAll("#btn_lista_deseo").forEach( (e) => {
        e.style.visibility = "visible";
    });

    let listaPokemon = document.querySelector(".listaPokemon");
        listaPokemon.style.visibility = "visible";
    mostrarPokemon();
});

