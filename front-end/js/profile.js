'use strict';
const url = 'http://localhost:3000'; // change url when uploading to server

// select existing html elements
const ul = document.querySelector('ul');
const addForm = document.querySelector('#addFoodPostForm');
const loginForm = document.querySelector('#login-form');
const logOut = document.querySelector('#log-out');
const userInfo = document.querySelector('#user-info');
const addPost = document.querySelector('#displayAddPostButton');
const postContainer = document.querySelector('.post-container')
const cancelPost = document.querySelector('.cancel-post');

const createFoodPostCards = (recipes) => {
  // clear ul
  ul.innerHTML = '';
  recipes.forEach((foodPost) => {
    // create li with DOM methods
    const img = document.createElement('img');
    img.src = url + '/thumbnails/' + foodPost.filename;
    img.alt = foodPost.title;
    img.classList.add('resp');

    const figure = document.createElement('figure').appendChild(img);

    const h2 = document.createElement('h2');
    h2.innerHTML = foodPost.title;

    const p1 = document.createElement('p');
    p1.innerHTML = `Recipe: ${foodPost.text}`;

    // delete selected foodPost
    const delButton = document.createElement('button');
    delButton.innerHTML = 'Delete';
    delButton.addEventListener('click', async () => {
      const fetchOptions = {
        method: 'DELETE',
      };
      try {
        const response = await fetch(url + '/foodPost/' + foodPost.food_post_id, fetchOptions);
        const json = await response.json();
        console.log('delete response', json);
        getFoodPost();
      }
      catch (e) {
        console.log(e.message);
      }
    });

    const card = document.createElement('card');
    card.classList.add('roundEdge');

    card.appendChild(h2);
    card.appendChild(figure);
    card.appendChild(p1);
    card.appendChild(delButton);
    ul.appendChild(card);
  });
};

const getFoodPost = async () => {
  console.log('getFoodPost token ', sessionStorage.getItem('token'));
  try {
    const options = {
      headers: {
        'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
      },
    };
    const response = await fetch(url + '/foodPost', options);
    const recipes = await response.json();
    createFoodPostCards(recipes);
  }
  catch (e) {
    console.log(e.message);
  }
};
getFoodPost()

//Used to display post-container when clicking "create new post" button
addPost.addEventListener('submit', async (evt) => {
  evt.preventDefault();
  postContainer.style.display = "flex";
  addPost.style.display = "none";

  //This scrolls the page to the top
  window.scroll({
    top: 0,
    left: 0,
    behavior: 'smooth',
  });
});

//Used to hide post-container when clicking "cancel" button in the "add new food post" card
cancelPost.addEventListener('button', async (evt) => {
  evt.preventDefault();
  postContainer.style.display = "none";
  addPost.style.display = "block";
});




