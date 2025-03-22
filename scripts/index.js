function clickJugar() {
    mostrarTarjetaMenu();
    let bgMusic = new Audio("assets/sounds/cantoGregoriano.m4a");
    window.bgMusic = bgMusic;
    window.bgMusic.loop = true;
    window.bgMusic.play();
}

function seleccionarDificultad(dificultad) {
  sessionStorage.setItem("dificultad", dificultad);
  window.location.href = "game.html";
}

function mostrarTarjetaMenu() {
  document.getElementById('tarjetaInicio').style.display = "none";
  document.getElementById('tarjetaContacto').style.display = "none";
  document.getElementById('tarjetaCreditos').style.display = "none";
  document.getElementById('tarjetaSobre').style.display = "none";
  document.getElementById('tarjetaMenu').style.display = "block";
}

function mostrarContacto() {
  document.getElementById('tarjetaContacto').style.display = "block";
  document.getElementById('tarjetaMenu').style.display = "none";
}

function mostrarCreditos() {
  document.getElementById('tarjetaCreditos').style.display = "block";
  document.getElementById('tarjetaMenu').style.display = "none";
}

function mostrarSobre() {
  document.getElementById('tarjetaSobre').style.display = "block";
  document.getElementById('tarjetaMenu').style.display = "none";
}