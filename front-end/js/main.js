'use strict';
const url = 'http://localhost:3000'; // change url when uploading to server

// select existing html elements
const ul = document.querySelector('ul');

// create foodPost cards
const createFoodPostCards = (recipes) => {
  // clear ul
  ul.innerHTML = '';
  recipes.forEach((foodPost) => {
    // create li with DOM methods
    const img = document.createElement('img');
    img.src = url + '/' + foodPost.filename;
    img.alt = foodPost.name;
    img.classList.add('resp');

    const figure = document.createElement('figure').appendChild(img);

    const h2 = document.createElement('h2');
    h2.innerHTML = foodPost.name;

    const p1 = document.createElement('p');
    p1.innerHTML = `Age: ${foodPost.age}`;

    const p2 = document.createElement('p');
    p2.innerHTML = `Weight: ${foodPost.weight}kg`;

    const p3 = document.createElement('p');
    p3.innerHTML = `Owner: ${foodPost.ownername}`;



    const card = document.createElement('card');
    card.classList.add('roundEdge');

    card.appendChild(h2);
    card.appendChild(figure);
    card.appendChild(p1);
    card.appendChild(p2);
    card.appendChild(p3);
    ul.appendChild(card);
  });
};

// AJAX call
const getFoodPost = async () => {
  try {
    const response = await fetch(url + '/cat');
    const cats = await response.json();
    createFoodPostCards(cats);
  }
  catch (e) {
    console.log(e.message);
  }
};
getFoodPost();
