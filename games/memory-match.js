// Juego de Memoria - Memory Match

let cards = [];
let flippedCards = [];
let matchedPairs = 0;
let totalPairs = 8; // Por defecto, puede cambiarse
let isLocked = false;
let timer = 0;
let timerInterval;
let moves = 0;

// Inicializar el juego
function initMemoryGame(container) {
    // Limpiar el contenedor
    const gameContainer = document.getElementById(container);
    if (!gameContainer) return;
    
    gameContainer.innerHTML = '';
    
    // Fijar número de pares a 8 (16 casillas)
    totalPairs = 4;
    
    // Crear interfaz del juego simplificada
    createGameInterface(gameContainer);
    
    // Crear y barajar cartas
    createCards(totalPairs);
    
    // Renderizar cartas
    renderCards(gameContainer);
    
    // Reiniciar variables de juego
    flippedCards = [];
    matchedPairs = 0;
    isLocked = false;
}

function createGameInterface(container) {
    // No creamos el panel de información ya que no lo queremos mostrar
    
    // Crear contenedor de cartas
    const cardsContainer = document.createElement('div');
    cardsContainer.className = 'memory-cards-container';
    cardsContainer.id = 'memory-cards';
    container.appendChild(cardsContainer);
}

function getCurrentDifficulty() {
    const activeBtn = document.querySelector('.difficulty-btn.active');
    return activeBtn ? activeBtn.dataset.difficulty : 'medium';
}

function createCards(pairs) {
    // Reiniciar array de cartas
    cards = [];
    
    // Total de imágenes disponibles (del 1 al 11)
    const totalAvailableImages = 11;
    
    // Seleccionar aleatoriamente 'pairs' números de imágenes
    const selectedValues = [];
    while (selectedValues.length < pairs) {
        // Generar un número aleatorio entre 1 y 11
        const randomValue = Math.floor(Math.random() * totalAvailableImages) + 1;
        
        // Añadir el valor solo si no está ya en el array
        if (!selectedValues.includes(randomValue)) {
            selectedValues.push(randomValue);
        }
    }
    
    // Crear pares de cartas con los valores seleccionados
    selectedValues.forEach((value, index) => {
        // Cada par tiene el mismo valor pero diferente id
        cards.push({
            id: (index + 1) + '-A',
            value: value,  // Usamos el valor aleatorio seleccionado
            flipped: false,
            matched: false
        });
        
        cards.push({
            id: (index + 1) + '-B',
            value: value,  // Usamos el valor aleatorio seleccionado
            flipped: false,
            matched: false
        });
    });
    
    // Barajar cartas
    shuffleCards();
}

function shuffleCards() {
    // Algoritmo de Fisher-Yates para barajar
    for (let i = cards.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [cards[i], cards[j]] = [cards[j], cards[i]];
    }
}

function renderCards(container) {
    const cardsContainer = document.getElementById('memory-cards');
    if (!cardsContainer) return;
    
    cardsContainer.innerHTML = '';
    
    // Determinar número de columnas basado en la dificultad
    const columns = totalPairs <= 6 ? 4 : (totalPairs <= 8 ? 4 : 6);
    cardsContainer.style.gridTemplateColumns = `repeat(${columns}, 1fr)`;
    
    // Crear elementos de carta
    cards.forEach(card => {
        const cardElement = document.createElement('div');
        cardElement.className = 'memory-card';
        cardElement.dataset.id = card.id;
        cardElement.dataset.value = card.value;
        
        // Estructura interna de la carta
        cardElement.innerHTML = `
            <div class="memory-card-inner">
                <div class="memory-card-front">
                    <img src="../images/tibo-logo.png" alt="TiBO">
                </div>
                <div class="memory-card-back">
                    <img src="memory-images/Carta_Empareja_${card.value}.png" alt="Carta ${card.value}">
                </div>
            </div>
        `;
        
        // Añadir evento de click
        cardElement.addEventListener('click', () => flipCard(cardElement));
        
        cardsContainer.appendChild(cardElement);
    });
}

function flipCard(cardElement) {
    const cardId = cardElement.dataset.id;
    const card = cards.find(c => c.id === cardId);
    
    // Verificar si la carta ya está volteada, emparejada o si el juego está bloqueado
    if (card.flipped || card.matched || isLocked || flippedCards.length >= 2) return;
    
    // Voltear la carta
    card.flipped = true;
    cardElement.classList.add('flipped');
    flippedCards.push(card);
    
    // Si hay dos cartas volteadas, verificar si son pareja
    if (flippedCards.length === 2) {
        moves++;
        updateMovesDisplay();
        isLocked = true;
        
        // Comprobar si las cartas coinciden
        if (flippedCards[0].value === flippedCards[1].value) {
            // Son pareja
            matchCards();
        } else {
            // No son pareja
            setTimeout(resetFlippedCards, 1000);
        }
    }
}

function matchCards() {
    // Marcar las cartas como emparejadas
    flippedCards.forEach(card => {
        card.matched = true;
        document.querySelector(`.memory-card[data-id="${card.id}"]`).classList.add('matched');
    });
    
    // Incrementar contador de parejas
    matchedPairs++;
    
    // Reiniciar cartas volteadas
    flippedCards = [];
    isLocked = false;
    
    // Verificar si se completó el juego
    if (matchedPairs === totalPairs) {
        gameComplete();
    }
}

function resetFlippedCards() {
    // Voltear las cartas de nuevo
    flippedCards.forEach(card => {
        card.flipped = false;
        document.querySelector(`.memory-card[data-id="${card.id}"]`).classList.remove('flipped');
    });
    
    // Reiniciar cartas volteadas
    flippedCards = [];
    isLocked = false;
}

function startTimer() {
    // Detener temporizador anterior si existe
    if (timerInterval) clearInterval(timerInterval);
    
    // Iniciar nuevo temporizador
    timer = 0;
    updateTimerDisplay();
    timerInterval = setInterval(() => {
        timer++;
        updateTimerDisplay();
    }, 1000);
}

function stopTimer() {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
}

function updateTimerDisplay() {
    const timerElement = document.getElementById('memory-timer');
    if (timerElement) timerElement.textContent = timer;
}

function updateMovesDisplay() {
    const movesElement = document.getElementById('memory-moves');
    if (movesElement) movesElement.textContent = moves;
}

function gameComplete() {
    // Detener temporizador
    stopTimer();
    
    // Mostrar mensaje de victoria
    setTimeout(() => {
        const gameContainer = document.getElementById('memory-cards').parentElement;
        
        // Crear overlay de victoria
        const victoryOverlay = document.createElement('div');
        victoryOverlay.className = 'memory-victory-overlay';
        victoryOverlay.innerHTML = `
            <div class="memory-victory-message">
                <h2>¡Felicidades!</h2>
                <p>¡Has completado el juego!</p>
                <button id="play-again" class="memory-button">Jugar de nuevo</button>
            </div>
        `;
        
        gameContainer.appendChild(victoryOverlay);
        
        // Añadir evento al botón de jugar de nuevo
        document.getElementById('play-again').addEventListener('click', () => {
            victoryOverlay.remove();
            initMemoryGame(gameContainer.id, getCurrentDifficulty());
        });
    }, 500);
}

// Exportar funciones para uso externo
window.MemoryGame = {
    init: initMemoryGame
};