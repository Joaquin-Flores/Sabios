let shopItems = [];
let points = localStorage.getItem("points") ? parseInt(localStorage.getItem("points")) : 0;

document.getElementById("play-btn").addEventListener("click", function() {
  showMenuCard();
  document.getElementById("stored-points").innerHTML = "Puntaje: " + points;
  document.getElementById("stored-points").style.display = "block";
  document.getElementById("shop-button").style.display = "block";
  let bgMusic = new Audio("assets/sounds/gregorianChant.m4a");
  window.bgMusic = bgMusic;
  window.bgMusic.loop = true;
  window.bgMusic.play();
});

// Abrir el modal de la tienda
document.getElementById("shop-button").addEventListener("click", function() {
  document.getElementById("modal-shop").style.display = "block";
});

// Cerrar el modal cuando se hace clic en la "X"
document.getElementById("close-modal").addEventListener("click", function() {
  document.getElementById("modal-shop").style.display = "none";
});

// Función para cargar los ítems desde items.json
async function loadItemsFromJSON() {
    try {
        const response = await fetch("scripts/items.json"); // Cargar el archivo JSON
        if (!response.ok) {
            throw new Error("Error loading shop items.");
        }
        shopItems = await response.json(); // Guardar los ítems en la variable global
        loadShopItems(); // Llamar la función para mostrar los ítems en la tienda
    } catch (error) {
        console.error("Error:", error);
    }
}

// Función para mostrar los ítems en la tienda con información desplegable
function loadShopItems() {
  const itemsContainer = document.getElementById("items-container");
  itemsContainer.innerHTML = ""; // Limpiar el contenedor antes de agregar ítems

  shopItems.forEach(item => {
      const itemDiv = document.createElement("div");
      itemDiv.classList.add("item");
      itemDiv.innerHTML = `
          <div class="item-header" onclick="toggleItemInfo('${item.id}')">
              <h3>${item.name}</h3>
              <img src="assets/images/${item.image}" alt="${item.name}">
          </div>
          <div class="item-info" id="info-${item.id}" style="display: none;">
              <p>${item.description}</p>
              <p>${item.rarity}</p>
              <div class="price">${item.price} puntos</div>
              <button class="buy-btn" onclick="buyItem('${item.id}')">Comprar</button>
          </div>
      `;
      itemsContainer.appendChild(itemDiv);
  });
}

// Función para desplegar la información de un ítem al hacer clic
function toggleItemInfo(itemId) {
  const infoDiv = document.getElementById(`info-${itemId}`);
  infoDiv.style.display = (infoDiv.style.display === "none") ? "block" : "none";
}


// Llamar la función para cargar los ítems al iniciar
loadItemsFromJSON();

// Función para comprar un ítem
function buyItem(itemId) {
  const item = shopItems.find(i => i.id === itemId);
  if (item && points >= item.price) {
      // Resta puntos y marca como comprado
      points -= item.price;
      alert(`¡Has comprado ${item.name}!`);
      // Aquí podrías agregar lógica para marcar el ítem como comprado (en localStorage o en la UI)
  } else {
      alert("No tienes suficientes puntos para comprar este ítem.");
  }
}

function selectDifficulty(difficulty) {
  sessionStorage.setItem("difficulty", difficulty);
  window.location.href = "game.html";
}

function showMenuCard() {
  document.getElementById('start-card').style.display = "none";
  document.getElementById('contact-card').style.display = "none";
  document.getElementById('credits-card').style.display = "none";
  document.getElementById('about-card').style.display = "none";
  document.getElementById('menu-card').style.display = "block";
}

function showContact() {
  document.getElementById('contact-card').style.display = "block";
  document.getElementById('menu-card').style.display = "none";
}

function showCredits() {
  document.getElementById('credits-card').style.display = "block";
  document.getElementById('menu-card').style.display = "none";
}

function showAbout() {
  document.getElementById('about-card').style.display = "block";
  document.getElementById('menu-card').style.display = "none";
}