import { wordBank } from './wordbank.js';

// 🎵 Load Sound Effects
const winSound = new Audio('./sounds/win.mp3');
const loseSound = new Audio('./sounds/lose.mp3');
const correctSound = new Audio('./sounds/correct.mp3');
const wrongSound = new Audio('./sounds/wrong.mp3');

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

  return typeof item === "object" && item.word ? item.word : item;
}

function displayWord() {
  const wordContainer = document.getElementById("word");
  wordContainer.innerHTML = "";

  chosenWord.split("").forEach((letter) => {
    const span = document.createElement("span");
    span.textContent = guessedLetters.includes(letter) ? letter : "_";
    if (guessedLetters.includes(letter)) span.classList.add("fade-in");
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
    document.getElementById("lives").textContent = lives;
    wrongSound.play(); // ❌ Wrong guess
  } else {
    correctSound.play(); // ✅ Correct guess
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
    winSound.play(); // 🎉 Win sound
    disableAllButtons();
    document.getElementById("restart-btn").style.display = "inline-block";
  } else if (lives === 0) {
    document.getElementById("message").textContent = `💀 You Lost! Word was: ${chosenWord}`;
    clearInterval(timerInterval);
    loseSound.play(); // 💀 Lose sound
    disableAllButtons();
    document.getElementById("restart-btn").style.display = "inline-block";
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
      loseSound.play(); // 🕒 Lose by time
      disableAllButtons();
      document.getElementById("restart-btn").style.display = "inline-block";
    }
  }, 1000);
}

export function startGame() {
  lives = 5;
  guessedLetters = [];
  chosenWord = getRandomWord().toLowerCase();

  const revealCount =
    chosenWord.length < 8 ? 1 :
    chosenWord.length <= 12 ? 2 : 3;

  const revealedIndices = new Set();

  while (revealedIndices.size < revealCount) {
    const randomIndex = Math.floor(Math.random() * chosenWord.length);
    revealedIndices.add(randomIndex);
  }

  revealedIndices.forEach((i) => {
    guessedLetters.push(chosenWord[i]);
  });

  document.getElementById("lives").textContent = lives;
  document.getElementById("message").textContent = "";
  document.getElementById("restart-btn").style.display = "none";
  displayWord();
  createKeyboard();
  clearInterval(timerInterval);
  startTimer();
}

window.startGame = startGame;
startGame();

document.addEventListener("keydown", (e) => {
  const key = e.key.toLowerCase();
  if (/^[a-z]$/.test(key)) {
    const buttons = document.querySelectorAll("#keyboard button");
    for (const btn of buttons) {
      if (btn.textContent === key && !btn.disabled) {
        btn.click(); 
        break;
      }
    }
  }
});
