const pokemonList = document.getElementById('pokemonList');
const loadMoreButton = document.getElementById('loadMoreButton');
let currentPopup = null; 

const maxRecords = 649;
const limit = 120;
let offset = 0;

function convertPokemonToLi(pokemon) { 
    return `
        <li class="pokemon ${pokemon.type}">
            <span class="number">#${pokemon.number}</span>
            <span class="name">${pokemon.name}</span>

            <div class="detail">
                <ol class="types">
                    ${pokemon.types.map((type) => `<li class="type ${type}">${type}</li>`).join('')}
                    <div id="pokeDetails"></div>
                    <button class="show-popup button" data-pokemon-number="${pokemon.number}"> More Details</button>
                    </ol>
                    <div class="popup" id="meuPopup_${pokemon.number}">
                    <div id="details">
                    <button class="closePopupButton close">
                    <svg height="20px" width="20px" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 512 512" xml:space="preserve" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path style="fill:#ffffff;" d="M512,464h-48c0-88.365-23.635-160-112-160H192v64h-32L0,208L160,48h32v64h128 c106.038,0,192,85.962,192,192l0,0V464z"></path> <path style="fill:#ffffff;" d="M320,112h-48v192h80c88.365,0,112,71.634,112,160h48V304l0,0C512,197.962,426.038,112,320,112z"></path> </g></svg>
                    </button>
                        <img id="photo_${pokemon.number}" src="${pokemon.photo}" alt="${pokemon.name}">
                        <p id="name_${pokemon.number}"></p>
                        <div class="height">
                        <p id="height_${pokemon.number}">Kg</p>
                        </div>
                        <div class="weight">
                        <p id="weight_${pokemon.number}">Alt</p>
                        </div>
                        <div class="stat">
                            <p id="hp_${pokemon.number}"></p>
                            <div class="progress-barHp">
                                <div id="hp-bar_${pokemon.number}">
                                <img class="statusImage1" id="statusImage1_${pokemon.number}" src="">
                                </div>
                            </div>
                        </div>
                        <div class="stat">
                            <p id="attack_${pokemon.number}"></p>
                            <div class="progress-barAttack">
                                <div id="attack-bar_${pokemon.number}"></div>
                                <img class="statusImage2" id="statusImage2_${pokemon.number}" src="">
                            </div>
                        </div>
                        <div class="stat">
                            <p id="defense_${pokemon.number}"></p>
                            <img class="statusImage3" id="statusImage3_${pokemon.number}" src="">
                            <div class="progress-barDefense">
                                <div id="defense-bar_${pokemon.number}"></div>
                            </div>
                        </div>
                        <div class="stat">
                            <p id="specialAttack_${pokemon.number}"></p>
                            <img class="statusImage4" id="statusImage4_${pokemon.number}" src="">
                            <div class="progress-barSpecialAtc">
                                <div id="specialAttack-bar_${pokemon.number}"></div>
                            </div>
                        </div>
                        <div class="stat">
                            <p id="specialDefense_${pokemon.number}"></p>
                            <img class="statusImage5" id="statusImage5_${pokemon.number}" src="">
                            <div class="progress-barSpecialDef">
                                <div id="specialDefense-bar_${pokemon.number}"></div>
                            </div>
                        </div>
                        <div class="stat">
                            <p id="speed_${pokemon.number}"></p>
                            <img class="statusImage6" id="statusImage6_${pokemon.number}" src="">
                            <div class="progress-barSpeed">
                                <div id="speed-bar_${pokemon.number}"></div>
                            </div>
                        </div>
                    </div>
                </div>
                <img id="photo_${pokemon.number}" src="${pokemon.photo}" alt="${pokemon.name}">
            </div>
        </li>
    `;
}

function loadPokemonItems(offset, limit) {
    pokeApi.getPokemons(offset, limit).then((pokemons = []) => {
        const newHtml = pokemons.map(convertPokemonToLi).join('');
        pokemonList.innerHTML += newHtml;
        addMoreDetailsEventListeners(); 
    });
}

loadPokemonItems(offset, limit);

loadMoreButton.addEventListener('click', () => {
    offset += limit;
    const qtdRecordsWithNextPage = offset + limit;

    if (qtdRecordsWithNextPage >= maxRecords) {
        const newLimit = maxRecords - offset;
        loadPokemonItems(offset, newLimit);
        loadMoreButton.parentElement.removeChild(loadMoreButton);
    } else {
        loadPokemonItems(offset, limit);
    }
});

function carregaPokemon(numeroDoPokemon) {

    if (currentPopup) {
        fecharPopup(currentPopup.id.split("_")[1]);
    }
    

    fetch('https://pokeapi.co/api/v2/pokemon/' + numeroDoPokemon)
        .then(response => response.json())
        .then(data => {

            const popup = document.getElementById("meuPopup_" + numeroDoPokemon);
            popup.style.display = "flex"; 
            currentPopup = popup; 


            document.getElementById("name_" + numeroDoPokemon).textContent = "Name: " + data.name;
            document.getElementById("height_" + numeroDoPokemon).textContent = "height: " + (data.height / 10 + ' Mts');
            document.getElementById("weight_" + numeroDoPokemon).textContent = "weight: " + (data.weight / 10 + ' Kg');
            document.getElementById("photo_" + numeroDoPokemon).setAttribute("src", `${data.sprites.other.dream_world.front_default}`);
            document.getElementById("hp_" + numeroDoPokemon).textContent = "HP: " + data.stats[0].base_stat;
            document.getElementById("statusImage1_" + numeroDoPokemon).setAttribute("src", 'assets/img/hp.png');
            document.getElementById("attack_" + numeroDoPokemon).textContent = "Attack: " + data.stats[1].base_stat;
            document.getElementById("statusImage2_" + numeroDoPokemon).setAttribute("src", 'assets/img/attack.png');
            document.getElementById("defense_" + numeroDoPokemon).textContent = "Defense: " + data.stats[2].base_stat;
            document.getElementById("statusImage3_" + numeroDoPokemon).setAttribute("src", 'assets/img/defense.png');
            document.getElementById("specialAttack_" + numeroDoPokemon).textContent = "Special Attack: " + data.stats[3].base_stat;
            document.getElementById("statusImage4_" + numeroDoPokemon).setAttribute("src", 'assets/img/special-attack.png');
            document.getElementById("specialDefense_" + numeroDoPokemon).textContent = "Special Defense: " + data.stats[4].base_stat;
            document.getElementById("statusImage5_" + numeroDoPokemon).setAttribute("src", 'assets/img/special-defense.png');
            document.getElementById("speed_" + numeroDoPokemon).textContent = "Speed: " + data.stats[5].base_stat;
            document.getElementById("statusImage6_" + numeroDoPokemon).setAttribute("src", 'assets/img/speed.png');


            const hpWidth = (data.stats[0].base_stat / 255) * 100 + '%';
            document.getElementById("hp-bar_" + numeroDoPokemon).style.width = hpWidth;

            const attackWidth = (data.stats[1].base_stat / 165) * 100 + '%';
            document.getElementById("attack-bar_" + numeroDoPokemon).style.width = attackWidth;

            const defenseWidth = (data.stats[2].base_stat / 230) * 100 + '%';
            document.getElementById("defense-bar_" + numeroDoPokemon).style.width = defenseWidth;

            const specialAttackWidth = (data.stats[3].base_stat / 154) * 100 + '%';
            document.getElementById("specialAttack-bar_" + numeroDoPokemon).style.width = specialAttackWidth;

            const specialDefenseWidth = (data.stats[4].base_stat / 230) * 100 + '%';
            document.getElementById("specialDefense-bar_" + numeroDoPokemon).style.width = specialDefenseWidth;

            const speedWidth = (data.stats[5].base_stat / 160) * 100 + '%';
            document.getElementById("speed-bar_" + numeroDoPokemon).style.width = speedWidth;


            const fecharPopupButton = popup.querySelector(".closePopupButton");
            fecharPopupButton.addEventListener("click", () => {
                fecharPopup(numeroDoPokemon);
            });
        })
        .catch(error => {
            console.error('Erro ao carregar os detalhes do Pokémon:', error);
        });
}

function fecharPopup(numeroDoPokemon) {
    const popup = document.getElementById("meuPopup_" + numeroDoPokemon);
    popup.style.display = "none"; 
    currentPopup = null; 
}


function searchPokemon() {
    const searchInput = document.getElementById('searchInput');
    const searchText = searchInput.value.trim().toLowerCase();

    const pokemonElements = document.querySelectorAll('.pokemon');
    pokemonElements.forEach(pokemonElement => {
        const pokemonName = pokemonElement.querySelector('.name').textContent.toLowerCase();
        const pokemonType = pokemonElement.querySelector('.type').textContent.toLowerCase();
        const pokemonNumber = pokemonElement.querySelector('.number').textContent.toLowerCase();
        if (pokemonName.includes(searchText) || pokemonType.includes(searchText) || pokemonNumber.includes(searchText)) {
            pokemonElement.style.display = 'block';
        } else {
            pokemonElement.style.display = 'none';
        }
    });
    addMoreDetailsEventListeners();
}


const searchInput = document.getElementById('searchInput');
searchInput.addEventListener('keyup', searchPokemon);


function addMoreDetailsEventListeners() {
    const buttons = document.querySelectorAll('.show-popup');
    buttons.forEach(button => {
        button.addEventListener('click', function() {
            const pokemonNumber = this.getAttribute('data-pokemon-number');
            if (currentPopup) {
                currentPopup.style.display = "none";
            }
            // Abre o novo pop-up
            carregaPokemon(pokemonNumber);
        });
    });


    searchInput.addEventListener('focus', function() {
        if (this.placeholder === 'Pesquisar Pokemons...') {
            this.placeholder = '';
        }
    });
    
    searchInput.addEventListener('blur', function() {
        if (this.placeholder === '') {
            this.placeholder = 'Pesquisar Pokemons...';
        }
    });
}