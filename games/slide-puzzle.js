// Juego de Puzzle Deslizante - Slide Puzzle

let puzzleSize = 4; // Tamaño del puzzle (fijado a 4x4)
let tiles = [];
let emptyTile = { row: 0, col: 0 };
let isGameComplete = false;
let currentImage = 1; // Imagen actual (1-11)

// Inicializar el juego
function initSlidePuzzle(container, imageNumber = 1) {
    // Limpiar el contenedor
    const gameContainer = document.getElementById(container);
    if (!gameContainer) return;
    
    gameContainer.innerHTML = '';
    
    // Configurar variables
    puzzleSize = 4; // Fijado a 4x4
    currentImage = imageNumber;
    isGameComplete = false;
    
    // Crear interfaz del juego
    createGameInterface(gameContainer);
    
    // Crear y barajar tiles
    createTiles();
    
    // Renderizar tiles
    renderTiles(gameContainer);
}

function createGameInterface(container) {
    // Crear selector de imagen (sin etiqueta) - Ahora va antes del contenedor principal
    const imageSelector = document.createElement('div');
    imageSelector.className = 'puzzle-image-selector';
    imageSelector.innerHTML = `
        <div class="puzzle-image-options">
            ${generateImageOptions()}
        </div>
    `;
    container.appendChild(imageSelector);
    
    // Crear contenedor principal para el puzzle y la imagen
    const mainContainer = document.createElement('div');
    mainContainer.className = 'puzzle-main-container';
    container.appendChild(mainContainer);
    
    // Crear contenedor izquierdo para la imagen completa
    const leftContainer = document.createElement('div');
    leftContainer.className = 'puzzle-left-container';
    mainContainer.appendChild(leftContainer);
    
    // Crear contenedor derecho para el puzzle
    const rightContainer = document.createElement('div');
    rightContainer.className = 'puzzle-right-container';
    mainContainer.appendChild(rightContainer);
    
    // Crear contenedor del puzzle
    const puzzleContainer = document.createElement('div');
    puzzleContainer.className = 'puzzle-container';
    puzzleContainer.id = 'puzzle-grid';
    rightContainer.appendChild(puzzleContainer);
    
    // Crear vista previa de la imagen (a la izquierda)
    const previewContainer = document.createElement('div');
    previewContainer.className = 'puzzle-preview-container';
    previewContainer.innerHTML = `
        <div class="puzzle-preview">
            <img src="../games/puzzle-images/Minigame_Puzzle_${currentImage}.png" alt="Vista previa" id="puzzle-preview-img">
        </div>
    `;
    leftContainer.appendChild(previewContainer);
    
    // Añadir evento para ampliar la imagen al hacer clic
    document.querySelector('.puzzle-preview').addEventListener('click', () => {
        const overlay = document.createElement('div');
        overlay.className = 'puzzle-image-overlay';
        overlay.innerHTML = `
            <div class="puzzle-image-enlarged">
                <img src="../games/puzzle-images/Minigame_Puzzle_${currentImage}.png" alt="Imagen ampliada">
                <button class="close-button">&times;</button>
            </div>
        `;
        document.body.appendChild(overlay);
        
        // Cerrar al hacer clic en el overlay o en el botón de cierre
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay || e.target.className === 'close-button') {
                overlay.remove();
            }
        });
    });
    
    // No hay botón de reinicio
    
    // Añadir eventos a los botones de dificultad
    document.querySelectorAll('.difficulty-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            // Quitar clase activa de todos los botones
            document.querySelectorAll('.difficulty-btn').forEach(b => b.classList.remove('active'));
            // Añadir clase activa al botón clickeado
            e.target.classList.add('active');
            // Reiniciar juego con nuevo tamaño
            initSlidePuzzle(container.id, parseInt(e.target.dataset.size), currentImage);
        });
    });
    
    // Añadir eventos a los selectores de imagen
    document.querySelectorAll('.puzzle-image-option').forEach(option => {
        option.addEventListener('click', (e) => {
            // Quitar clase activa de todas las opciones
            document.querySelectorAll('.puzzle-image-option').forEach(o => o.classList.remove('active'));
            // Añadir clase activa a la opción clickeada
            e.target.classList.add('active');
            // Actualizar imagen actual
            currentImage = parseInt(e.target.dataset.image);
            // Actualizar vista previa
            document.getElementById('puzzle-preview-img').src = `../games/puzzle-images/Minigame_Puzzle_${currentImage}.png`;
            // Reiniciar juego con nueva imagen
            initSlidePuzzle(container.id, currentImage);
        });
    });
}

function generateImageOptions() {
    let options = '';
    for (let i = 1; i <= 11; i++) {
        options += `<img src="../games/puzzle-images/Minigame_Puzzle_${i}.png" alt="Imagen ${i}" class="puzzle-image-option ${i === currentImage ? 'active' : ''}" data-image="${i}">`;
    }
    return options;
}

function createTiles() {
    // Reiniciar array de tiles
    tiles = [];
    
    // Crear tiles ordenados
    for (let row = 0; row < puzzleSize; row++) {
        for (let col = 0; col < puzzleSize; col++) {
            // El último tile es el vacío
            if (row === puzzleSize - 1 && col === puzzleSize - 1) {
                emptyTile = { row, col };
            } else {
                tiles.push({
                    row,
                    col,
                    value: row * puzzleSize + col + 1
                });
            }
        }
    }
    
    // Barajar tiles (asegurando que sea resoluble)
    shuffleTiles();
}

function shuffleTiles() {
    // Realizar movimientos aleatorios para asegurar que el puzzle sea resoluble
    const moves = 1000; // Número de movimientos aleatorios
    
    for (let i = 0; i < moves; i++) {
        // Obtener tiles adyacentes al vacío
        const adjacentTiles = getAdjacentTiles();
        
        if (adjacentTiles.length > 0) {
            // Seleccionar un tile aleatorio de los adyacentes
            const randomIndex = Math.floor(Math.random() * adjacentTiles.length);
            const tileToMove = adjacentTiles[randomIndex];
            
            // Intercambiar posiciones
            swapTiles(tileToMove);
        }
    }
}

function getAdjacentTiles() {
    const adjacent = [];
    
    // Comprobar arriba
    if (emptyTile.row > 0) {
        const tile = tiles.find(t => t.row === emptyTile.row - 1 && t.col === emptyTile.col);
        if (tile) adjacent.push(tile);
    }
    
    // Comprobar abajo
    if (emptyTile.row < puzzleSize - 1) {
        const tile = tiles.find(t => t.row === emptyTile.row + 1 && t.col === emptyTile.col);
        if (tile) adjacent.push(tile);
    }
    
    // Comprobar izquierda
    if (emptyTile.col > 0) {
        const tile = tiles.find(t => t.row === emptyTile.row && t.col === emptyTile.col - 1);
        if (tile) adjacent.push(tile);
    }
    
    // Comprobar derecha
    if (emptyTile.col < puzzleSize - 1) {
        const tile = tiles.find(t => t.row === emptyTile.row && t.col === emptyTile.col + 1);
        if (tile) adjacent.push(tile);
    }
    
    return adjacent;
}

function renderTiles(container) {
    const puzzleContainer = document.getElementById('puzzle-grid');
    if (!puzzleContainer) return;
    
    puzzleContainer.innerHTML = '';
    puzzleContainer.style.gridTemplateColumns = `repeat(${puzzleSize}, 1fr)`;
    puzzleContainer.style.gridTemplateRows = `repeat(${puzzleSize}, 1fr)`;
    
    // Calcular dimensiones para recortar la imagen
    const tileSize = 100 / puzzleSize;
    
    // Crear elementos de tile
    tiles.forEach(tile => {
        const tileElement = document.createElement('div');
        tileElement.className = 'puzzle-tile';
        tileElement.dataset.row = tile.row;
        tileElement.dataset.col = tile.col;
        tileElement.dataset.value = tile.value;
        
        // Calcular posición de la imagen para este tile
        // Usamos el valor original de la pieza para determinar su posición en la imagen completa
        // El valor de cada pieza indica su posición correcta en el puzzle resuelto
        const originalRow = Math.floor((tile.value - 1) / puzzleSize);
        const originalCol = (tile.value - 1) % puzzleSize;
        
        // Aplicar estilo con la porción de imagen correspondiente
        tileElement.style.backgroundImage = `url('../games/puzzle-images/Minigame_Puzzle_${currentImage}.png')`;
        tileElement.style.backgroundSize = `${puzzleSize * 100}%`;
        // Ajustamos la posición de fondo para mostrar exactamente la porción correcta de la imagen
        // Cada pieza debe mostrar solo su parte correspondiente de la imagen completa
        tileElement.style.backgroundPosition = `${originalCol * (100 / (puzzleSize - 1))}% ${originalRow * (100 / (puzzleSize - 1))}%`;
        
        // Añadir número al tile (opcional, se puede quitar para mayor dificultad)
        tileElement.innerHTML = `<span class="puzzle-tile-number">${tile.value}</span>`;
        
        // Añadir evento de click
        tileElement.addEventListener('click', () => moveTile(tile));
        
        // Posicionar el tile en la cuadrícula
        tileElement.style.gridRow = tile.row + 1;
        tileElement.style.gridColumn = tile.col + 1;
        
        puzzleContainer.appendChild(tileElement);
    });
    
    // Añadir tile vacío
    const emptyTileElement = document.createElement('div');
    emptyTileElement.className = 'puzzle-tile empty';
    emptyTileElement.style.gridRow = emptyTile.row + 1;
    emptyTileElement.style.gridColumn = emptyTile.col + 1;
    puzzleContainer.appendChild(emptyTileElement);
}

function moveTile(tile) {
    // Verificar si el tile es adyacente al vacío
    if (isAdjacent(tile)) {
        // Intercambiar posiciones
        swapTiles(tile);
        
        // Actualizar UI
        updateTilePositions();
        
        // Verificar si se completó el puzzle
        if (checkCompletion()) {
            gameComplete();
        }
    }
}

function isAdjacent(tile) {
    // Verificar si el tile está arriba, abajo, izquierda o derecha del vacío
    return (
        (tile.row === emptyTile.row - 1 && tile.col === emptyTile.col) || // Arriba
        (tile.row === emptyTile.row + 1 && tile.col === emptyTile.col) || // Abajo
        (tile.row === emptyTile.row && tile.col === emptyTile.col - 1) || // Izquierda
        (tile.row === emptyTile.row && tile.col === emptyTile.col + 1)    // Derecha
    );
}

function swapTiles(tile) {
    // Intercambiar posiciones con el tile vacío
    const tempRow = tile.row;
    const tempCol = tile.col;
    
    tile.row = emptyTile.row;
    tile.col = emptyTile.col;
    
    emptyTile.row = tempRow;
    emptyTile.col = tempCol;
}

function updateTilePositions() {
    // Actualizar posiciones en el DOM
    tiles.forEach(tile => {
        const tileElement = document.querySelector(`.puzzle-tile[data-value="${tile.value}"]`);
        if (tileElement) {
            tileElement.style.gridRow = tile.row + 1;
            tileElement.style.gridColumn = tile.col + 1;
            tileElement.dataset.row = tile.row;
            tileElement.dataset.col = tile.col;
        }
    });
    
    // Actualizar posición del tile vacío
    const emptyTileElement = document.querySelector('.puzzle-tile.empty');
    if (emptyTileElement) {
        emptyTileElement.style.gridRow = emptyTile.row + 1;
        emptyTileElement.style.gridColumn = emptyTile.col + 1;
    }
}

function checkCompletion() {
    // Verificar si todos los tiles están en su posición correcta
    for (const tile of tiles) {
        const correctRow = Math.floor((tile.value - 1) / puzzleSize);
        const correctCol = (tile.value - 1) % puzzleSize;
        
        if (tile.row !== correctRow || tile.col !== correctCol) {
            return false;
        }
    }
    
    // Verificar si el tile vacío está en la esquina inferior derecha
    return emptyTile.row === puzzleSize - 1 && emptyTile.col === puzzleSize - 1;
}

// Funciones de temporizador y movimientos eliminadas para simplificar el juego

function gameComplete() {
    // Marcar juego como completado
    isGameComplete = true;
    
    // Mostrar mensaje de victoria
    setTimeout(() => {
        const gameContainer = document.getElementById('puzzle-grid').parentElement;
        
        // Crear overlay de victoria
        const victoryOverlay = document.createElement('div');
        victoryOverlay.className = 'puzzle-victory-overlay';
        victoryOverlay.innerHTML = `
            <div class="puzzle-victory-message">
                <h2>¡Felicidades!</h2>
                <p>¡Has completado el puzzle!</p>
                <button id="play-again" class="puzzle-button">Jugar de nuevo</button>
            </div>
        `;
        
        gameContainer.appendChild(victoryOverlay);
        
        // Añadir evento al botón de jugar de nuevo
        document.getElementById('play-again').addEventListener('click', () => {
            victoryOverlay.remove();
            initSlidePuzzle(gameContainer.id, currentImage);
        });
    }, 500);
}

// Exportar funciones para uso externo
window.SlidePuzzle = {
    init: initSlidePuzzle
};