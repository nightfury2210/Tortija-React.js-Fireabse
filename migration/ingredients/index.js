const firebase = require("firebase");
require("firebase/firestore");
firebase.initializeApp({
  apiKey: "AIzaSyCCA0aN0hff7IEjJPe8j74VaebAxujKWcc",
  authDomain: "tortija-19187.firebaseapp.com",
  projectId: "tortija-19187"
});

const db = firebase.firestore();
const recipes = require("./ingredients.json");

recipes.forEach((obj) => {
  db.collection("ingredients").add({
    name: obj.name,
    kcal_100g: obj.kcal_100g,
    fat_100g: obj.ft_100g,
    protein_100g: obj.ew_100g,
    carbohydrates_100g: obj.kh_100g,
    ballast_100g: obj.ballast_100g,
    addition_100g: obj.zusatz_100g,
    category: obj.category,
    peanuts: obj.erdnuss,
    egg: obj.ei,
    nuts: obj.schalen,
    soy: obj.soja,
    celery: obj.sellerie,
    histamin: obj.histamin,
    sorbitol: obj.sorbit,
    lactose: obj.laktose,
    fructose: obj.fruktose,
    vegan: obj.vegan,
    vegetarian: obj.vegetarisch,
    preselect_g: obj.preselect_g,
    preselect_amount: obj.preselect_amount,
    preselect_type: obj.preselect_type,
    imageUrl: `https://static.tortija.de/ingridient_images_big/${obj.imageUrl}`,
  }).then(function(docRef) {
    // console.log("Document written with ID: ", docRef.id);
  })
  .catch(function(error) {
    console.error("Error adding document: ", error);
  });
});