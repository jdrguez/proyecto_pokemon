import { PokemonModel } from './models/PokemonModel.js';

class PurchaseView {
    constructor() {
        this.container = document.getElementById('purchase-container');
        this.model = new PokemonModel();
    }

    async init() {
        await this.model.loadPokemons();
        this.renderPurchase();
        document.getElementById('backToPokedex').addEventListener('click', () => {
            window.location.href = 'pokedex.html';
        });
    }

    renderPurchase() {
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        
        if (cart.length === 0) {
            this.container.innerHTML = '<p>No has realizado ninguna compra.</p>';
            return;
        }

        let html = '<ul class="purchase-list">';
        cart.forEach(id => {
            const pokemon = this.model.getPokemonById(parseInt(id));
            if (pokemon) {
                html += `
                    <li>
                        <div class="pokemon-card">
                            <img src="${pokemon.pkm_front}" alt="${pokemon.name} front">
                            <h2>${pokemon.name}</h2>
                            <p>ID: ${pokemon.id}</p>
                            <p>Attack: ${pokemon.attack}</p>
                            <p>Weight: ${pokemon.weight}</p>
                            <p>Price: ${pokemon.price}€</p>
                        </div>
                    </li>
                `;
            }
        });
        html += '</ul>';
        this.container.innerHTML = html;
    }
}

// Inicializa la vista de compra cuando se carga la página
document.addEventListener("DOMContentLoaded", () => {
    const purchaseView = new PurchaseView();
    purchaseView.init();
});