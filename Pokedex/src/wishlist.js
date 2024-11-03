import { PokemonModel } from './models/PokemonModel.js';

class WishlistView {
    constructor() {
        this.container = document.getElementById('wishlist-container');
        this.backButton = document.getElementById('backToPokedex');
        this.model = new PokemonModel();
    }

    async init() {
        await this.model.loadPokemons();
        this.renderWishlist();
        this.backButton.addEventListener('click', () => window.location.href = 'pokedex.html');
    }

    renderWishlist() {
        const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
        
        if (wishlist.length === 0) {
            this.container.innerHTML = '<p>Tu lista de deseos está vacía.</p>';
            return;
        }

        let html = '<ul class="wishlist">';
        wishlist.forEach(id => {
            const pokemon = this.model.getPokemonById(parseInt(id));
            if (pokemon) {
                html += `
                    <li class="wishlist-item">
                        <img src="${pokemon.pkm_front}" alt="${pokemon.name}">
                        <span>${pokemon.name}</span>
                    </li>
                `;
            }
        });
        html += '</ul>';

        this.container.innerHTML = html;
    }
}

const view = new WishlistView();
view.init();