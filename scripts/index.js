document.addEventListener("DOMContentLoaded", () => {
  let bgMusic = new Audio("assets/sounds/cantoGregoriano.m4a");
  window.bgMusic = bgMusic;
  window.bgMusic.loop = true;
  window.bgMusic.play();
});

function clickJugar() {
    document.getElementById("dificultades").style.display = "flex"
    document.getElementById("botonJugar").style.display = "none"
}

  function seleccionarDificultad(dificultad) {
    sessionStorage.setItem("dificultad", dificultad);
    window.location.href = "game.html";
}