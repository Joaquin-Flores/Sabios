function clickJugar() {
    document.getElementById("dificultades").style.display = "flex"
    document.getElementById("botonJugar").style.display = "none"
}
document.querySelectorAll(".botonDificultad").forEach(button => {
    button.addEventListener("click", function () {
      window.location.href = "/pages/game.html";
    });
  });