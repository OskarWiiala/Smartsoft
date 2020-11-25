'use strict';
const url = 'http://localhost:3000'; // change url when uploading to server

const ul = document.querySelector('ul');

const getFoodPost = async () => {
  const response = await fetch(url + '/foodPost');
  const foodPosts = await response.json();
  for (const foodPost of foodPosts) {
    const user = await getUser(foodPost.user);
    ul.innerHTML += `
    <li>
        <h2>${foodPost.title}</h2>
        <figure>
            <img src="${foodPost.filename}" class="resp">
        </figure>
        <p>Title: ${foodPost.title}</p>
        <p>Recipe: ${foodPost.text}kg</p>
    </li>
    `;
  }
};

const getUser = async (id) => {
  const response = await fetch(url + '/user/' + id);
  const user = await response.json();
  return user;
};

getFoodPost();