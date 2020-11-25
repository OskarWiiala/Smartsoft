'use strict';
const url = 'http://localhost:3000'; // change url when uploading to server

const ul = document.querySelector('ul');

// // select existing html elements
// const addForm = document.querySelector('#addCatForm');
// const modForm = document.querySelector('#modCatForm');
const ul = document.querySelector('ul');
// const userLists = document.querySelectorAll('.add-owner');

// create recipe cards
const createFoodPostCards = (recipes) => {
  // clear ul
  ul.innerHTML = '';
  recipes.forEach((foodPost) => {
    // create li with DOM methods
    const img = document.createElement('img');
    img.src = url + '/' + foodPost.filename;
    img.alt = foodPost.title;
    img.classList.add('resp');

    const figure = document.createElement('figure').appendChild(img);

    const h2 = document.createElement('h2');
    h2.innerHTML = foodPost.title;

    const p1 = document.createElement('p');
    p1.innerHTML = `recipe: ${foodPost.text}`;


    const li = document.createElement('li');
    li.classList.add('light-border');

    li.appendChild(h2);
    li.appendChild(figure);
    li.appendChild(p1);
    ul.appendChild(li);
  });
};

// AJAX call
const getFoodPost = async () => {
  try {
    const response = await fetch(url + '/foodPost');
    const recipes = await response.json();
    createFoodPostCards(recipes);
  }
  catch (e) {
    console.log(e.message);
  }
};

getFoodPost();