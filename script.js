let players = [];
let scores = [];
let totalRounds = 0;
let currentRound = 1;
let timer;
let minutes = 0;
let seconds = 0;
let availableLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
let usedLetters = [];

function startSetup() {
  const count = document.getElementById('playerCount').value;
  const rounds = document.getElementById('roundCount').value;
  if (count > 0 && rounds > 0) {
    document.getElementById('setup').classList.add('hidden');
    document.getElementById('players').classList.remove('hidden');
    const container = document.getElementById('playerNames');
    container.innerHTML = '';
    for (let i = 0; i < count; i++) {
      container.innerHTML += `<input id="player${i}" placeholder="Jugador ${i + 1}"><br>`;
    }
    totalRounds = parseInt(rounds);
  }
}

function startGame() {
  players = [];
  scores = [];
  const container = document.getElementById('playerNames');
  const inputs = container.getElementsByTagName('input');
  for (let input of inputs) {
    players.push(input.value);
    scores.push(0);
  }
  document.getElementById('players').classList.add('hidden');
  document.getElementById('game').classList.remove('hidden');
  document.getElementById('currentRound').textContent = currentRound;
  document.getElementById('totalRounds').textContent = totalRounds;
}

function startTimer() {
  minutes = parseInt(document.getElementById('minutesInput').value);
  seconds = 0;
  document.getElementById('timer').textContent = `${minutes}:00`;
  timer = setInterval(() => {
    if (seconds === 0 && minutes === 0) {
      clearInterval(timer);
      alert('Tiempo terminado!');
      askScores();
    } else {
      if (seconds === 0) {
        minutes--;
        seconds = 59;
      } else {
        seconds--;
      }
      document.getElementById('timer').textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    }
  }, 1000);
}

function stopTimer() {
  clearInterval(timer);
}

function finishRound() {
  clearInterval(timer);
  askScores();
}

function resetGame() {
  location.reload();
}

function generateLetter() {
  if (availableLetters.length === 0) {
    alert('Ya salieron todas las letras!');
    return;
  }
  const index = Math.floor(Math.random() * availableLetters.length);
  const letter = availableLetters.splice(index, 1)[0];
  usedLetters.push(letter);
  document.getElementById('letter').textContent = letter;
  document.getElementById('usedLetters').textContent = 'Letras usadas: ' + usedLetters.join(', ');
}

function askScores() {
  document.getElementById('score').classList.remove('hidden');
  const container = document.getElementById('scoreInputs');
  container.innerHTML = '';
  players.forEach((p, i) => {
    container.innerHTML += `<label>${p}:</label><input type="number" id="score${i}" value="0"><br>`;
  });
}

function saveScores() {
  players.forEach((p, i) => {
    const value = parseInt(document.getElementById(`score${i}`).value);
    scores[i] += value;
  });
  document.getElementById('score').classList.add('hidden');

  if (currentRound >= totalRounds) {
    showWinner();
  } else {
    currentRound++;
    document.getElementById('currentRound').textContent = currentRound;
  }
}

function showWinner() {
  document.getElementById('game').classList.add('hidden');
  document.getElementById('winner').classList.remove('hidden');
  const maxScore = Math.max(...scores);
  const winnerIndex = scores.indexOf(maxScore);
  document.getElementById('winnerName').textContent = players[winnerIndex];

  const table = document.getElementById('finalScores');
  table.innerHTML = '<tr><th>Jugador</th><th>Puntaje</th></tr>';
  players.forEach((p, i) => {
    table.innerHTML += `<tr><td>${p}</td><td>${scores[i]}</td></tr>`;
  });

  startConfetti();
}

function startConfetti() {
  const canvas = document.getElementById('confetti');
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  const pieces = [];
  for (let i = 0; i < 100; i++) {
    pieces.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height - canvas.height,
      size: Math.random() * 5 + 5,
      color: `hsl(${Math.random() * 360}, 70%, 60%)`,
      speed: Math.random() * 5 + 2
    });
  }
  function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    pieces.forEach(p => {
      p.y += p.speed;
      if (p.y > canvas.height) p.y = -10;
      ctx.fillStyle = p.color;
      ctx.fillRect(p.x, p.y, p.size, p.size);
    });
    requestAnimationFrame(update);
  }
  update();
}