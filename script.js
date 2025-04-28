let players = []; // Lista de nombres de jugadores
let scores = []; // Puntajes de los jugadores
let totalRounds = 0; // Número total de rondas
let currentRound = 1; // Ronda actual
let timer; // Variable para almacenar el temporizador
let minutes = 0; // Minutos para el temporizador
let seconds = 0; // Segundos para el temporizador
let availableLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split(''); // Letras disponibles para sortear
let usedLetters = []; // Letras que ya salieron

function startSetup() {
  const count = document.getElementById('playerCount').value; // Obtiene la cantidad de jugadores
  const rounds = document.getElementById('roundCount').value; // Obtiene la cantidad de rondas
  if (count > 0 && rounds > 0) { // Verifica que ambos valores sean válidos
    document.getElementById('setup').classList.add('hidden'); // Oculta la sección de configuración
    document.getElementById('players').classList.remove('hidden'); // Muestra la sección para ingresar nombres
    const container = document.getElementById('playerNames');
    container.innerHTML = ''; // Limpia cualquier contenido anterior
    for (let i = 0; i < count; i++) { // Crea un input para cada jugador
      container.innerHTML += `<input id="player${i}" placeholder="Jugador ${i + 1}"><br>`;
    }
    totalRounds = parseInt(rounds); // Guarda la cantidad total de rondas
  }
}

function startGame() {
  players = [];
  scores = [];
  const container = document.getElementById('playerNames');
  const inputs = container.getElementsByTagName('input');
  for (let input of inputs) { // Guarda los nombres de los jugadores y los inicializa en 0 puntos
    players.push(input.value);
    scores.push(0);
  }
  document.getElementById('players').classList.add('hidden'); // Oculta sección de nombres
  document.getElementById('game').classList.remove('hidden'); // Muestra la sección del juego
  document.getElementById('currentRound').textContent = currentRound; // Muestra la ronda actual
  document.getElementById('totalRounds').textContent = totalRounds; // Muestra total de rondas
}

function startTimer() {
  minutes = parseInt(document.getElementById('minutesInput').value); // Obtiene los minutos desde el input
  seconds = 0; // Comienza en 0 segundos
  document.getElementById('timer').textContent = `${minutes}:00`; // Muestra el tiempo inicial
  timer = setInterval(() => { // Inicia el temporizador que se actualiza cada segundo
    if (seconds === 0 && minutes === 0) { // Si llega a 0:00
      clearInterval(timer);
      alert('¡Tiempo terminado!');
      askScores();
    } else {
      if (seconds === 0) { // Si no hay segundos, baja un minuto y reinicia segundos a 59
        minutes--;
        seconds = 59;
      } else {
        seconds--;
      }
      document.getElementById('timer').textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`; // Actualiza la visualización del cronómetro
    }
  }, 1000);
}

function stopTimer() {
  clearInterval(timer); // Detiene el temporizador
}

function finishRound() {
  clearInterval(timer); // Detiene el temporizador
  askScores(); // Pide ingresar los puntajes
}

function resetGame() {
  location.reload(); // Recarga la página para reiniciar el juego
}

function generateLetter() {
  if (availableLetters.length === 0) { // Si ya salieron todas las letras
    alert('¡Ya salieron todas las letras!');
    return;
  }
  const index = Math.floor(Math.random() * availableLetters.length); // Elige una letra aleatoria
  const letter = availableLetters.splice(index, 1)[0]; // La elimina del array de disponibles y la guarda
  usedLetters.push(letter); // Agrega la letra al listado de usadas
  document.getElementById('letter').textContent = letter; // Muestra la letra sorteada
  document.getElementById('usedLetters').textContent = 'Letras usadas: ' + usedLetters.join(', '); // Muestra todas las letras que ya salieron
}

function askScores() {
  document.getElementById('score').classList.remove('hidden'); // Muestra sección para cargar puntajes
  const container = document.getElementById('scoreInputs');
  container.innerHTML = ''; // Limpia inputs anteriores
  players.forEach((p, i) => { // Crea un input numérico para cada jugador
    container.innerHTML += `<label>${p}:</label><input type="number" id="score${i}" value="0"><br>`;
  });
}

function saveScores() {
  players.forEach((p, i) => { // Actualiza el puntaje de cada jugador sumando el nuevo valor
    const value = parseInt(document.getElementById(`score${i}`).value);
    scores[i] += value;
  });
  document.getElementById('score').classList.add('hidden'); // Oculta sección de cargar puntajes

  if (currentRound >= totalRounds) { // Si se jugaron todas las rondas
    showWinner(); // Muestra el ganador
  } else {
    currentRound++; // Pasa a la siguiente ronda
    document.getElementById('currentRound').textContent = currentRound; // Actualiza el número de ronda en pantalla
  }
}

function showWinner() {
  document.getElementById('game').classList.add('hidden'); // Oculta la sección de juego
  document.getElementById('winner').classList.remove('hidden'); // Muestra la sección de ganador
  const maxScore = Math.max(...scores); // Encuentra el puntaje más alto
  const winnerIndex = scores.indexOf(maxScore); // Busca el índice del jugador ganador
  document.getElementById('winnerName').textContent = players[winnerIndex]; // Muestra el nombre del ganador

  const table = document.getElementById('finalScores'); // Tabla de resultados finales
  table.innerHTML = '<tr><th>Jugador</th><th>Puntaje</th></tr>'; // Encabezados de la tabla
  players.forEach((p, i) => { // Llena la tabla con cada jugador y su puntaje
    table.innerHTML += `<tr><td>${p}</td><td>${scores[i]}</td></tr>`;
  });

  startConfetti(); // Lanza el confetti para festejar
}

function startConfetti() {
  const canvas = document.getElementById('confetti'); // Obtiene el canvas
  const ctx = canvas.getContext('2d'); // Contexto para dibujar
  canvas.width = window.innerWidth; // Ajusta el ancho al de la ventana
  canvas.height = window.innerHeight; // Ajusta el alto al de la ventana
  const pieces = []; // Array para guardar los trozos de confetti
  for (let i = 0; i < 100; i++) { // Genera 100 piezas de confetti
    pieces.push({
      x: Math.random() * canvas.width, // Posición horizontal aleatoria
      y: Math.random() * canvas.height - canvas.height, // Comienza por encima de la pantalla
      size: Math.random() * 5 + 5, // Tamaño aleatorio entre 5 y 10
      color: `hsl(${Math.random() * 360}, 70%, 60%)`, // Color aleatorio
      speed: Math.random() * 5 + 2 // Velocidad aleatoria
    });
  }
  function update() { // Función para actualizar el movimiento del confetti
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Limpia el canvas
    pieces.forEach(p => {
      p.y += p.speed; // Mueve la pieza hacia abajo
      if (p.y > canvas.height) p.y = -10; // Si sale de la pantalla, la reinicia arriba
      ctx.fillStyle = p.color; // Establece el color
      ctx.fillRect(p.x, p.y, p.size, p.size); // Dibuja la pieza
    });
    requestAnimationFrame(update); // Vuelve a llamar a update en el próximo frame
  }
  update(); // Inicia la animación
}