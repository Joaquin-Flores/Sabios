let preguntas = [];
let puntaje = 0;
let vidas = 3;
let tiempo = 60;
let indicePregunta = -1;
let dificultad = "media";
let categoriaActual = "";
let preguntasRespondidas = 0;

async function cargarPreguntas() {
    try {
        const respuesta = await fetch("/scripts/preguntas.json");
        preguntas = await respuesta.json();
        console.log("Preguntas: ", preguntas);  // Ver la estructura de los datos en la consola
        console.log(dificultad)
    } catch (error) {
        console.error('Error al cargar el archivo JSON:', error);
    }
}

document.addEventListener("DOMContentLoaded", cargarPreguntas);
