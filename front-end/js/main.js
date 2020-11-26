'use strict';
const url = 'http://localhost:3000'; // change url when uploading to server

// select existing html elements
const ul = document.querySelector('ul');
const addForm = document.querySelector('#addFoodPostForm');
const loginForm = document.querySelector('#login-form');
const logOut = document.querySelector('#log-out');
const userInfo = document.querySelector('#user-info');

// create foodPost cards
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

// submit add foodPost form
addForm.addEventListener('submit', async (evt) => {
  evt.preventDefault();
  const fd = new FormData(addForm);
  const fetchOptions = {
    method: 'POST',
    body: fd,
  };
  const response = await fetch(url + '/foodPost', fetchOptions);
  const json = await response.json();
  console.log('add response', json);
  getFoodPost();
});

// login
loginForm.addEventListener('submit', async (evt) => {
  evt.preventDefault();
  const data = serializeJson(loginForm);
  const fetchOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  };

  const response = await fetch(url + '/auth/login', fetchOptions);
  const json = await response.json();
  console.log('login response', json);
  if (!json.user) {
    alert(json.message);
  } else {
    // save token
    sessionStorage.setItem('token', json.token);
    // show/hide forms + cats
    // loginWrapper.style.display = 'none';
    loginForm.style.display = "none";
    // main.style.display = 'block';
    userInfo.innerHTML = `Hello ${json.user.name}`;
    document.getElementById("log-out").style.display = 'block';
    getFoodPost();
  }
});

// logout
logOut.addEventListener('click', async (evt) => {
  evt.preventDefault();
  try {
    const options = {
      headers: {
        'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
      },
    };
    const response = await fetch(url + '/auth/logout', options);
    const json = await response.json();
    console.log(json);
    // remove token
    sessionStorage.removeItem('token');
    alert('You have logged out');
    // show/hide forms + cats
    // loginWrapper.style.display = 'flex';
    logOut.style.display = 'none';
    // main.style.display = 'none';
    document.getElementById("log-out").style.display = "block";
  }
  catch (e) {
    console.log(e.message);
  }
});

