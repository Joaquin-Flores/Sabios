let preguntas = [];
let puntaje = 0;
let racha = 0;
let vidas = 3;
let tiempo = 60;
let indicePregunta = -1;
let dificultad = "Medio";
let categoriaActual = "Historia de la Iglesia";
let preguntasRespondidas = 0;

async function cargarPreguntas() {
    try {
        const respuesta = await fetch("/scripts/preguntas.json");
        preguntas = await respuesta.json();
        iniciarJuego();
    } catch (error) {
        console.error('Error al cargar el archivo JSON:', error);
    }
}

function iniciarJuego() {
    proximaPregunta();
    iniciarTiempo();
}

function proximaPregunta() {
    categoriaActual = categoriaRandom();
    let pregunta = preguntaRandom(categoriaActual, dificultad);
    let respuesta = pregunta["correcta"];
    document.getElementById("categoria").innerText = categoriaActual;
    document.getElementById("pregunta").innerText = pregunta["pregunta"];
    document.getElementById("respuesta0").innerText = pregunta["respuestas"][0];
    document.getElementById("respuesta1").innerText = pregunta["respuestas"][1];
    document.getElementById("respuesta2").innerText = pregunta["respuestas"][2];
    document.getElementById("respuesta3").innerText = pregunta["respuestas"][3];
}

function preguntaRandom(categoriaActual, dificultad) {
    const listaPreguntas = preguntas[categoriaActual][dificultad];
    return listaPreguntas[Math.floor(Math.random() * listaPreguntas.length)];
}

function categoriaRandom() {
    let sorteo = Math.floor(Math.random() * 5 );
    switch (sorteo) {
        case 1:
            return "Historia de la Iglesia";
            break;
        case 2:
            return "Doctrina";
            break;
        case 3:
            return "Santos";
            break;
        case 4:
            return "Biblia";
            break;
        default:
            return "Historia de la Iglesia";
            break;
    }
}

function iniciarTiempo() {
    setInterval(() => {
        if (tiempo > 0) {
            tiempo--;
            document.getElementById("tiempo").innerText = `⏳ ${tiempo}s`;
        }
    }, 1000);
}

document.addEventListener("DOMContentLoaded", cargarPreguntas);
