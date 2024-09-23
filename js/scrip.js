// Selecciono el botón de del DOM
const button = document.querySelector("button");


function mostrarPokemon(){
    document.querySelector(".cargandoDatos").style.visibility = "visible";

    const request = new XMLHttpRequest();

    request.addEventListener("readystatechange", (e) => {
        if (e.target.readyState === 4){
            const datos = JSON.parse(e.target.responseText);
            console.log(datos)
        }
    })

    request.open("GET", "https://pokeapi.co/api/v2/pokemon/")
    request.send();

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

