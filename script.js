//Je déclare toutes mes variables
let valeur = document.querySelector(".value");
let range = document.querySelector("#range");
let search = document.getElementById("rechercher");
let croiss = document.querySelector(".croiss");
let decroiss = document.querySelector(".decroiss");
let alpha = document.querySelector(".alpha");
let liste = document.getElementById("liste");

range.addEventListener("input", (e) => {
  valeur.textContent = range.value;
});



// Résolution
let listePays = [];
async function recupererdonnees() {
  let cache = localStorage.getItem("pays");
  if (cache) {
    console.log("Chargement des données depuis le cache");
    listePays = JSON.parse(cache);
    affichagedonnees(listePays);
  } else {
    console.log("Récupération des données depuis l'API...");
    try {
      const response = await fetch("https://restcountries.com/v3.1/all");
      const data = await response.json();
      listePays = data;
      affichagedonnees(data);
    } catch (error) {
      console.log(error);
    }
  }
}
recupererdonnees();

function affichagedonnees(data) {
  liste.innerHTML = "";
  //   let tableau = data.map((array) => {
  // console.log(array);

  // let capitale = array.capital;
  // let devis = array.currencies;
  // let population = array.population;
  // let nom = array.name.common;
  // console.log(capitale);
  // console.log(devis);
  // console.log(population);
  // console.log(nom);
  data.forEach((pays) => {
    let div = document.createElement("div"); // Création d'un élément HTML
    div.classList.add("carte");
    let titre = document.createElement("h2");
    let sousTitre = document.createElement("h3");
    let texte = document.createElement("p");
    let monnaie = document.createElement("p");
    let image = document.createElement("img");

    titre.textContent = pays.name.common;
    sousTitre.textContent = pays.capital;
    texte.textContent = `Population : ${pays.population}`;
    let devis;
    if (pays.currencies) {
      let currency = Object.keys(pays.currencies)[0]; // Récupère la première clé de l'objet currencies
      devis = pays.currencies[currency].name;
    }
    monnaie.textContent = `Monnaie : ${devis}`;
    image.src = pays.flags.svg;
    image.width = 100;

    div.appendChild(image);
    div.appendChild(titre);
    div.appendChild(sousTitre);
    div.appendChild(texte);
    div.appendChild(monnaie);
    liste.appendChild(div);
  });
}


// Manipulation des inputs et boutons pour le tri

// Fonction pour filtrer les pays en fonction de l'input de recherche
search.addEventListener("input", () => {
  let filtre = search.value.toLowerCase();
  let resultat = listePays.filter(pays =>
    pays.name.common.toLowerCase().includes(filtre)
  );
  affichagedonnees(resultat);
});

// Modifier le nombre de données en fonction de la valeur de l'input range
function initialiserRange() {
  range.max = listePays.length;
  range.value = listePays.length;
  valeur.textContent = range.value;
}

// Mettre à jour l'affichage selon la valeur du range
range.addEventListener("input", () => {
  valeur.textContent = range.value;
  affichagedonnees(listePays.slice(0, range.value));
});

// Fonction pour trier les pays par population (croissante)
croiss.addEventListener("click", () => {
  let tri = [...listePays].sort((a, b) => a.population || 0 - b.population || 0);
  affichagedonnees(tri);
});
// Fonction pour trier les pays par population (décroissante)
decroiss.addEventListener("click", () => {
  let tri = [...listePays].sort((a, b) => b.population || 0 - a.population || 0);
  affichagedonnees(tri);
});

// Fonction pour trier les pays par ordre alphabétique
alpha.addEventListener("click", () => {
  let tri = [...listePays].sort((a, b) => a.name.common.localeCompare(b.name.common));
  affichagedonnees(tri);
});