let decks = JSON.parse(localStorage.getItem('decks')) || {};
let selectedDeck = '';
let testFlashcards = [];
let quizFlashcards = [];
let currentTestIndex = 0;
let currentQuizIndex = 0;
let score = 0;
let timerInterval;
let secondsElapsed = 0;

// Render deck options and flashcards
function renderDecks() {
    const deckSelector = document.getElementById('deckSelector');
    deckSelector.innerHTML = '<option value="">Select a Deck</option>';
    for (let deckName in decks) {
        const option = document.createElement('option');
        option.value = deckName;
        option.textContent = deckName;
        deckSelector.appendChild(option);
    }
}

function renderFlashcards() {
    const container = document.getElementById('flashcards-container');
    container.innerHTML = '';
    if (selectedDeck && decks[selectedDeck]) {
        decks[selectedDeck].forEach(card => {
            const cardDiv = document.createElement('div');
            cardDiv.classList.add('card');
            cardDiv.innerHTML = `<p>Q: ${card.question}</p>`;
            container.appendChild(cardDiv);
        });
    }
}

// Add a new deck
function addDeck() {
    const deckName = document.getElementById('deck-name').value.trim();
    if (deckName && !decks[deckName]) {
        decks[deckName] = [];
        localStorage.setItem('decks', JSON.stringify(decks));
        renderDecks();
        document.getElementById('deck-name').value = '';
    } else {
        alert('Deck name is required or already exists.');
    }
}

// Select a deck
function selectDeck() {
    selectedDeck = document.getElementById('deckSelector').value;
    renderFlashcards();
}

// Add a new flashcard to selected deck
function addFlashcard() {
    const question = document.getElementById('question').value.trim();
    const answer = document.getElementById('answer').value.trim();

    if (question && answer && selectedDeck) {
        decks[selectedDeck].push({ question, answer });
        localStorage.setItem('decks', JSON.stringify(decks));
        renderFlashcards();
        document.getElementById('question').value = '';
        document.getElementById('answer').value = '';
    } else {
        alert('Please enter both a question and answer, and select a deck.');
    }
}

// Open tab functionality
function openTab(tabId) {
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.add('hidden'));
    document.getElementById(tabId).classList.remove('hidden');
}

// Test Mode Functions
function startTest() {
    if (!selectedDeck || decks[selectedDeck].length === 0) {
        alert('Please select a deck with flashcards to start the test.');
        return;
    }

    testFlashcards = [...decks[selectedDeck]];
    currentTestIndex = 0;
    score = 0;
    secondsElapsed = 0;
    document.getElementById('test-section').classList.remove('hidden');
    document.getElementById('final-score').classList.add('hidden');
    document.getElementById('test-result').textContent = '';
    document.getElementById('test-answer').value = '';

    startTimer();
    showTestQuestion();
}

function startTimer() {
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        secondsElapsed++;
        document.getElementById('test-timer').textContent = `Time: ${secondsElapsed}s`;
    }, 1000);
}

function showTestQuestion() {
    if (currentTestIndex < testFlashcards.length) {
        document.getElementById('test-question').textContent = testFlashcards[currentTestIndex].question;
    } else {
        endTest();
    }
}

function submitAnswer() {
    const userAnswer = document.getElementById('test-answer').value.trim();
    if (userAnswer.toLowerCase() === testFlashcards[currentTestIndex].answer.toLowerCase()) {
        score++;
    }
    currentTestIndex++;
    document.getElementById('test-answer').value = '';
    showTestQuestion();
}

function endTest() {
    clearInterval(timerInterval);
    document.getElementById('test-section').classList.add('hidden');
    document.getElementById('final-score').classList.remove('hidden');
    document.getElementById('final-score').textContent = `Final Score: ${score}/${testFlashcards.length} in ${secondsElapsed} seconds`;
}

// Quiz Mode Functions
function startQuiz() {
    if (!selectedDeck || decks[selectedDeck].length === 0) {
        alert('Please select a deck with flashcards to start the quiz.');
        return;
    }

    quizFlashcards = [...decks[selectedDeck]];
    currentQuizIndex = 0;
    document.getElementById('quiz-section').classList.remove('hidden');
    document.getElementById('quiz-result').textContent = '';
    document.getElementById('quiz-answer').value = '';
    document.getElementById('quiz-hint').classList.add('hidden');

    showQuizQuestion();
}

function showQuizQuestion() {
    if (currentQuizIndex < quizFlashcards.length) {
        document.getElementById('quiz-question').textContent = quizFlashcards[currentQuizIndex].question;
    } else {
        alert('Quiz complete! Great job.');
        document.getElementById('quiz-section').classList.add('hidden');
    }
}

function submitQuizAnswer() {
    const userAnswer = document.getElementById('quiz-answer').value.trim();
    if (userAnswer.toLowerCase() === quizFlashcards[currentQuizIndex].answer.toLowerCase()) {
        document.getElementById('quiz-result').textContent = 'Correct!';
        currentQuizIndex++;
    } else {
        document.getElementById('quiz-result').textContent = 'Try again!';
    }
    document.getElementById('quiz-answer').value = '';
    showQuizQuestion();
}

function showHint() {
    if (currentQuizIndex < quizFlashcards.length) {
        const answer = quizFlashcards[currentQuizIndex].answer;
        document.getElementById('quiz-hint').textContent = `Hint: ${answer[0]}...`;
        document.getElementById('quiz-hint').classList.remove('hidden');
    }
}

document.addEventListener('DOMContentLoaded', () => renderDecks());
