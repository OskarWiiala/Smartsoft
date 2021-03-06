'use strict';

// change url when uploading to server
const url = 'https://localhost:8000';

// select existing html elements
const ul = document.querySelector('#foodPostCardsList');
const addFoodPostForm = document.querySelector('#addFoodPostForm');
const loginForm = document.querySelector('#login-form');
const logoutButton = document.querySelector('#logoutButton');
const userInfo = document.querySelector('#user-info');
const profilePageButton = document.querySelector('#profilePageButton');
const homePageButton = document.querySelector('#homePageButton');
const loginButton = document.querySelector('#navigationLoginButton');
const registerButton = document.querySelector('#registerButton');
const addUserForm = document.querySelector('#add-user-form');
const addPostButton = document.querySelector('#addPostButton');
const addUserContainer = document.querySelector('.add-user-form-container');
const loginFormContainer = document.querySelector('.login-form-container');
const cancelUser = document.querySelector('#addUserCancel');
const loginCancel = document.querySelector('#loginCancel');
const postContainer = document.querySelector('.post-container');
const cancelPost = document.querySelector('.cancel-post');
const addUser = document.querySelector('.add-user');
const modifyFoodPostForm = document.querySelector('#modifyFoodPostForm');
const modifyContainer = document.querySelector('.modify-container');
const modifyTextarea = document.querySelector('#modifyText');
const cancelModifyPost = document.querySelector('.cancel-modify-post');
const iconU = document.querySelector('.btnTu');
const iconD = document.querySelector('.btnTd');
const modifyPostCheckBox = document.querySelector('#modifyPostCheckbox');
const addLikesForm = document.querySelector('#add-like-form');
const imageModal = document.querySelector('#image-modal');
const modalImage = document.querySelector('#image-modal img');
const close = document.querySelector('#image-modal a');
const newPostText = document.querySelector('#newPostText');
const searchForm = document.querySelector('#searchForm');
const searchInput = document.querySelector('#mainSearchInputField');
const searchSelect = document.querySelector('#searchSelect');
const myPostsHeader = document.querySelector('#MyPostsHeader');
const searchResultsHeader = document.querySelector('#SearchResultsHeader');
const top10Button = document.querySelector('#topButton');
const nameInput = document.querySelector('#addUserUsername');
const emailInput = document.querySelector('#addUserEmail');
const privateSearchResults = document.querySelector('#SearchResultsPrivate');
const toggleMiddleButton = document.querySelector('#toggleMiddleButton');
const middle = document.querySelector('.middle');

// variables for currently logged in user's id and status
let loggedInUserId = null;
let loggedInUserStatus = null;

// create foodPost cards
const createFoodPostCards = (recipes) => {
  // clear ul
  ul.innerHTML = '';
  // if the my profile button is not displayed, meaning the my profile page is
  // opened, only the user's own food posts are displayed
  if (profilePageButton.style.display === 'none' && loggedInUserId != null) {
    recipes.forEach((foodPost) => {
      if (loggedInUserId === foodPost.user) {
        createCardContent(foodPost);
      }
    });
  } else {
    recipes.forEach((foodPost) => {
      if (foodPost.status === 'public') {
        createCardContent(foodPost);
      }
    });
  }
};

const createCardContent = async (foodPost) => {
  // create li with DOM methods
  const img = document.createElement('img');
  img.src = url + '/thumbnails/' + foodPost.filename;
  img.alt = foodPost.title;
  img.classList.add('resp');

  // open large image when clicking image
  img.addEventListener('click', () => {
    modalImage.src = url + '/' + foodPost.filename;
    modalImage.classList.add('modalImageClass');
    imageModal.alt = foodPost.title;
    imageModal.classList.toggle('hide');
  });

  const figure = document.createElement('figure').appendChild(img);

  const user = document.createElement('h4');
  if (foodPost.status === 'private') {
    user.innerHTML = `${foodPost.username} (${foodPost.status})`;
  } else {
    user.innerHTML = foodPost.username;
  }

  user.classList.add('cardUserHeader');

  const h2 = document.createElement('h2');
  h2.innerHTML = foodPost.title;
  h2.classList.add('cardh2');

  const p1 = document.createElement('article');
  p1.innerHTML = `${foodPost.text}`;
  p1.classList.add('cardRecipe');
  p1.style = 'white-space: pre-line';
  p1.readOnly = true;

  const btnDiv = document.createElement('div');
  btnDiv.classList.add('btnDiv');

  const cardButtonDiv = document.createElement('div');
  cardButtonDiv.classList.add('cardButtonDiv');

  const likes = document.createElement('likes');
  likes.innerHTML = `${foodPost.likes}`;
  likes.classList.add('likes');

  const dislikes = document.createElement('dislikes');
  dislikes.innerHTML = `${foodPost.dislikes}`;
  dislikes.classList.add('dislikes');

  const clnU = iconU.cloneNode(true);
  const clnD = iconD.cloneNode(true);

  const card = document.createElement('card');
  card.classList.add('roundEdge');
  card.classList.add('cardImage');
  card.appendChild(user);
  card.appendChild(h2);
  card.appendChild(figure);
  card.appendChild(p1);
  card.appendChild(btnDiv);
  btnDiv.appendChild(clnU);
  btnDiv.appendChild(likes);
  btnDiv.appendChild(clnD);
  btnDiv.appendChild(dislikes);
  btnDiv.appendChild(cardButtonDiv);
  ul.appendChild(card);

  // Adds one like to ss_rating
  if (loggedInUserId != null) {
    clnU.addEventListener('click', async () => {

      // This disables button
      iconU.disabled = true;
      console.log('iconU is disabled');

      const likes = foodPost.likes;
      const inputs = addLikesForm.querySelectorAll('input');
      inputs[0].value = foodPost.food_post_id;
      inputs[1].value = likes + 1;
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
      // buttonDisabler creates 3 second delay, then button is operational again
      await buttonDisabler();
    });
  }

  // Adds one dislike to ss_rating
  if (loggedInUserId != null) {
    clnD.addEventListener('click', async () => {

      // This disables button
      iconD.disabled = true;
      console.log('iconD is disabled');

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
      // buttonDisabler creates 3 second delay, then button is operational again
      await buttonDisabler();
    });
  }
  // if the logged in user id matches the foodPost user id, or the logged in user's
  // status is admin, the delete and modify buttons will be created
  if (loggedInUserId === foodPost.user || loggedInUserStatus === 'admin') {
    await createDeleteModifyButtons(foodPost, card, cardButtonDiv);
  }
};

// function for creating delete and modify buttons to food post cards
const createDeleteModifyButtons = async (foodPost, card, cardButtonDiv) => {
  // delete button
  const delButton = document.createElement('button');
  delButton.innerHTML = 'Delete';
  delButton.classList.add('cardButton');

  delButton.addEventListener('click', async () => {
    if (confirm(`Are you sure you want to delete "${foodPost.title}"`)) {
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
        await getFoodPost();
      } catch (e) {
        console.log(e.message);
      }
    }
  });

  cardButtonDiv.appendChild(delButton);

  // modify button
  const modButton = document.createElement('button');
  modButton.innerHTML = 'Modify';
  modButton.classList.add('cardButton');

  modButton.addEventListener('click', () => {
    const inputs = modifyFoodPostForm.querySelectorAll('input');
    inputs[0].value = foodPost.title;
    modifyTextarea.innerHTML = foodPost.text;
    inputs[1].value = foodPost.food_post_id;
    inputs[2].value = foodPost.status;
    if (foodPost.status === 'private') {
      modifyPostCheckBox.checked = true;
    }
    // certain elements are hidden/displayed according to what button was clicked
    modifyContainer.style.display = 'flex';
    postContainer.style.display = 'none';
    addFoodPostForm.reset();

    //This scrolls the page to the top
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });
  });
  cardButtonDiv.appendChild(modButton);
};

// returns disabled icon buttons back to operational
const buttonDisabler = async () => {
  // this undo button disables
  const unDis = async () => {
    iconU.disabled = false;
    iconD.disabled = false;
    console.log('iconU or iconD are no longer disabled');
    getFoodPost();
    stopTimer();
  };

  // This sets 3 seconds timer
  const Timer = setInterval(unDis, 3000);

  // This stops timer from repeating itself
  const stopTimer = async () => {
    clearInterval(Timer);
    console.log('disable timer stopped');
  };
};

// function for fetching the food posts from server
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
    createFoodPostCards(recipes.reverse());
  } catch (e) {
    console.log(e.message);
  }
};

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
    // certain elements are hidden/displayed according to what button was clicked
    loginFormContainer.style.display = 'none';
    logoutButton.style.display = 'block';
    profilePageButton.style.display = 'block';
    registerButton.style.display = 'none';
    addPostButton.style.display = 'block';
    top10Button.style.display = 'block';
    loggedInUserId = json.user.user_id;
    loggedInUserStatus = json.user.status;
    if (loggedInUserStatus === 'admin') {
      userInfo.innerHTML = `You are logged in as ${json.user.username} (ADMIN)`;
    } else {
      userInfo.innerHTML = `You are logged in as ${json.user.username}`;
    }
    await getFoodPost();
  }
  loginForm.reset();
};

// logout function
logoutButton.addEventListener('click', async () => {
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
    userInfo.innerHTML = ``;
    // certain elements are hidden/displayed according to what button was clicked
    logoutButton.style.display = 'none';
    profilePageButton.style.display = 'none';
    registerButton.style.display = 'block';
    loginButton.style.display = 'block';
    postContainer.style.display = 'none';
    modifyContainer.style.display = 'none';
    myPostsHeader.style.display = 'none';
    homePageButton.style.display = 'none';
    postContainer.style.display = 'none';
    modifyContainer.style.display = 'none';
    loggedInUserId = null;
    loggedInUserStatus = null;
    addFoodPostForm.reset();
    modifyFoodPostForm.reset();
    await getFoodPost();
  } catch (e) {
    console.log(e.message);
  }
});

// when non-logged in user clicks on "create new user", the form for submitting new users shows up
registerButton.addEventListener('click', async () => {
  // certain elements are hidden/displayed according to what button was clicked
  addUserContainer.style.display = 'flex';
  registerButton.style.display = 'none';
  loginButton.style.display = 'none';
  addPostButton.style.display = 'none';
  top10Button.style.display = 'none';

  //This scrolls the page to the top
  window.scroll({
    top: 0,
    left: 0,
    behavior: 'smooth',
  });
});

//Used to hide add-user-form-container when clicking "cancel" button in the "create new user" card
cancelUser.addEventListener('click', async () => {
  // certain elements are hidden/displayed according to what button was clicked
  addUserContainer.style.display = 'none';
  registerButton.style.display = 'block';
  loginButton.style.display = 'block';
  addPostButton.style.display = 'block';
  top10Button.style.display = 'block';
  addUserForm.reset();
});

//Used to hide login-form-container when clicking "cancel" button in the "Log in" card
loginCancel.addEventListener('click', async () => {
  // certain elements are hidden/displayed according to what button was clicked
  loginFormContainer.style.display = 'none';
  loginButton.style.display = 'block';
  registerButton.style.display = 'block';
  addPostButton.style.display = 'block';
  top10Button.style.display = 'block';
  loginForm.reset();
});

// submit register form
addUserForm.addEventListener('submit', async (evt) => {
  evt.preventDefault();

  // checks if username that new user is trying to give is already in use
  const response = await fetch(
      url + '/foodpost/username/' + nameInput.value);
  const json = await response.json();
  const usernames = await json;

  if (usernames.length !== 0) {
    alert('Name already in use! Try a another one');
  } else {

    // checks if email that new user is trying to give is already in use
    const response = await fetch(
        url + '/foodpost/email/' + emailInput.value);
    const json = await response.json();
    const emails = await json;

    if (emails.length !== 0) {
      alert('Email already in use! Try a another one');
    } else {

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
      // certain elements are hidden/displayed according to what button was clicked
      addUserContainer.style.display = 'none';
      registerButton.style.display = 'block';
      loginButton.style.display = 'block';
      loginButton.style.display = 'none';
      addPostButton.style.display = 'block';
      top10Button.style.display = 'block';
      // login with the newly registered user
      const loginInputs = loginForm.querySelectorAll('input');
      const registerInputs = addUserForm.querySelectorAll('input');
      loginInputs[0].value = registerInputs[1].value;
      loginInputs[1].value = registerInputs[2].value;
      await login();
      addUserForm.reset();
    }
  }
});

// when the my profile button is pressed, the my profile content appears
profilePageButton.addEventListener('click', async () => {
  // certain elements are hidden/displayed according to what button was clicked
  profilePageButton.style.display = 'none';
  homePageButton.style.display = 'block';
  myPostsHeader.style.display = 'block';
  searchResultsHeader.style.display = 'none';
  postContainer.style.display = 'none';
  addPostButton.style.display = 'block';
  modifyContainer.style.display = 'none';
  top10Button.style.display = 'block';
  await getFoodPost();

  //This scrolls the page to the top
  window.scroll({
    top: 0,
    left: 0,
    behavior: 'smooth',
  });
});

// when the home page button is pressed, it disappears and the home page appears
homePageButton.addEventListener('click', async () => {
  homePageButton.style.display = 'none';
  if (loggedInUserId != null) {
    profilePageButton.style.display = 'block';
  }
  // certain elements are hidden/displayed according to what button was clicked
  addPostButton.style.display = 'block';
  myPostsHeader.style.display = 'none';
  searchResultsHeader.style.display = 'none';
  postContainer.style.display = 'none';
  modifyContainer.style.display = 'none';
  top10Button.style.display = 'block';
  addFoodPostForm.reset();
  modifyFoodPostForm.reset();
  await getFoodPost();

  //This scrolls the page to the top
  window.scroll({
    top: 0,
    left: 0,
    behavior: 'smooth',
  });
});

//Used to display post-container when clicking "create new post" button in the navigation
addPostButton.addEventListener('click', async () => {
  if (loggedInUserId != null) {
    postContainer.style.display = 'flex';
    addPostButton.style.display = 'none';
    modifyContainer.style.display = 'none';
    // add user id (hidden) to the add foodPost form
    addUser.value = loggedInUserId;

    //This scrolls the page to the top
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });
  } else {
    alert('You must log in to add a post!');
  }
});

// Checks the character count of the textarea when adding a food post
const addPostTextCount = document.querySelector('#character-count-add-post');
newPostText.addEventListener('input', async (evt) => {
  evt.preventDefault();
  addPostTextCount.textContent = `${evt.target.value.length}/${newPostText.maxLength}`;
});

//Used to display login-form-container when clicking "Log in" button in the navigation
loginButton.addEventListener('click', async () => {
  // certain elements are hidden/displayed according to what button was clicked
  loginFormContainer.style.display = 'flex';
  loginButton.style.display = 'none';
  registerButton.style.display = 'none';
  addPostButton.style.display = 'none';
  top10Button.style.display = 'none';

  //This scrolls the page to the top
  window.scroll({
    top: 0,
    left: 0,
    behavior: 'smooth',
  });
});

//Used to hide post-container when clicking "cancel" button in the "add new food post" card
cancelPost.addEventListener('click', async () => {
  postContainer.style.display = 'none';
  addPostButton.style.display = 'block';
  addFoodPostForm.reset();
});

// This is for the hide menu/show menu button in the sticky navigation section on top of the page
toggleMiddleButton.addEventListener('click', async () => {
  if (middle.style.display !== 'none') {
    middle.style.display = 'none';
    toggleMiddleButton.innerHTML = 'Show menu';
  } else {
    middle.style.display = 'flex';
    toggleMiddleButton.innerHTML = 'Hide menu';
  }
});

// submit add foodPost form
addFoodPostForm.addEventListener('submit', async (evt) => {
  evt.preventDefault();
  const fd = new FormData(addFoodPostForm);
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
  // certain elements are hidden/displayed according to what button was clicked
  postContainer.style.display = 'none';
  addPostButton.style.display = 'block';
  await addRating(json.food_post_id);
  await getFoodPost();
  addFoodPostForm.reset();
});

// creates new ratings row to ss_ratings when user creates new post
const addRating = async (post_id) => {
  // this checks food_post_id and adds it in ss_rating, to connect right posts and ratings
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

// Checks the character count of the textarea when modifying a food post
const modifyPostTextCount = document.querySelector(
    '#character-count-modify-post');
modifyTextarea.addEventListener('input', async (evt) => {
  evt.preventDefault();
  modifyPostTextCount.textContent = `${evt.target.value.length}/${modifyTextarea.maxLength}`;
});

//Used to hide modify-container when clicking "cancel" button in the "modify food post" form
cancelModifyPost.addEventListener('click', async () => {
  modifyContainer.style.display = 'none';
  modifyFoodPostForm.reset();
});

// when private checkbox is clicked in modify food post form, its value changes
modifyPostCheckBox.addEventListener('click', async () => {
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

// search title or username equal or partly equal to users input
searchForm.addEventListener('submit', async (evt) => {
  evt.preventDefault();

  if (searchSelect.value === 'title') {
    try {
      // this gets array of titles that match users search
      const response = await fetch(
          url + '/foodpost/title/' + searchInput.value);
      const json = await response.json();
      const recipes = await json;

      // if title array is empty, user is notified
      if (recipes.length === 0) {
        alert('Sorry, no results');
        searchResultsHeader.style.display = 'none';
        await getFoodPost();
      } else {
        // certain elements are hidden/displayed according to what button was clicked
        myPostsHeader.style.display = 'none';
        searchResultsHeader.style.display = 'block';
        homePageButton.style.display = 'block';
        if (loggedInUserId != null) {
        profilePageButton.style.display = 'block'}
      }

      // Checks each post, so that if they have a private status, user gets info that some results are hidden.
      recipes.forEach((foodPost) => {
        if (foodPost.status === 'private') {
          privateSearchResults.style.display = 'block';
        }
      });

      createFoodPostCards(recipes);
    } catch (e) {
      console.log(e.message);
    }
  } else {

    try {
      // this gets array of usernames that match users search
      const response = await fetch(
          url + '/foodpost/username/' + searchInput.value);
      const json = await response.json();
      const recipes = await json;

      // if username array is empty, user is notified
      if (recipes.length === 0) {
        alert('Sorry, no results');
        searchResultsHeader.style.display = 'none';
        await getFoodPost();
      } else {
        // certain elements are hidden/displayed according to what button was clicked
        myPostsHeader.style.display = 'none';
        searchResultsHeader.style.display = 'block';
        homePageButton.style.display = 'block';
        profilePageButton.style.display = 'block';
      }

      // Checks each post, so that if they have a private status, user gets info that some results are hidden.
      recipes.forEach((foodPost) => {
        if (foodPost.status === 'private') {
          privateSearchResults.style.display = 'block';
        }
      });

      createFoodPostCards(recipes);
    } catch (e) {
      console.log(e.message);
    }
  }
});

// button that shows posts in most liked order
top10Button.addEventListener('click', async () => {
  try {
    const response = await fetch(
        url + '/rating/top/top');
    const json = await response.json();
    const recipes = await json;

    if (recipes.length === 0) {
      alert('Sorry, no results');
      searchResultsHeader.style.display = 'none';
      await getFoodPost();
    } else {
      // certain elements are hidden/displayed according to what button was clicked
      myPostsHeader.style.display = 'none';
      searchResultsHeader.style.display = 'block';
      homePageButton.style.display = 'block';
      top10Button.style.display = 'none';
      modifyContainer.style.display = 'none';
      postContainer.style.display = 'none';
      addFoodPostForm.reset();
    }

    // Checks each post, so that if they have a private status, user gets info that some results are hidden.
    recipes.forEach((rating) => {
      if (rating.status === 'private') {
        privateSearchResults.style.display = 'block';
      }
    });

    createFoodPostCards(recipes);
  } catch (e) {
    console.log(e.message);
  }
});

// when loading the page the foodPosts will be fetched
getFoodPost();