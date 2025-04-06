document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const welcomeScreen = document.getElementById('welcome-screen');
    const gameScreen = document.getElementById('game-screen');
    const resultScreen = document.getElementById('result-screen');
    const collectionScreen = document.getElementById('collection-screen');
    const startButton = document.getElementById('start-button');
    const submitButton = document.getElementById('submit-answer');
    const nextButton = document.getElementById('next-button');
    const viewCollectionButton = document.getElementById('view-collection-button');
    const backToGameButton = document.getElementById('back-to-game-button');
    const resetGameButton = document.getElementById('reset-game-button');
    const pokemonImage = document.getElementById('pokemon-image');
    const pokemonName = document.getElementById('pokemon-name');
    const questionText = document.getElementById('question-text');
    const answerInput = document.getElementById('answer-input');
    const resultText = document.getElementById('result-text');
    const caughtCountElement = document.getElementById('caught-count');
    const collectionContainer = document.getElementById('collection-container');

    // Game variables
    let pokemonList = [];
    let currentPokemon = null;
    let num1 = 0;
    let num2 = 0;
    let correctAnswer = 0;
    let caughtPokemon = [];

    // Load any previously caught Pokemon from localStorage
    loadGameState();

    // Initialize the game
    async function initGame() {
        // Get list of Pokemon from the images folder
        await loadPokemonList();

        // Add event listeners
        startButton.addEventListener('click', startGame);
        submitButton.addEventListener('click', checkAnswer);
        nextButton.addEventListener('click', nextPokemon);
        viewCollectionButton.addEventListener('click', showCollection);
        backToGameButton.addEventListener('click', () => showScreen(gameScreen));

        // Make sure to add the reset button event listener
        if (resetGameButton) {
            resetGameButton.addEventListener('click', resetGame);
            console.log('Reset button event listener added');
        } else {
            console.error('Reset button not found in the DOM');
        }

        // Allow pressing Enter to submit answer
        answerInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                checkAnswer();
            }
        });

        // Update the caught count display
        updateCaughtCount();
    }

    // Load game state from localStorage
    function loadGameState() {
        const savedState = localStorage.getItem('pokemonGameState');
        if (savedState) {
            try {
                const state = JSON.parse(savedState);
                caughtPokemon = state.caughtPokemon || [];
            } catch (e) {
                console.error('Error loading game state:', e);
                caughtPokemon = [];
            }
        }
    }

    // Save game state to localStorage
    function saveGameState() {
        const gameState = {
            caughtPokemon: caughtPokemon
        };
        localStorage.setItem('pokemonGameState', JSON.stringify(gameState));
    }

    // Load Pokemon list from the images folder
    async function loadPokemonList() {
        // In a real app, you would fetch this from the server
        // For now, we'll hardcode the list based on the images we saw
        pokemonList = [
            'abra', 'aerodactyl', 'alakazam', 'arbok', 'arcanine', 'arceus', 'articuno',
            'beedrill', 'bellsprout', 'blastoise', 'bulbasaur', 'butterfree',
            'caterpie', 'chansey', 'charizard', 'charmander', 'charmeleon', 'clefable', 'clefairy', 'cloyster', 'cubone',
            'dewgong', 'diglett', 'ditto', 'dodrio', 'doduo', 'dragonair', 'dragonite', 'dratini', 'drowzee', 'dugtrio',
            'eevee', 'ekans', 'electabuzz', 'electrode', 'exeggcute', 'exeggutor',
            'farfetchd', 'fearow', 'flareon',
            'gastly', 'gengar', 'geodude', 'gloom', 'golbat', 'goldeen', 'golduck', 'golem', 'graveler',
            'growlithe', 'gyarados',
            'haunter', 'hitmonchan', 'hitmonlee', 'horsea', 'hypno',
            'ivysaur',
            'jigglypuff', 'jolteon', 'jynx',
            'kabuto', 'kabutops', 'kadabra', 'kakuna', 'kangaskhan', 'kingler', 'koffing', 'krabby',
            'lapras', 'lickitung',
            'machamp', 'machoke', 'machop', 'magikarp', 'magmar', 'magnemite', 'magneton', 'mankey', 'marowak', 'meowth', 'metapod', 'mew', 'mewtwo', 'moltres', 'mrmime', 'muk',
            'nidoking', 'nidoqueen', 'nidorina', 'nidorino', 'ninetales', 'oddish', 'omanyte', 'omastar', 'onix',
            'paras', 'parasect', 'persian', 'pidgeot', 'pidgeotto', 'pidgey', 'pikachu', 'pinsir', 'poliwag', 'poliwhirl', 'poliwrath', 'ponyta', 'porygon', 'primeape', 'psyduck',
            'raichu', 'rapidash', 'raticate', 'rattata', 'rhydon', 'rhyhorn',
            'sandshrew', 'sandslash', 'scyther', 'seadra', 'seaking', 'seel', 'shellder', 'slowbro', 'slowpoke', 'snorlax', 'spearow', 'squirtle', 'starmie', 'staryu',
            'tangela', 'tauros', 'tentacool', 'tentacruel',
            'vaporeon', 'venomoth', 'venonat', 'venusaur', 'victreebel', 'vileplume', 'voltorb', 'vulpix',
            'wartortle', 'weedle', 'weepinbell', 'weezing', 'wigglytuff',
            'zapdos', 'zubat'
        ];
    }

    // Start the game
    function startGame() {
        showScreen(gameScreen);
        nextPokemon();
    }

    // Display the next Pokemon
    function nextPokemon() {
        // Get a random Pokemon
        const randomIndex = Math.floor(Math.random() * pokemonList.length);
        currentPokemon = pokemonList[randomIndex];

        // Get the current difficulty level based on number of caught Pokemon
        generateMathProblem();

        // Update the UI
        pokemonImage.src = `pokemon_images/${currentPokemon}.png`;
        pokemonName.textContent = formatPokemonName(currentPokemon);

        // Clear previous answer
        answerInput.value = '';

        // Show game screen
        showScreen(gameScreen);

        // Focus on the answer input
        answerInput.focus();
    }

    // Generate math problem based on player's progress
    function generateMathProblem() {
        const caughtCount = caughtPokemon.length;
        let questionString = '';

        // Level 1: First 5 Pokemon - 2 numbers from 1-9
        if (caughtCount < 7) {
            num1 = Math.floor(Math.random() * 10) ;
            num2 = Math.floor(Math.random() * 10) ;
            correctAnswer = num1 + num2;
            questionString = `${num1} + ${num2}`;
        }
        // Level 2: Pokemon 6-12 - 3 numbers from 1-10 with sum <= 14
        else if (caughtCount < 12) {
            do {
                num1 = Math.floor(Math.random() * 10) + 1;
                num2 = Math.floor(Math.random() * 10) + 1;
                const num3 = Math.floor(Math.random() * 10) + 1;
                correctAnswer = num1 + num2 + num3;
                questionString = `${num1} + ${num2} + ${num3}`;
            } while (correctAnswer > 14);
        }
        // Level 3: Pokemon 13-24 - 2 numbers from 6-13
        else if (caughtCount < 24) {
            num1 = Math.floor(Math.random() * 8) + 6; // 6-13
            num2 = Math.floor(Math.random() * 8) + 6; // 6-13
            correctAnswer = num1 + num2;
            questionString = `${num1} + ${num2}`;
        }
        // Level 4: Pokemon 25+ - 3 numbers from 5-15
        else {
            num1 = Math.floor(Math.random() * 11) + 5; // 5-15
            num2 = Math.floor(Math.random() * 11) + 5; // 5-15
            const num3 = Math.floor(Math.random() * 11) + 5; // 5-15
            correctAnswer = num1 + num2 + num3;
            questionString = `${num1} + ${num2} + ${num3}`;
        }

        // Update question text
        questionText.textContent = `To ${formatPokemonName(currentPokemon)}! Potrzebujesz Pokeballa o mocy: ${questionString}`;
    }

    // Format Pokemon name (capitalize first letter and handle special cases)
    function formatPokemonName(name) {
        if (name === 'mrmime') return 'Mr. Mime';
        if (name === 'farfetchd') return 'Farfetch\'d';
        return name.charAt(0).toUpperCase() + name.slice(1);
    }

    // Check the user's answer
    function checkAnswer() {
        const userAnswer = parseInt(answerInput.value);

        if (isNaN(userAnswer)) {
            // Invalid input
            alert('Proszę podać liczbę!');
            answerInput.focus();
            return;
        }

        // Check if the answer is correct
        const isCorrect = userAnswer === correctAnswer;

        // Show result screen
        if (isCorrect) {
            resultText.textContent = `Gratulacje! Złapałeś ${formatPokemonName(currentPokemon)}!`;
            resultText.className = 'success';

            // Add to caught Pokemon if not already caught
            if (!caughtPokemon.includes(currentPokemon)) {
                caughtPokemon.push(currentPokemon);
                saveGameState();
                updateCaughtCount();
            }
        } else {
            resultText.textContent = `Niestety! ${formatPokemonName(currentPokemon)} uciekł!`;
            resultText.className = 'failure';
        }

        showScreen(resultScreen);
    }

    // Show the collection screen with all caught Pokemon
    function showCollection() {
        // Clear the container first
        collectionContainer.innerHTML = '';

        if (caughtPokemon.length === 0) {
            // No Pokemon caught yet
            collectionContainer.innerHTML = '<div class="empty-collection">Nie złapałeś jeszcze żadnego Pokemona!</div>';
        } else {
            // Sort the caught Pokemon alphabetically
            const sortedPokemon = [...caughtPokemon].sort();

            // Add each caught Pokemon to the collection
            sortedPokemon.forEach(pokemon => {
                const card = document.createElement('div');
                card.className = 'pokemon-card';

                const img = document.createElement('img');
                img.src = `pokemon_images/${pokemon}.png`;
                img.alt = formatPokemonName(pokemon);

                const name = document.createElement('p');
                name.textContent = formatPokemonName(pokemon);

                card.appendChild(img);
                card.appendChild(name);
                collectionContainer.appendChild(card);
            });
        }

        showScreen(collectionScreen);
    }

    // Reset the game collection
    function resetGame() {
        if (confirm('Czy na pewno chcesz zresetować kolekcję? Stracisz wszystkie złapane Pokemony!')) {
            // Clear caught Pokemon
            caughtPokemon = [];

            // Clear localStorage
            localStorage.removeItem('pokemonGameState');

            // Update UI
            updateCaughtCount();

            // Refresh the collection view
            showCollection();

            console.log('Kolekcja została zresetowana');
        }
    }

    // Update the caught count display
    function updateCaughtCount() {
        caughtCountElement.textContent = caughtPokemon.length;
    }

    // Helper function to show a specific screen
    function showScreen(screen) {
        welcomeScreen.classList.remove('active');
        gameScreen.classList.remove('active');
        resultScreen.classList.remove('active');
        collectionScreen.classList.remove('active');

        screen.classList.add('active');
    }

    // Initialize the game
    initGame();
});
