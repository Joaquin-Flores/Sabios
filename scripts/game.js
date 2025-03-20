let preguntas = [];
let pregunta;
let temporizador;
let puntaje = 0;
let racha = 0;
let vidas = 3;
let tiempo = 20;
let dificultad = sessionStorage.getItem("dificultad") || "Fácil";
const categorias = ["Historia de la Iglesia", "Doctrina", "Santos", "Biblia"];
let categoriaActual = categorias[3];
let progreso = {
    "Historia de la Iglesia": 0,
    "Doctrina": 0,
    "Santos": 0,
    "Biblia": 0,
    "FinalBoss": false
};

function prepararJuego() {
    cargarPreguntas();
    agregarEventosUI();
}

function agregarEventosUI() {
    let bgMusic = new Audio("/assets/sounds/gameMusic.m4a");
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

async function cargarPreguntas() {
    try {
        const response = await fetch("/scripts/preguntas.json");
        preguntas = await response.json();
        iniciarJuego();
    } catch (error) {
        console.error('Error al cargar el archivo JSON:', error);
    }
}

function iniciarJuego() {
    proximaPregunta();
    iniciarTiempo();
    reiniciarColores();
}

function reiniciarColores() {
    for (let index = 0; index < 4; index++) {
        document.getElementById("respuesta" + index).style.backgroundColor = "#ffd900";
    }
}

function proximaPregunta() {
    categoriaActual = categoriaRandom();
    pregunta = preguntaRandom(categoriaActual, dificultad);
    document.getElementById("categoria").innerText = categoriaActual;
    document.getElementById("pregunta").innerText = pregunta["pregunta"];
    document.getElementById("respuesta0").innerText = pregunta["respuestas"][0];
    document.getElementById("respuesta1").innerText = pregunta["respuestas"][1];
    document.getElementById("respuesta2").innerText = pregunta["respuestas"][2];
    document.getElementById("respuesta3").innerText = pregunta["respuestas"][3];
}

function preguntaRandom(categoriaActual, dificultad) {
    let listaPreguntas = preguntas[categoriaActual][dificultad];
    if (listaPreguntas.length === 0) {
        document.getElementById("pregunta").innerText = "Haz alcanzado la Sabiduría (no hay más preguntas)";
        finDelJuego();
    }
    return listaPreguntas.splice(Math.floor(Math.random() * listaPreguntas.length), 1)[0];
}

function categoriaRandom() {
    let categoriasDisponibles = categorias.filter(cat => progreso[cat] < 3);
    if (categoriasDisponibles.length === 0) return categorias[Math.floor(Math.random() * 4)];
    return categoriasDisponibles[Math.floor(Math.random() * categoriasDisponibles.length)];
}

function iniciarTiempo() {
    if (temporizador) clearInterval(temporizador);
    tiempo = 21;
    temporizador = setInterval(() => {
        if (tiempo > 0) {
            tiempo--;
            document.getElementById("tiempo").innerText = `⏳ ${tiempo}s`;
        } else {
            document.getElementById("sonidoFin").play();
            document.getElementById("pregunta").innerText = "TE QUEDASTE SIN TIEMPO!";
            finDelJuego();
        }
    }, 1000);
}

function verificarRespuesta(respuestaSeleccionada) {
    let respuesta = pregunta["correcta"];
    document.getElementById("respuesta" + respuesta).classList.add("correcta");
    if (respuestaSeleccionada === respuesta) {
        document.getElementById("sonidoCorrecto").play();
        racha++;
        let multiplicador = racha >= 3 ? 2 : 1;
        puntaje += 100 * multiplicador;
        document.getElementById("respuesta" + respuesta).style.backgroundColor = "greenyellow";
        document.getElementById("pregunta").innerText = "CORRECTO!";
        if (categoriaActual === "Final Boss") {
            progreso["FinalBoss"] = true;
        } else {
            progreso[categoriaActual]++;
        }
        
    } else {
        document.getElementById("sonidoIncorrecto").play();
        vidas--;
        puntaje = Math.max(0, puntaje - 100);   
        racha = 0;
        document.getElementById("respuesta" + respuestaSeleccionada).style.backgroundColor = "red";
        document.getElementById("respuesta" + respuesta).style.backgroundColor = "greenyellow";
        document.getElementById("pregunta").innerText = "INCORRECTO!";
    }
    setTimeout(() => {
        document.getElementById("respuesta" + respuesta).classList.remove("correcta");
    }, 1800);
    actualizarProgreso();
    document.getElementById("puntaje").innerText = `Puntaje: ${puntaje}`;
    document.getElementById("vidas").innerText = "❤️".repeat(vidas) + "❌".repeat(3-vidas);
    if (vidas <= 0) {
        document.getElementById("sonidoFin").play();
        document.getElementById("pregunta").innerText = "TE QUEDASTE SIN VIDAS!";
        finDelJuego();
    } else {
        setTimeout(() => {
            verificarProgreso();
        }, 2000);
    }
}

function actualizarProgreso() {
    let total = Object.values(progreso).reduce((a, b) => a + b, 0);
    let porcentaje = (total / 12) * 100; 
    document.getElementById("progreso").style.width = `${porcentaje}%`;
}

function verificarProgreso() {
    if (progreso["Historia de la Iglesia"] === 3 && progreso["Doctrina"] === 3 && progreso["Santos"] === 3 && progreso["Biblia"] === 3){
        if (progreso["FinalBoss"] === true){
            document.getElementById("categoria").innerText = "¡Ganaste!";
            finDelJuego();
        }
        else {
            iniciarFinalBoss();
        }
    }
    else {
        iniciarJuego();
    }
}

function iniciarFinalBoss() {
    dificultad = "Final Boss";
    categoriaActual = categoriaRandom();
    pregunta = preguntaRandom(categoriaActual, dificultad);

    document.getElementById("categoria").innerText = `🔥 Final Boss: ${categoriaActual} 🔥`;
    document.getElementById("pregunta").innerText = pregunta["pregunta"];
    document.getElementById("respuesta0").innerText = pregunta["respuestas"][0];
    document.getElementById("respuesta1").innerText = pregunta["respuestas"][1];
    document.getElementById("respuesta2").innerText = pregunta["respuestas"][2];
    document.getElementById("respuesta3").innerText = pregunta["respuestas"][3];
}

function finDelJuego() {
    clearInterval(temporizador);
    tiempo = 20;
    document.getElementById("pregunta").innerText = `¡Juego terminado! Tu puntaje final es: ${puntaje}`;
    setTimeout(() => {
        window.location.href = "/docs/index.html";
    }, 3000);
}

function activarSonidoHover () {
    document.getElementById("sonidoHoverBotón").currentTime = 0;
    document.getElementById("sonidoHoverBotón").play();
}

document.addEventListener("DOMContentLoaded", prepararJuego);