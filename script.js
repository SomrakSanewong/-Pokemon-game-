const generateButton = document.getElementById('generateButton');
const pokemonImage = document.getElementById('pokemonImage');
const choicesContainer = document.getElementById('choicesContainer');
const resultMessage = document.getElementById('resultMessage');
const correctImagesContainer = document.getElementById('correctImagesContainer');

let answeredCorrectly = [];
let availablePokemons = Array.from({ length: 150 }, (_, i) => i + 1);

generateButton.addEventListener('click', getRandomPokemon);

async function getRandomPokemon() {
    if (availablePokemons.length === 0) {
        resultMessage.textContent = 'คุณทายครบทุกตัวแล้ว!';
        resultMessage.style.color = 'green';
        pokemonImage.style.display = 'none';
        choicesContainer.innerHTML = '';
        return;
    }

    const randomIndex = Math.floor(Math.random() * availablePokemons.length);
    const randomId = availablePokemons[randomIndex];

    try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${randomId}`);
        if (!response.ok) throw new Error('โปเกม่อนไม่พบ');

        const data = await response.json();
        showPokemon(data, randomId);
    } catch (error) {
        alert(error.message);
    }
}

function showPokemon(pokemon, pokemonId) {
    pokemonImage.src = pokemon.sprites.front_default;
    pokemonImage.style.display = 'block';

    const correctName = pokemon.name;
    const wrongNames = getWrongNames(correctName);

    const options = shuffleArray([correctName, ...wrongNames]);
    choicesContainer.innerHTML = '';
    resultMessage.textContent = '';

    options.forEach(option => {
        const button = document.createElement('button');
        button.textContent = option;
        button.className = 'choice-button';
        button.addEventListener('click', () => checkAnswer(option, correctName, pokemonId));
        choicesContainer.appendChild(button);
    });
}

function checkAnswer(selectedName, correctName, pokemonId) {
    if (selectedName === correctName) {
        resultMessage.textContent = 'ถูกต้อง!';
        resultMessage.style.color = 'green';
        showCorrectPokemonImage(pokemonId);
        answeredCorrectly.push(pokemonId);
        availablePokemons = availablePokemons.filter(id => id !== pokemonId);
        setTimeout(getRandomPokemon, 1000);
    } else {
        resultMessage.textContent = 'ผิด!';
        resultMessage.style.color = 'red';
    }
}

function showCorrectPokemonImage(pokemonId) {
    const img = document.createElement('img');
    img.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonId}.png`;
    correctImagesContainer.appendChild(img);
}

function getWrongNames(correctName) {
    const allNames = ['bulbasaur', 'ivysaur', 'venusaur', 'charmander', 'charmeleon', 'charizard', 'squirtle', 'wartortle', 'blastoise', 'caterpie', 'metapod', 'butterfree', 'pikachu', 'jigglypuff', 'meowth', 'psyduck'];
    const filteredNames = allNames.filter(name => name !== correctName);
    return shuffleArray(filteredNames).slice(0, 2);
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}
