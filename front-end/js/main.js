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
const modifyTextarea = document.querySelector('#modifyText');
const cancelModifyPost = document.querySelector('.cancel-modify-post');
const iconU = document.querySelector('.btnTu');
const iconD = document.querySelector('.btnTd');
const ulLikes = document.querySelector('#likes');
const newPostCheckBox = document.querySelector('#newPostCheckbox');
const modifyPostCheckBox = document.querySelector('#modifyPostCheckbox');
const addLikesForm = document.querySelector('#add-like-form');
const imageModal = document.querySelector('#image-modal');
const modalImage = document.querySelector('#image-modal img');
const close = document.querySelector('#image-modal a');

let loggedInUserId = null;

// create foodPost cards
const createFoodPostCards = (recipes) => {
  // clear ul
  ul.innerHTML = '';
  recipes.forEach((foodPost) => {
    if (foodPost.status === 'public') {
      // create li with DOM methods
      const img = document.createElement('img');
      img.src = url + '/thumbnails/' + foodPost.filename;
      img.alt = foodPost.title;
      img.classList.add('resp');

      // open large image when clicking image
      img.addEventListener('click', () => {
        modalImage.src = url + '/' + foodPost.filename;
        imageModal.alt = foodPost.title;
        imageModal.classList.toggle('hide');
      });

      const figure = document.createElement('figure').appendChild(img);

      const user = document.createElement('h4');
      user.innerHTML = foodPost.username;
      user.classList.add('cardUserHeader');

      const h2 = document.createElement('h2');
      h2.innerHTML = foodPost.title;
      h2.classList.add('cardh2');

      const p1 = document.createElement('textarea');
      p1.innerHTML = `Recipe: ${foodPost.text}`;
      p1.classList.add('cardRecipe');
      p1.readOnly = true;

      const likes = document.createElement('likes');
      likes.innerHTML = `${foodPost.likes}`;

      const dislikes = document.createElement('dislikes');
      dislikes.innerHTML = `${foodPost.dislikes}`;

      const clnU = iconU.cloneNode(true);
      const clnD = iconD.cloneNode(true);

      const card = document.createElement('card');
      card.classList.add('roundEdge');
      card.classList.add('cardImage');
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
        delButton.classList.add('cardButton');

        delButton.addEventListener('click', async () => {
          if(confirm(`Are you sure you want to delete "${foodPost.title}"`)) {
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
        }});

        card.appendChild(delButton);

        // modify selected foodPost
        const modButton = document.createElement('button');
        modButton.innerHTML = 'Modify';
        modButton.classList.add('cardButton');

        modButton.addEventListener('click', () => {
          const inputs = modifyFoodPostForm.querySelectorAll('input');
          inputs[0].value = foodPost.title;
          // inputs[1].value = foodPost.text;
          modifyTextarea.innerHTML = foodPost.text;
          inputs[1].value = foodPost.food_post_id;
          inputs[2].value = foodPost.status;
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

      // Adds one like to ss_rating
      clnU.addEventListener('click', async (evt) => {
        const addLike = foodPost.likes + 1;
        const inputs = addLikesForm.querySelectorAll('input');
        inputs[0].value = foodPost.food_post_id;
        inputs[1].value = addLike;
        inputs[2].value = foodPost.dislikes;

        const data = serializeJson(addLikesForm);
        console.log('modify rating func after add', data);

        const fetchOptions = {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
          },
          body: JSON.stringify(data),
        };
        const response = await fetch(url + '/rating', fetchOptions);
        const json = await response;
        console.log('add 1 like rating response', json);
        await getFoodPost();
        addLikesForm.reset();
      });

      // Adds one dislike to ss_rating
      clnD.addEventListener('click', async (evt) => {
        const addDislike = foodPost.dislikes + 1;
        const inputs = addLikesForm.querySelectorAll('input');
        inputs[0].value = foodPost.food_post_id;
        inputs[1].value = foodPost.likes;
        inputs[2].value = addDislike;

        const data = serializeJson(addLikesForm);
        console.log('modify rating func after add', data);

        const fetchOptions = {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
          },
          body: JSON.stringify(data),
        };
        const response = await fetch(url + '/rating', fetchOptions);
        const json = await response;
        console.log('add 1 like rating response', json);
        await getFoodPost();
        addLikesForm.reset();
      });
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

// login event listener
loginForm.addEventListener('submit', async (evt) => {
  evt.preventDefault();
  await login();
});

// login function
const login = async () => {
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
    userInfo.innerHTML = `You are logged in as ${json.user.username}`;
    loggedInUserId = json.user.user_id;
    await getFoodPost();
  }
  loginForm.reset();
};

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
    getFoodPost();
  } catch (e) {
    console.log(e.message);
  }
});

//When non-logged in user clicks on "create new user", the form for submitting new users shows up
addUserPage.addEventListener('click', async (evt) => {
  evt.preventDefault();
  addUserContainer.style.display = 'flex';
  addUserPage.style.display = 'none';
  addLoginFormButton.style.display = 'none';

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
  addLoginFormButton.style.display = 'block';
  addUserForm.reset();
});

//Used to hide login-form-container when clicking "cancel" button in the "Log in" card
loginCancel.addEventListener('click', async (evt) => {
  evt.preventDefault();
  loginFormContainer.style.display = 'none';
  addLoginFormButton.style.display = 'block';
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
  addLoginFormButton.style.display = 'block';
  // login with the newly registered user
  const loginInputs = loginForm.querySelectorAll('input');
  const registerInputs = addUserForm.querySelectorAll('input');
  loginInputs[0].value = registerInputs[1].value;
  loginInputs[1].value = registerInputs[2].value;
  await login();
  addLoginFormButton.style.display = 'none';
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
  // add user id (hidden) to the add foodPost form
  addUser.value = loggedInUserId;

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
  loginFormContainer.style.display = 'flex';
  addLoginFormButton.style.display = 'none';
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
  // if the private checkbox in the add food post form is unchecked, the status
  // value is public
  if (fd.get('status') == null) {
    fd.set('status', 'public');
  }
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
  await addRating(json.food_post_id);
  getFoodPost();
  addForm.reset();
});

// Creates new ratings row to ss_ratings
const addRating = async (post_id) => {
  const inputs = addLikesForm.querySelectorAll('input');
  inputs[0].value = post_id;
  const fd = new FormData(addLikesForm);
  const fetchOptions = {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
    },
    body: fd,
  };
  const response = await fetch(url + '/rating', fetchOptions);
  const json = await response;
  console.log('add rating response', json);
};

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

// when private checkbox is clicked in modify food post form, its value changes
modifyPostCheckBox.addEventListener('click', async (evt) => {
  if (modifyPostCheckBox.checked) {
    modifyPostCheckBox.value = 'private';
  } else {
    modifyPostCheckBox.value = 'public';
  }
});

// close modal
close.addEventListener('click', (evt) => {
  evt.preventDefault();
  imageModal.classList.toggle('hide');
});