import { wordBank } from './wordbank.js';

let chosenWord = "";
let lives = 6;
let guessedLetters = [];
let timerInterval;
let timeLeft = 60;

function getRandomWord() {
  const categories = Object.keys(wordBank);
  const category = categories[Math.floor(Math.random() * categories.length)];
  const items = wordBank[category];
  const item = items[Math.floor(Math.random() * items.length)];

  document.getElementById("category-name").textContent = category;

  if (typeof item === "object" && item.word && item.hint) {
    document.getElementById("hint-text").textContent = item.hint;
    return item.word;
  } else {
    document.getElementById("hint-text").textContent = "—";
    return item;
  }
}

function updateLivesDisplay() {
  const hearts = "❤️".repeat(lives); // Show only remaining hearts
  document.getElementById("lives").textContent = hearts;
}

function displayWord() {
  const wordContainer = document.getElementById("word");
  wordContainer.innerHTML = "";

  chosenWord.split("").forEach((letter) => {
    const span = document.createElement("span");
    if (guessedLetters.includes(letter)) {
      span.textContent = letter;
      span.classList.add("found-letter", "fade-in");
    } else {
      span.textContent = "_";
    }
    wordContainer.appendChild(span);
  });
}

function createKeyboard() {
  const keyboard = document.getElementById("keyboard");
  keyboard.innerHTML = "";
  for (let i = 65; i <= 90; i++) {
    const letter = String.fromCharCode(i).toLowerCase();
    const btn = document.createElement("button");
    btn.textContent = letter;
    btn.onclick = () => handleGuess(letter, btn);
    keyboard.appendChild(btn);
  }
}

function handleGuess(letter, button) {
  button.disabled = true;
  guessedLetters.push(letter);

  if (!chosenWord.includes(letter)) {
    lives--;
    updateLivesDisplay();
  }

  displayWord();
  checkGameStatus();
}

function checkGameStatus() {
  const current = chosenWord
    .split("")
    .map((letter) => (guessedLetters.includes(letter) ? letter : "_"))
    .join("");

  if (current === chosenWord) {
    document.getElementById("message").textContent = "🎉 You Won!";
    clearInterval(timerInterval);
    disableAllButtons();
    document.getElementById("restart-container").style.display = "block";
  } else if (lives === 0) {
    document.getElementById("message").textContent = `💀 You Lost! Word was: ${chosenWord}`;
    clearInterval(timerInterval);
    disableAllButtons();
    document.getElementById("restart-container").style.display = "block";
  }
}

function disableAllButtons() {
  const buttons = document.querySelectorAll("#keyboard button");
  buttons.forEach((btn) => (btn.disabled = true));
}

function startTimer() {
  timeLeft = 60;
  document.getElementById("time").textContent = timeLeft;
  timerInterval = setInterval(() => {
    timeLeft--;
    document.getElementById("time").textContent = timeLeft;
    if (timeLeft === 0) {
      clearInterval(timerInterval);
      document.getElementById("message").textContent = `⏰ Time's up! Word was: ${chosenWord}`;
      disableAllButtons();
      document.getElementById("restart-container").style.display = "block";
    }
  }, 1000);
}

export function startGame() {
  lives = 6;
  guessedLetters = [];
  chosenWord = getRandomWord().toLowerCase();
  document.getElementById("message").textContent = "";
  displayWord();
  createKeyboard();
  clearInterval(timerInterval);
  startTimer();
  updateLivesDisplay();

  // Hide restart button on new game
  document.getElementById("restart-container").style.display = "none";
}

window.startGame = startGame;
startGame();
