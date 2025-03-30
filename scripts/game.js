let questions = [];
let question;
let timer;
let score = 0;
let streak = 0;
let lives = 3;
let time = 20;
let difficulty = sessionStorage.getItem("difficulty") || "Fácil";
const categories = ["Historia de la Iglesia", "Doctrina", "Santos", "Biblia"];
let currentCategory = categories[3];
let progress = {
    "Historia de la Iglesia": 0,
    "Doctrina": 0,
    "Santos": 0,
    "Biblia": 0,
    "FinalBoss": false
};  

function prepareGame() {
    loadQuestions();
    addUIEvents();
}

function addUIEvents() {
    let bgMusic = new Audio("assets/sounds/gameMusic.m4a");
    window.bgMusic = bgMusic;
    window.bgMusic.volume = 0;
    window.bgMusic.play();
    let fadeInInterval = setInterval(() => {
        if (bgMusic.volume < 0.6) {
            bgMusic.volume = Math.min(bgMusic.volume + 0.05, 0.6);
        } else {
            clearInterval(fadeInInterval); 
        }
    }, 600);
    
}

async function loadQuestions() {
    try {
        const response = await fetch("scripts/questions.json");
        questions = await response.json();
        startGame();
    } catch (error) {
        console.error('Error al cargar el archivo JSON:', error);
    }
}

function startGame() {
    nextQuestion();
    startTimer();
    restartColors();
}

function restartColors() {
    for (let index = 0; index < 4; index++) {
        document.getElementById("answer-" + index).style.backgroundColor = "#ffd900";
    }
}

function nextQuestion() {
    currentCategory = randomCategory();
    question = randomQuestion(currentCategory, difficulty);
    document.getElementById("category").innerText = currentCategory;
    document.getElementById("question").innerText = question["pregunta"];
    document.getElementById("answer-0").innerText = question["respuestas"][0];
    document.getElementById("answer-1").innerText = question["respuestas"][1];
    document.getElementById("answer-2").innerText = question["respuestas"][2];
    document.getElementById("answer-3").innerText = question["respuestas"][3];
}

function randomQuestion(currentCategory, difficulty) {
    let questionList = questions[currentCategory][difficulty];
    if (questionList.length === 0) {
        document.getElementById("question").innerText = "Haz alcanzado la Sabiduría (no hay más preguntas)";
        gameOver();
    }
    return questionList.splice(Math.floor(Math.random() * questionList.length), 1)[0];
}

function randomCategory() {
    let availableCategories = categories.filter(cat => progress[cat] < 3);
    if (availableCategories.length === 0) return categories[Math.floor(Math.random() * 4)];
    return availableCategories[Math.floor(Math.random() * availableCategories.length)];
}

function startTimer() {
    if (timer) clearInterval(timer);
    time = 21;
    timer = setInterval(() => {
        if (time > 0) {
            time--;
            document.getElementById("time").innerText = `⏳ ${time}s`;
        } else {
            document.getElementById("game-over-sound").play();
            document.getElementById("question").innerText = "TE QUEDASTE SIN TIEMPO!";
            gameOver();
        }
    }, 1000);
}

function checkAnswer(selectedAnswer) {
    let answer = question["correcta"];
    console.log(answer);
    document.getElementById("answer-" + answer).classList.add("correct");
    if (selectedAnswer === answer) {
        document.getElementById("correct-sound").play();
        streak++;
        let multiplier = streak >= 3 ? 2 : 1;
        score += 100 * multiplier;
        document.getElementById("answer-" + answer).style.backgroundColor = "greenyellow";
        document.getElementById("question").innerText = "CORRECTO!";
        if (currentCategory === "Final Boss") {
            progress["FinalBoss"] = true;
        } else {
            progress[currentCategory]++;
        }
        
    } else {
        document.getElementById("incorrect-sound").play();
        lives--;
        score = Math.max(0, score - 100);   
        streak = 0;
        document.getElementById("answer-" + selectedAnswer).style.backgroundColor = "red";
        document.getElementById("answer-" + answer).style.backgroundColor = "greenyellow";
        document.getElementById("question").innerText = "INCORRECTO!";
    }
    setTimeout(() => {
        document.getElementById("answer-" + answer).classList.remove("correct");
    }, 1800);
    updateProgress();
    document.getElementById("score").innerText = `Puntaje: ${score}`;
    document.getElementById("lives").innerText = "❤️‍🔥".repeat(lives) + "❌".repeat(3-lives);
    if (lives <= 0) {
        document.getElementById("game-over-sound").play();
        document.getElementById("question").innerText = "TE QUEDASTE SIN VIDAS!";
        gameOver();
    } else {
        setTimeout(() => {
            checkProgress();
        }, 2000);
    }
}

function updateProgress() {
    let total = Object.values(progress).reduce((a, b) => a + b, 0);
    let porcentage = (total / 12) * 100; 
    document.getElementById("progress").style.width = `${porcentage}%`;
}

function checkProgress() {
    if (progress["Historia de la Iglesia"] === 3 && progress["Doctrina"] === 3 && progress["Santos"] === 3 && progress["Biblia"] === 3){
        if (progress["FinalBoss"] === true){
            document.getElementById("category").innerText = "¡Ganaste!";
            gameOver();
        }
        else {
            startFinalBoss();
        }
    }
    else {
        startGame();
    }
}

function startFinalBoss() {
    difficulty = "Final Boss";
    currentCategory = randomCategory();
    question = randomQuestion(currentCategory, difficulty);

    document.getElementById("category").innerText = `🔥 Final Boss: ${currentCategory} 🔥`;
    document.getElementById("question").innerText = question["pregunta"];
    document.getElementById("answer-0").innerText = question["respuestas"][0];
    document.getElementById("answer-1").innerText = question["respuestas"][1];
    document.getElementById("answer-2").innerText = question["respuestas"][2];
    document.getElementById("answer-3").innerText = question["respuestas"][3];
}

function gameOver() {
    clearInterval(timer);
    time = 20;
    document.getElementById("question").innerText = `¡Juego terminado! Tu puntaje final es: ${score}`;
    setTimeout(() => {
        window.location.href = "index.html";
    }, 3000);
}

function buttonHoverSound () {
    document.getElementById("button-hover-sound").currentTime = 0;
    document.getElementById("button-hover-sound").play();
}

document.addEventListener("DOMContentLoaded", prepareGame);