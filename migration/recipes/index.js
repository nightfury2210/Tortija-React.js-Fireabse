const firebase = require("firebase");
require("firebase/firestore");
firebase.initializeApp({
  apiKey: "AIzaSyCCA0aN0hff7IEjJPe8j74VaebAxujKWcc",
  authDomain: "tortija-19187.firebaseapp.com",
  projectId: "tortija-19187"
});

const db = firebase.firestore();
const recipes = require("./recipes.json");

const difficulty_level_type = {
  "Leicht": 1,
  "Mittel": 2,
  "Schwer": 3
}

recipes.forEach((obj) => {
  db.collection("recipes").add({
    name: obj.name,
    carbohydrates_total: obj.kh_gesamt,
    protein_total: obj.ew_gesamt,
    fat_total: obj.fett_gesamt,
    imageUrl: `https://static.tortija.de/recipe_images/${obj.imageUrl}`,
    category: obj.category,
    portion_g: obj.portion_g,
    kcal_total: obj.kcal_gesamt,
    histamine: obj.histamin || false,
    lactose: obj.laktose || false,
    sorbitol: obj.sorbit || false,
    fructose: obj.fruktose || false,
    peanuts: obj.erdnuss || false,
    soy: obj.soja || false,
    egg: obj.ei || false,
    celery: obj.sellerie || false,
    nuts: obj.schalen || false,
    vegan: obj.vegan || false,
    vegetarian: obj.vegetarisch || false,
    ketogen: obj.ketogen || false,
    thermomix: obj.thermomix || false,
    difficulty_level: difficulty_level_type[obj.difficulty_level],
    ingredients: obj.ingridients,
    description: obj.description,
  }).then(function(docRef) {
    // console.log("Document written with ID: ", docRef.id);
  })
  .catch(function(error) {
    console.error("Error adding document: ", error);
  });
});