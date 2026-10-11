// Emojis for the grids to match each animal.
const masterIcons = ['🦊', '🐸', '🐱', '🦁', '🦉', '🦄', '🐝', '🦖', '🐼', '🦀', '🐙', '🦋'];
// Categories of the game
const difficulties = {
    easy: { pairs: 6, time: 90, reward: 5 },
    medium: { pairs: 8, time: 60, reward: 3 },
    hard: { pairs: 12, time: 30, reward: 2 } 
};
// Main difficulty is medium and nothing starts until the user clicks on a card.
let activeDifficulty = 'medium';
let pendingDifficulty = null; 
let currentIcons = [];
let flippedCards = [];
let matchedPairsCount = 0;
let movesCount = 0;
let isProcessing = false;
// When the game start, the points/score/combo all stay constant until the user starts.
let score = 0;
let combo = 1;
const BASE_MATCH_POINTS = 100;
const POINTS_PER_SECOND_BONUS = 50; 
// Time starts or declines as the user plays.
let timeLeft = difficulties[activeDifficulty].time;
let timerInterval = null;
let gameStarted = false;

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function prepareCardDeck() {
    const config = difficulties[activeDifficulty];
    const selectedIcons = masterIcons.slice(0, config.pairs);
    currentIcons = [...selectedIcons, ...selectedIcons];
}

function startTimer() {
    timerInterval = setInterval(() => {
        timeLeft--;
        
        const timerDisplay = document.getElementById('timer');
        if (timerDisplay) {
            timerDisplay.textContent = timeLeft;
            if (timeLeft <= 10) {
                timerDisplay.parentElement.classList.add('time-warning');
            } else {
                timerDisplay.parentElement.classList.remove('time-warning');
            }
        }

        if (timeLeft <= 0) {
            handleGameOver();
        }
    }, 1000);
}

function stopTimer() {
    clearInterval(timerInterval);
}

function createGameBoard() {
    const gameBoard = document.getElementById('game-board');
    if (!gameBoard) return; // Defensive guard clause against missing elements
    
    gameBoard.innerHTML = '';
    gameBoard.className = `game-board ${activeDifficulty}`;
    
    prepareCardDeck();
    const shuffledIcons = shuffle([...currentIcons]);

    shuffledIcons.forEach(icon => {
        const cardElement = document.createElement('div');
        cardElement.classList.add('card');
        
        cardElement.textContent = "?";
        cardElement.dataset.icon = icon;

        cardElement.addEventListener('click', () => handleCardClick(cardElement));
        gameBoard.appendChild(cardElement);
    });

    // HOOK 1: Refresh scoreboard UI on load
    updateHighScoreDisplay();
}

function handleCardClick(clickedCard) {
    if (isProcessing || clickedCard.classList.contains('flipped') || clickedCard.classList.contains('matched') || timeLeft <= 0) {
        return;
    }

    if (!gameStarted) {
        gameStarted = true;
        startTimer();
    }

    clickedCard.classList.add('flipped');
    clickedCard.textContent = clickedCard.dataset.icon;
    
    flippedCards.push(clickedCard);

    if (flippedCards.length === 2) {
        updateMoves();
        checkForMatch();
    }
}

function checkForMatch() {
    const [cardOne, cardTwo] = flippedCards;

    if (cardOne.dataset.icon === cardTwo.dataset.icon) {
        score += BASE_MATCH_POINTS * combo;
        
        const scoreDisplay = document.getElementById('score');
        if (scoreDisplay) scoreDisplay.textContent = score;

        const timeReward = difficulties[activeDifficulty].reward;
        const maxStartingTime = difficulties[activeDifficulty].time;
        
        timeLeft += timeReward;
        if (timeLeft > maxStartingTime) {
            timeLeft = maxStartingTime;
        }
        
        const timerDisplay = document.getElementById('timer');
        if (timerDisplay) timerDisplay.textContent = timeLeft;

        cardOne.classList.replace('flipped', 'matched');
        cardTwo.classList.replace('flipped', 'matched');
        matchedPairsCount++;
        
        combo++;
        const comboDisplay = document.getElementById('combo');
        if (comboDisplay) {
            comboDisplay.textContent = combo;
            comboDisplay.classList.add('combo-active');
        }

        resetTurn();

        if (matchedPairsCount === currentIcons.length / 2) {
            stopTimer();
            
            const calculatedBonus = timeLeft * POINTS_PER_SECOND_BONUS;
            const absoluteTotal = score + calculatedBonus;

            // HOOK 2: Save the high score immediately upon match completion!
            checkAndSaveHighScore(absoluteTotal);

            setTimeout(() => {
                const baseScoreDisplay = document.getElementById('base-score');
                const bonusSecsDisplay = document.getElementById('bonus-secs');
                const timeBonusPointsDisplay = document.getElementById('time-bonus-pts');
                const finalScoreDisplay = document.getElementById('final-score');
                const finalMovesDisplay = document.getElementById('final-moves');
                const winOverlay = document.getElementById('win-overlay');

                if (baseScoreDisplay) baseScoreDisplay.textContent = score;
                if (bonusSecsDisplay) bonusSecsDisplay.textContent = timeLeft;
                if (timeBonusPointsDisplay) timeBonusPointsDisplay.textContent = `+${calculatedBonus}`;
                if (finalScoreDisplay) finalScoreDisplay.textContent = absoluteTotal;
                if (finalMovesDisplay) finalMovesDisplay.textContent = movesCount;
                if (winOverlay) winOverlay.classList.add('show');
            }, 400);
        }
    } else {
        combo = 1;
        const comboDisplay = document.getElementById('combo');
        if (comboDisplay) {
            comboDisplay.textContent = combo;
            comboDisplay.classList.remove('combo-active');
        }

        isProcessing = true;
        setTimeout(() => {
            cardOne.classList.remove('flipped');
            cardTwo.classList.remove('flipped');
            cardOne.textContent = "?";
            cardTwo.textContent = "?";
            resetTurn();
        }, 900);
    }
}

function resetTurn() {
    flippedCards = [];
    isProcessing = false;
}

function updateMoves() {
    movesCount++;
    const movesDisplay = document.getElementById('moves');
    if (movesDisplay) movesDisplay.textContent = movesCount;
}

function handleGameOver() {
    stopTimer();
    isProcessing = true;
    const loseOverlay = document.getElementById('lose-overlay');
    if (loseOverlay) loseOverlay.classList.add('show');
}

function restartGame() {
    stopTimer();
    
    flippedCards = [];
    matchedPairsCount = 0;
    movesCount = 0;
    score = 0;
    combo = 1;
    timeLeft = difficulties[activeDifficulty].time;
    gameStarted = false;
    isProcessing = false;

    const movesDisplay = document.getElementById('moves');
    const timerDisplay = document.getElementById('timer');
    const scoreDisplay = document.getElementById('score');
    const comboDisplay = document.getElementById('combo');
    const winOverlay = document.getElementById('win-overlay');
    const loseOverlay = document.getElementById('lose-overlay');
    const confirmOverlay = document.getElementById('confirm-overlay');

    if (movesDisplay) movesDisplay.textContent = movesCount;
    if (timerDisplay) {
        timerDisplay.textContent = timeLeft;
        timerDisplay.parentElement.classList.remove('time-warning');
    }
    if (scoreDisplay) scoreDisplay.textContent = score;
    if (comboDisplay) {
        comboDisplay.textContent = combo;
        comboDisplay.classList.remove('combo-active');
    }
    
    if (winOverlay) winOverlay.classList.remove('show');
    if (loseOverlay) loseOverlay.classList.remove('show');
    if (confirmOverlay) confirmOverlay.classList.remove('show');
    
    createGameBoard();
}

// --- FIXED LOCAL STORAGE HIGH SCORE ENGINE ---
function updateHighScoreDisplay() {
    const bestDiffName = document.getElementById('best-diff-name');
    const highScoreVal = document.getElementById('high-score-val');
    if (!bestDiffName || !highScoreVal) return;

    const key = `memory_high_${activeDifficulty}`;
    const storedBest = localStorage.getItem(key) || 0;
    
    bestDiffName.textContent = activeDifficulty.charAt(0).toUpperCase() + activeDifficulty.slice(1);
    highScoreVal.textContent = storedBest;
}

function checkAndSaveHighScore(finalScore) {
    const key = `memory_high_${activeDifficulty}`;
    const storedBest = parseInt(localStorage.getItem(key) || "0", 10);
    
    if (finalScore > storedBest) {
        localStorage.setItem(key, finalScore);
        const indicator = document.getElementById('new-high-indicator');
        if (indicator) indicator.style.display = 'block';
        updateHighScoreDisplay();
    } else {
        const indicator = document.getElementById('new-high-indicator');
        if (indicator) indicator.style.display = 'none';
    }
}

// --- SEPARATE INITIALIZATION LISTENERS ---
document.addEventListener('DOMContentLoaded', () => {
    const restartButton = document.getElementById('restart-btn');
    const playAgainButton = document.getElementById('play-again-btn');
    const tryAgainButton = document.getElementById('try-again-btn');
    const confirmYesButton = document.getElementById('confirm-yes-btn');
    const confirmNoButton = document.getElementById('confirm-no-btn');
    const difficultyButtons = document.querySelectorAll('.diff-btn');

    // Link Core Buttons
    if (restartButton) restartButton.addEventListener('click', restartGame);
    if (playAgainButton) playAgainButton.addEventListener('click', restartGame);
    if (tryAgainButton) tryAgainButton.addEventListener('click', restartGame);

    // Difficulty Button Swapping
    difficultyButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const selectedDiff = e.target.dataset.diff;
            if (selectedDiff === activeDifficulty) return;

            if (gameStarted) {
                pendingDifficulty = selectedDiff;
                const confirmOverlay = document.getElementById('confirm-overlay');
                if (confirmOverlay) confirmOverlay.classList.add('show');
            } else {
                switchDifficulty(selectedDiff);
            }
        });
    });

    if (confirmYesButton) {
        confirmYesButton.addEventListener('click', () => {
            if (pendingDifficulty) {
                switchDifficulty(pendingDifficulty);
                pendingDifficulty = null;
                const confirmOverlay = document.getElementById('confirm-overlay');
                if (confirmOverlay) confirmOverlay.classList.remove('show');
            }
        });
    }

    if (confirmNoButton) {
        confirmNoButton.addEventListener('click', () => {
            const confirmOverlay = document.getElementById('confirm-overlay');
            if (confirmOverlay) confirmOverlay.classList.remove('show');
            pendingDifficulty = null;
        });
    }

    // Secondary helper function for layout changes
    function switchDifficulty(newDifficulty) {
        difficultyButtons.forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.diff === newDifficulty) btn.classList.add('active');
        });
        activeDifficulty = newDifficulty;
        restartGame();
    }

    // Force the game board to load on startup
    createGameBoard();
});

// --- NATIVE AUDIO CUES SYNTHESIZER ---
let gameAudioCtx = null;

// Starts the browser audio pipeline safely on user interaction
function initGameAudio() {
    if (!gameAudioCtx) {
        gameAudioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
}

function playSoundAlert(type) {
    initGameAudio();
    if (!gameAudioCtx) return;

    const now = gameAudioCtx.currentTime;
    const soundGain = gameAudioCtx.createGain();
    soundGain.gain.setValueAtTime(0.12, now); // Sets a comfortable, subtle volume limit
    soundGain.connect(gameAudioCtx.destination);

    const soundOsc = gameAudioCtx.createOscillator();

    if (type === 'click') {
        // Card Flip: Light, subtle percussive pop
        soundOsc.type = 'triangle';
        soundOsc.frequency.setValueAtTime(400, now);
        soundOsc.frequency.exponentialRampToValueAtTime(150, now + 0.05);
        soundGain.gain.linearRampToValueAtTime(0, now + 0.05);
        soundOsc.connect(soundGain);
        soundOsc.start(now);
        soundOsc.stop(now + 0.05);
    } 
    else if (type === 'match') {
        // Successful Match: Bright, short rising chord interval
        soundOsc.type = 'sine';
        soundOsc.frequency.setValueAtTime(523.25, now); // C5 note
        soundOsc.frequency.setValueAtTime(659.25, now + 0.08); // E5 note
        soundGain.gain.linearRampToValueAtTime(0, now + 0.2);
        soundOsc.connect(soundGain);
        soundOsc.start(now);
        soundOsc.stop(now + 0.2);
    } 
    else if (type === 'victory') {
        // Victory Fanfare: High triumphant rolling chimes
        [0, 0.08, 0.16].forEach((delay, idx) => {
            const vOsc = gameAudioCtx.createOscillator();
            vOsc.type = 'triangle';
            const freqs = [523.25, 659.25, 783.99]; // C-E-G notes
            vOsc.frequency.setValueAtTime(freqs[idx], now + delay);
            soundGain.gain.setValueAtTime(0.1, now + delay);
            soundGain.gain.linearRampToValueAtTime(0, now + delay + 0.25);
            vOsc.connect(soundGain);
            vOsc.start(now + delay);
            vOsc.stop(now + delay + 0.25);
        });
    } 
    else if (type === 'gameover') {
        // Game Over: A deep, descending fail buzzer
        soundOsc.type = 'sawtooth';
        soundOsc.frequency.setValueAtTime(180, now);
        soundOsc.frequency.linearRampToValueAtTime(90, now + 0.4);
        soundGain.gain.linearRampToValueAtTime(0, now + 0.4);
        soundOsc.connect(soundGain);
        soundOsc.start(now);
        soundOsc.stop(now + 0.4);
    }
}

// --- SCORE AND UTILITY BINDINGS ---
document.addEventListener('DOMContentLoaded', () => {
    const clearScoresButton = document.getElementById('clear-scores-btn');
    
    if (clearScoresButton) {
        clearScoresButton.addEventListener('click', () => {
            if (confirm("Are you sure you want to permanently delete your high score records for ALL difficulties?")) {
                localStorage.removeItem('memory_high_easy');
                localStorage.removeItem('memory_high_medium');
                localStorage.removeItem('memory_high_hard');
                updateHighScoreDisplay(); // Instantly rewrites display readout counters to 0
            }
        });
    }
});