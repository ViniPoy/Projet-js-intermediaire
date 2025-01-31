import { ajoutListenersAvis, ajoutListenerEnvoyerAvis, afficherAvis } from "./avis.js";


let pieces = window.localStorage.getItem("pieces");
if (pieces === null) {
    //Récupération des données depuis l'API
    const reponse = await fetch("http://localhost:8081/pieces/");
    pieces = await reponse.json();
    const valeurPieces = JSON.stringify(pieces);
    window.localStorage.setItem("pieces",valeurPieces);
} else {
    pieces = JSON.parse(pieces)
}


ajoutListenerEnvoyerAvis()


function genererPieces (pieces) {
    for (let i = 0; i < pieces.length; i++) {

        const article = pieces[i];
        const sectionFiches = document.querySelector(".fiches");
        const pieceElement = document.createElement("article");
        const imageElement = document.createElement("img");
        imageElement.src = article.image;
        const nomElement = document.createElement("h2");
        nomElement.innerText = article.nom;
        const prixElement = document.createElement("p");
        prixElement.innerText = `Prix: ${article.prix} € (${article.prix < 35 ? "€" : "€€€"} )`;
        const categorieElement = document.createElement("p");
        categorieElement.innerText = article.categorie ?? "(Aucune catégorie)";
        const descriptionElement = document.createElement("p");
        descriptionElement.innerText = article.description ?? "Pas de description pour le moment.";
        const disponibiliteElement = document.createElement("p");
        disponibiliteElement.innerText = article.disponibilite ? "En stock" : "Rupture de stock";
        const avisBouton = document.createElement("button");
        avisBouton.dataset.id = article.id;
        avisBouton.textContent = "Afficher les avis";

        sectionFiches.appendChild(pieceElement)
        pieceElement.appendChild(imageElement);
        pieceElement.appendChild(nomElement);
        pieceElement.appendChild(prixElement);
        pieceElement.appendChild(categorieElement);
        pieceElement.appendChild(descriptionElement);
        pieceElement.appendChild(disponibiliteElement);
        pieceElement.appendChild(avisBouton);
    }
    ajoutListenersAvis();
}


genererPieces(pieces);


const boutonTrier = document.querySelector(".btn-trier");
boutonTrier.addEventListener("click", function () {
    const piecesOrdonnees = Array.from(pieces);
    piecesOrdonnees.sort(function(a, b) {
        return a.prix - b.prix;
    })
    document.querySelector(".fiches").innerHTML = "";
    genererPieces(piecesOrdonnees);
})


const boutonFiltrer = document.querySelector(".btn-filtrer");
boutonFiltrer.addEventListener("click", function () {
    const piecesFiltrees = pieces.filter(function (piece) {
        return piece.prix < 35;
    })
    document.querySelector(".fiches").innerHTML = "";
    genererPieces(piecesFiltrees);
})


const boutonDecroissant = document.querySelector(".btn-decroissant");
boutonDecroissant.addEventListener("click", function () {
    const piecesOrdonnees = Array.from(pieces);
    piecesOrdonnees.sort(function (a, b) {
        return b.prix - a.prix;
    })
    document.querySelector(".fiches").innerHTML = "";
    genererPieces(piecesOrdonnees);
})


const boutonNoDescription = document.querySelector(".btn-nodesc");
boutonNoDescription.addEventListener("click", function () {
    const piecesFiltrees = pieces.filter(function (piece) {
        return piece.description;
    })
    document.querySelector(".fiches").innerHTML = "";
    genererPieces(piecesFiltrees);
})


const noms = pieces.map(piece => piece.nom);
for (let i = pieces.length -1; i >= 0; i--) {
    if (pieces[i].prix > 35) {
        noms.splice(i,1);
    }
}
const abordablesElements = document.createElement("ul");
for (let i = 0; i < noms.length; i++) {
    const nomElement = document.createElement("li");
    nomElement.innerText = noms[i];
    abordablesElements.appendChild(nomElement);
}
document.querySelector(".abordables").appendChild(abordablesElements)


const nomsDispos = pieces.map(piece => piece.nom);
const prixDispos = pieces.map(piece => piece.prix);
for (let i = pieces.length - 1; i >= 0; i--) {
    if (!pieces[i].disponibilite) {
        nomsDispos.splice(i, 1);
        prixDispos.splice(i, 1);
    }
}
const disponiblesElements = document.createElement("ul");
for (let i = 0; i < nomsDispos.length; i++) {
    const nomElement = document.createElement("li");
    nomElement.innerText = `${nomsDispos[i]} - ${prixDispos[i]} €`;
    disponiblesElements.appendChild(nomElement);
}
document.querySelector(".disponibles").appendChild(disponiblesElements)


const inputPrixMax = document.getElementById("prix-max");
inputPrixMax.addEventListener("input", function () {
    const piecesFiltrees = pieces.filter(function(piece) {
        return piece.prix <= inputPrixMax.value;
    })
    document.querySelector(".fiches").innerHTML = "";
    genererPieces(piecesFiltrees);
})


const boutonMettreAJour = document.querySelector(".btn-maj");
boutonMettreAJour.addEventListener("click", function () {
    window.localStorage.removeItem("pieces");
})


for (let i = 0; i < pieces.length; i++) {
    const id = pieces[i].id;
    const avisJSON = window.localStorage.getItem(`avis-piece-${id}`);
    const avis = JSON.parse(avisJSON);
    if (avis !== null) {
        const pieceElement = document.querySelector(`article[data-id="${id}"]`);
        afficherAvis(pieceElement,avis);
    }
}