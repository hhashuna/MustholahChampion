// script.js

const TOTAL_LEVELS = 5;
const QUESTIONS_PER_LEVEL = 20;
const TOTAL_QUESTIONS = TOTAL_LEVELS * QUESTIONS_PER_LEVEL;
const ADMIN_PASSWORD = "admin123";

let currentLevel = 1;
let totalScore = 0;
let timer;
let totalTime = 60;
let timeLeft;
let playerAnswers = {};
let correctAnswers = {};

function startTimer() {
  timeLeft = totalTime;
  document.getElementById("time-left").textContent = timeLeft;
  clearInterval(timer);
  timer = setInterval(() => {
    timeLeft--;
    document.getElementById("time-left").textContent = timeLeft;
    if (timeLeft <= 0) {
      clearInterval(timer);
      alert("Waktu habis!");
      finishGame();
    }
  }, 1000);
}

function loadLevel(level) {
  const container = document.getElementById("input-columns");
  container.innerHTML = "";
  const startIdx = (level - 1) * QUESTIONS_PER_LEVEL + 1;
  const endIdx = level * QUESTIONS_PER_LEVEL;

  const left = document.createElement("div");
  left.className = "column";
  const right = document.createElement("div");
  right.className = "column";

  for (let i = startIdx; i <= endIdx; i++) {
    const inputGroup = document.createElement("div");
    inputGroup.className = "input-group";
    inputGroup.innerHTML = `
      <span class="input-number">${i}</span>
      <input type="text" id="input-${i}" value="${playerAnswers[i] || ""}" class="answer-input">
    `;
    if ((i - startIdx) < QUESTIONS_PER_LEVEL / 2) {
      left.appendChild(inputGroup);
    } else {
      right.appendChild(inputGroup);
    }
  }
  container.appendChild(left);
  container.appendChild(right);
  document.getElementById("current-level").textContent = level;
  if (level === TOTAL_LEVELS) {
    document.getElementById("finish-button").classList.remove("hidden");
  } else {
    document.getElementById("finish-button").classList.add("hidden");
  }
}

function submitAnswers() {
  const startIdx = (currentLevel - 1) * QUESTIONS_PER_LEVEL + 1;
  const endIdx = currentLevel * QUESTIONS_PER_LEVEL;
  let score = 0;

  for (let i = startIdx; i <= endIdx; i++) {
    const input = document.getElementById(`input-${i}`);
    const answer = input.value.trim().toLowerCase();
    playerAnswers[i] = answer;

    // Reset style
    input.classList.remove("correct", "incorrect");

    if (correctAnswers[i] && answer === correctAnswers[i].toLowerCase()) {
      score++;
      input.classList.add("correct");
    } else {
      input.classList.add("incorrect");
    }
  }

  totalScore += score;
  document.getElementById("total-score").textContent = totalScore;
  alert(`Level ${currentLevel} selesai! Skor benar: ${score}`);
}

function nextLevel() {
  if (currentLevel < TOTAL_LEVELS) {
    currentLevel++;
    loadLevel(currentLevel);
  }
}

function prevLevel() {
  if (currentLevel > 1) {
    currentLevel--;
    loadLevel(currentLevel);
  }
}

function finishGame() {
  submitAnswers();
  clearInterval(timer);
  alert(`Permainan selesai! Skor akhir Anda: ${totalScore}`);
  const name = document.getElementById("playerName").value.trim();
  if (name) {
    const entry = `${name} - ${totalScore}`;
    const board = JSON.parse(localStorage.getItem("leaderboard") || "[]");
    board.push(entry);
    board.sort((a, b) => parseInt(b.split(" - ")[1]) - parseInt(a.split(" - ")[1]));
    localStorage.setItem("leaderboard", JSON.stringify(board));
    updateLeaderboard();
  }
}

function updateLeaderboard() {
  const list = document.getElementById("leaderboard-list");
  list.innerHTML = "";
  const board = JSON.parse(localStorage.getItem("leaderboard") || "[]");
  board.slice(0, 10).forEach(entry => {
    const li = document.createElement("li");
    li.textContent = entry;
    list.appendChild(li);
  });
}

function loginAdmin() {
  const inputPassword = document.getElementById("adminPassword").value;
  if (inputPassword === ADMIN_PASSWORD) {
    document.getElementById("admin-panel").style.display = "block";
    document.getElementById("admin-login").style.display = "none";
    loadAnswerInputs();
  } else {
    alert("Password salah!");
  }
}

function logoutAdmin() {
  document.getElementById("admin-panel").style.display = "none";
  document.getElementById("admin-login").style.display = "block";
  document.getElementById("adminPassword").value = "";
}

let adminLevel = 1;

function loadAnswerInputs() {
  const container = document.getElementById("answer-inputs");
  container.innerHTML = "";
  const startIdx = (adminLevel - 1) * QUESTIONS_PER_LEVEL + 1;
  const endIdx = adminLevel * QUESTIONS_PER_LEVEL;

  for (let i = startIdx; i <= endIdx; i++) {
    const div = document.createElement("div");
    div.className = "input-group";
    div.innerHTML = `
      <span class="input-number">${i}</span>
      <input type="text" id="answer-${i}" value="${correctAnswers[i] || ""}">
    `;
    container.appendChild(div);
  }
  document.getElementById("admin-level").textContent = adminLevel;
}

function saveAnswers() {
  const startIdx = (adminLevel - 1) * QUESTIONS_PER_LEVEL + 1;
  const endIdx = adminLevel * QUESTIONS_PER_LEVEL;
  for (let i = startIdx; i <= endIdx; i++) {
    const val = document.getElementById(`answer-${i}`).value.trim();
    if (val) correctAnswers[i] = val;
  }
  alert("Jawaban disimpan.");
}

function nextAdminLevel() {
  if (adminLevel < TOTAL_LEVELS) {
    adminLevel++;
    loadAnswerInputs();
  }
}

function prevAdminLevel() {
  if (adminLevel > 1) {
    adminLevel--;
    loadAnswerInputs();
  }
}

window.onload = () => {
  updateLeaderboard();
  loadLevel(currentLevel);
  startTimer();

  document.getElementById("timeSetting").addEventListener("change", (e) => {
    totalTime = parseInt(e.target.value);
    startTimer();
  });
};
