'use strict';
const url = 'http://localhost:3000'; // change url when uploading to server

// select existing html elements
const ul = document.querySelector('ul');
const addForm = document.querySelector('#addFoodPostForm');
const loginWrapper = document.querySelector('#loginWrapper');
const loginForm = document.querySelector('#login-form');
const logOut = document.querySelector('#log-out');
const userInfo = document.querySelector('#user-info');
const ProfilePge = document.querySelector('#profilePage');
const addLoginFormButton = document.querySelector('#addLoginFormButton');
const addUserPage = document.querySelector('#addUserPage');
const addUserForm = document.querySelector('#add-user-form');
const addPost = document.querySelector('#displayAddPostButton');
const addUserContainer = document.querySelector('.add-user-form-container');
const loginFormContainer = document.querySelector('.login-form-container');
const cancelUser = document.querySelector('#addUserCancel');
const loginCancel = document.querySelector('#loginCancel');
const postContainer = document.querySelector('.post-container');
const cancelPost = document.querySelector('.cancel-post');
const addUser = document.querySelector('.add-user');
const upLoadB = document.querySelector('#uploadButton');
const modifyFoodPostForm = document.querySelector('#modifyFoodPostForm');
const modifyContainer = document.querySelector('.modify-container');
const cancelModifyPost = document.querySelector('.cancel-modify-post');
const iconU = document.querySelector('.btnTu');
const iconD = document.querySelector('.btnTd');
const ulLikes = document.querySelector('#likes');
const newPostCheckBox = document.querySelector('#newPostCheckbox');
const modifyPostCheckBox = document.querySelector('#modifyPostCheckbox');

let loggedInUserId = null;

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

    const user = document.createElement('h4');
    user.innerHTML = foodPost.username;

    const h2 = document.createElement('h2');
    h2.innerHTML = foodPost.title;

    const p1 = document.createElement('p');
    p1.innerHTML = `Recipe: ${foodPost.text}`;

    const likes = document.createElement('likes');
    likes.innerHTML = `${foodPost.likes}`;

    const dislikes = document.createElement('dislikes');
    dislikes.innerHTML = `${foodPost.dislikes}`;

    const clnU = iconU.cloneNode(true);
    const clnD = iconD.cloneNode(true);

    const card = document.createElement('card');
    card.classList.add('roundEdge');
    card.appendChild(user);
    card.appendChild(h2);
    card.appendChild(figure);
    card.appendChild(p1);
    card.appendChild(clnU);
    card.appendChild(likes);
    card.appendChild(clnD);
    card.appendChild(dislikes);
    ul.appendChild(card);

    // if the logged in user id matches the foodPost user id, the delete and modify buttons will be created
    if (loggedInUserId === foodPost.user) {
      // delete selected foodPost
      const delButton = document.createElement('button');
      delButton.innerHTML = 'Delete';

      delButton.addEventListener('click', async () => {
        const fetchOptions = {
          method: 'DELETE',
          headers: {
            'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
          },
        };
        try {
          const response = await fetch(
              url + '/foodPost/' + foodPost.food_post_id,
              fetchOptions);
          const json = await response.json();
          console.log('delete response', json);
          getFoodPost();
        } catch (e) {
          console.log(e.message);
        }
      });

      card.appendChild(delButton);

      // modify selected foodPost
      const modButton = document.createElement('button');
      modButton.innerHTML = 'Modify';

      modButton.addEventListener('click', () => {
        const inputs = modifyFoodPostForm.querySelectorAll('input');
        inputs[0].value = foodPost.title;
        inputs[1].value = foodPost.text;
        inputs[2].value = foodPost.food_post_id;
        inputs[3].value = foodPost.status;
        if (foodPost.status === 'private') {
          modifyPostCheckBox.checked = true;
        }
        modifyContainer.style.display = 'flex';

        //This scrolls the page to the top
        window.scroll({
          top: 0,
          left: 0,
          behavior: 'smooth',
        });
      });
      card.appendChild(modButton);
    }

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
    loginFormContainer.style.display = 'none';
    logOut.style.display = 'block';
    ProfilePge.style.display = 'block';
    addUserPage.style.display = 'none';
    userInfo.innerHTML = `Logged in ${json.user.username}`;
    // add user id (hidden) to the add foodPost form
    addUser.value = json.user.user_id;
    loggedInUserId = json.user.user_id;
    await getFoodPost();
  }
  loginForm.reset();
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
    // loginForm.style.display = 'block';
    logOut.style.display = 'none';
    userInfo.innerHTML = ``;
    ProfilePge.style.display = 'none';
    addPost.style.display = 'none';
    addUserPage.style.display = 'block';
    addLoginFormButton.style.display = 'block';
    postContainer.style.display = 'none';
    modifyContainer.style.display = 'none';
    loggedInUserId = null;
  } catch (e) {
    console.log(e.message);
  }
});

//When non-logged in user clicks on "create new user", the form for submitting new users shows up
addUserPage.addEventListener('click', async (evt) => {
  evt.preventDefault();
  addUserContainer.style.display = 'flex';
  addUserPage.style.display = 'none';

  //This scrolls the page to the top
  window.scroll({
    top: 0,
    left: 0,
    behavior: 'smooth',
  });
});

//Used to hide add-user-form-container when clicking "cancel" button in the "add new food post" card
cancelUser.addEventListener('click', async (evt) => {
  evt.preventDefault();
  addUserContainer.style.display = 'none';
  addUserPage.style.display = 'block';
  addUserForm.reset();
});

//Used to hide login-form-container when clicking "cancel" button in the "Log in" card
loginCancel.addEventListener('click', async (evt) => {
  evt.preventDefault();
  loginFormContainer.style.display = "none";
  addLoginFormButton.style.display = "block";
  addUserPage.style.display = 'block';
  loginForm.reset();
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
  addUserContainer.style.display = 'none';
  addUserPage.style.display = 'block';
  addUserForm.reset();
});

ProfilePge.addEventListener('click', async (evt) => {
  evt.preventDefault();
  addPost.style.display = 'block';
  cancelPost.style.display = 'block';
  // addForm.style.display = 'flex';
});

//Used to display post-container when clicking "create new post" button in the navigation
addPost.addEventListener('submit', async (evt) => {
  evt.preventDefault();
  postContainer.style.display = 'flex';
  addPost.style.display = 'none';

  //This scrolls the page to the top
  window.scroll({
    top: 0,
    left: 0,
    behavior: 'smooth',
  });
});

//Used to display login-form-container when clicking "Log in" button in the navigation
addLoginFormButton.addEventListener('submit', async (evt) => {
  evt.preventDefault();
  loginFormContainer.style.display = "flex";
  addLoginFormButton.style.display = "none";
  addUserPage.style.display = 'none';

  //This scrolls the page to the top
  window.scroll({
    top: 0,
    left: 0,
    behavior: 'smooth',
  });
});

//Used to hide post-container when clicking "cancel" button in the "add new food post" card
cancelPost.addEventListener('click', async (evt) => {
  evt.preventDefault();
  postContainer.style.display = 'none';
  addPost.style.display = 'block';
  addForm.reset();
});

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
  postContainer.style.display = 'none';
  addPost.style.display = 'block';
  await getFoodPost();
  addForm.reset();
});

// submit modify foodPost form
modifyFoodPostForm.addEventListener('submit', async (evt) => {
  evt.preventDefault();
  const data = serializeJson(modifyFoodPostForm);
  const fetchOptions = {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
    },
    body: JSON.stringify(data),
  };
  const response = await fetch(url + '/foodPost', fetchOptions);
  const json = await response.json();
  console.log('modify response', json);
  modifyContainer.style.display = 'none';
  await getFoodPost();
  modifyFoodPostForm.reset();
});

//Used to hide modify-container when clicking "cancel" button in the "modify food post" form
cancelModifyPost.addEventListener('click', async (evt) => {
  evt.preventDefault();
  modifyContainer.style.display = 'none';
  modifyFoodPostForm.reset();
});

// when private checkbox is clicked in add food post form, its value changes
newPostCheckBox.addEventListener('click', async (evt) => {
  if (newPostCheckBox.checked) {
    newPostCheckBox.value = 'private';
  }
  else {
    newPostCheckBox.value = 'public';
  }
});

// when private checkbox is clicked in modify food post form, its value changes
modifyPostCheckBox.addEventListener('click', async (evt) => {
  if (modifyPostCheckBox.checked) {
    modifyPostCheckBox.value = 'private';
  }
  else {
    modifyPostCheckBox.value = 'public';
  }
});