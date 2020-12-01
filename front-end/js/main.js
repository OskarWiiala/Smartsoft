'use strict';
const url = 'http://localhost:3000'; // change url when uploading to server

// select existing html elements
const ul = document.querySelector('ul');
const addForm = document.querySelector('#addFoodPostForm');
const loginForm = document.querySelector('#login-form');
const logOut = document.querySelector('#log-out');
const userInfo = document.querySelector('#user-info');
const ProfilePge = document.querySelector('#profilePage');
const addUserPage = document.querySelector('#addUserPage');
const addUserForm = document.querySelector('#add-user-form');
const addPost = document.querySelector('#displayAddPostButton');
const postContainer = document.querySelector('.post-container')
const cancelPost = document.querySelector('.cancel-post');
const addUser = document.querySelector('.add-user');
const upLoadB = document.querySelector('#uploadButton');


// create foodPost cards
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
        const response = await fetch(url + '/foodPost/' + foodPost.food_post_id,
            fetchOptions);
        const json = await response.json();
        console.log('delete response', json);
        getFoodPost();
      } catch (e) {
        console.log(e.message);
      }
    });

    // give like to foodPost
    const likeButton = document.createElement('button');
    likeButton.innerHTML = 'GiveLike';
    likeButton.addEventListener('click', async () => {
      const fetchOptions = {
        method: 'UPDATE',
      };
      try {
        const response = await fetch(url + '/foodPost/' + foodPost.food_post_id,
            fetchOptions);
        const json = await response.json();
        console.log('like response', json);
        getFoodPost();
      } catch (e) {
        console.log(e.message);
      }
    });

    const card = document.createElement('card');
    card.classList.add('roundEdge');
    card.appendChild(h2);
    card.appendChild(figure);
    card.appendChild(p1);
    card.appendChild(likeButton);
    card.appendChild(delButton).style.display = 'none';
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
  } catch (e) {
    console.log(e.message);
  }
};
getFoodPost();

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
    loginForm.style.display = 'none';
    logOut.style.display = 'block';
    ProfilePge.style.display = 'block';
    addUserPage.style.display = 'none';
    userInfo.innerHTML = `Logged in ${json.user.username}`;
    addUser.value = json.user.user_id;
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
    loginForm.style.display = 'block';
    logOut.style.display = 'none';
    userInfo.innerHTML = ``;
    ProfilePge.style.display = 'none';
    addPost.style.display = 'none';
    addUserPage.style.display = 'block';
  } catch (e) {
    console.log(e.message);
  }
});

// // when app starts, check if token exists and hide login form, show logout button and main content, get cats and users
// if (sessionStorage.getItem('token')) {
//   logOut.style.display = 'block';
//   getFoodPost()
// }

addUserPage.addEventListener('click', async (evt) => {
  evt.preventDefault();
  addUserForm.style.display = 'block';

});

// submit register form
addUserForm.addEventListener('submit', async (evt) => {
  evt.preventDefault();
  const data = serializeJson(addUserForm);
  const fetchOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  };
  const response = await fetch(url + '/auth/register', fetchOptions);
  const json = await response.json();
  console.log('user add response', json);
  // save token
  sessionStorage.setItem('token', json.token);
  addUserForm.style.display = 'none';

});

ProfilePge.addEventListener('click', async (evt) => {
  evt.preventDefault();
  addPost.style.display = 'block';
  cancelPost.style.display = 'block';
  addForm.style.display = 'block';
});

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

// add current user to add foodPost form
const addUserToAddFoodPostForm = (user) => {
  addUser.value = user.user_id;
};

// submit add foodPost form
addForm.addEventListener('submit', async (evt) => {
  evt.preventDefault();
  const fd = new FormData(addForm);
  const fetchOptions = {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
    },
    body: fd,
  };
  const response = await fetch(url + '/foodPost', fetchOptions);
  const json = await response.json();
  console.log('add response', json);
  postContainer.style.display = "none";
  addPost.style.display = "block";
  await getFoodPost();
});
