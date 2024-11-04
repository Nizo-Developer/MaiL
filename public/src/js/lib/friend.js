import { loadAcc } from './authing.js';
import { readingToken } from '../module/module.mjs';
import { getAllFriend, addFriend, unFriend, acceptFriend } from '../module/friend.mjs'
import { portal } from './tool.js';

const home = document.querySelector('#home');
const add = document.querySelector('.add');
const page = document.querySelector('.page-wrapper');
const friendList = document.querySelector('.friend-list');

document.addEventListener('DOMContentLoaded', () => {
  
  if (!localStorage.getItem('pageId')) {
    localStorage.setItem('pageId', 1);
  }

  const pageId = parseInt(localStorage.getItem('pageId'));
  
  (async () => {
    
    await loadAcc('../');
    
    const auth = await readingToken();
    
    if (!auth) {
      portal();
    }

    add.innerHTML += auth ? `<form id="add-friend">
      <div class="input-label">
        <input type="text" name="username" placeholder=" " id="username" autocomplete="off">
        <label for="username">Add Friend</label>
      </div>
      <button type="submit">Add Friend</button>
      </form>
      ` : '';
      page.innerHTML += auth ? `
      <div class="friends">
        <div class="btn">
          <div class="flex">
            <span id="count"></span>
            Friend List
          </div>
          <div class="line"></div>
        </div>
      </div>
      <div class="friend-ongoing">
        <div class="btn">
          <div class="flex">
            <span id="count"></span>
            Ongoing Request
          </div>
          <div class="line"></div>
        </div>
      </div>
      <div class="friend-pending">
        <div class="btn">
          <div class="flex">
            <span id="count"></span>
            Pending Request
          </div>
          <div class="line"></div>
        </div>
      </div>
    ` : '';
    
    const form = document.querySelector('#add-friend');
    const friendListBtn = document.querySelector('.friends .btn');
    const onGoingBtn = document.querySelector('.friend-ongoing .btn');
    const pendingBtn = document.querySelector('.friend-pending .btn');

    const count = document.querySelectorAll('#count');
    const pageId = parseInt(localStorage.getItem('pageId'));

    if (pageId == 1) {
      friendListBtn.classList.add('btn-active');
    } else if (pageId == 2) {
      onGoingBtn.classList.add('btn-active');
    } else if (pageId == 3) {
      pendingBtn.classList.add('btn-active');
    }
    
    if (auth) {

      await loadList();

    } else {
      console.log('c')
      friendList.innerHTML = 'You should Login to use this Feature'
    }

    friendListBtn.addEventListener('click', () => {
      const page = parseInt(localStorage.getItem('pageId'));
      if (page !== 1) {
        localStorage.setItem('pageId', 1);
        friendListBtn.classList.add('btn-active');
        onGoingBtn.classList.remove('btn-active');
        pendingBtn.classList.remove('btn-active');

        loadList();
      }
    });
    onGoingBtn.addEventListener('click', () => {
      const page = parseInt(localStorage.getItem('pageId'));
      if (page !== 2) {
        localStorage.setItem('pageId', 2);
        onGoingBtn.classList.add('btn-active');
        friendListBtn.classList.remove('btn-active');
        pendingBtn.classList.remove('btn-active');

        loadList();
      }
    });
    pendingBtn.addEventListener('click', () => {
      const page = parseInt(localStorage.getItem('pageId'));
      if (page !== 3) {
        localStorage.setItem('pageId', 3);
        pendingBtn.classList.add('btn-active');
        onGoingBtn.classList.remove('btn-active');
        friendListBtn.classList.remove('btn-active');

        loadList();
      }
    });
    
    home.addEventListener('click', () => {
      portal();
    });
    envelope.addEventListener('click', () => {
      window.location.href = '../envelope'
    });
    form.addEventListener('submit', follow);
  })()
});

async function follow(event) {
  event.preventDefault();

  const username = document.querySelector('#username');
  if (username.value) {
    await addFriend(username.value);
    window.location.reload();
  }

}

async function unfollow(event) {
  const username = document.querySelector(`#name[name-id="${event.srcElement.attributes[1].value}"]`)
  await unFriend(username.innerHTML);

  window.location.reload();
}

async function acceptfriend(event) {
  const username = document.querySelector(`#name[name-id="${event.srcElement.attributes[1].value}"]`)
  await acceptFriend(username.innerHTML);

  window.location.reload();
}

async function loadList() {
  const pageId = localStorage.getItem('pageId');

  friendList.innerHTML = '';

  const data = await getAllFriend();
  count[0].innerHTML = `( ${data.lengthData} )`;
  const dataOnGoing = await getAllFriend(undefined, 2);
  count[1].innerHTML = `( ${dataOnGoing.lengthData} )`;
  const dataPending = await getAllFriend(undefined, 3);
  count[2].innerHTML = `( ${dataPending.lengthData} )`;

  friendList.style.removeProperty('flex');
  friendList.style.removeProperty('align-items');
  friendList.style.removeProperty('justify-content');

  if (data && pageId == 1) {
    console.log('a')
    const userData = Object.values(data.friend);

    console.log(userData)

    if (userData.length > 0) {
      userData.forEach((user, index) => {
        friendList.innerHTML += `
        <div class="friend">
          <div id="name" name-id="${index}">${user.username}</div>
          <div class="option">
            <div id="unfriend" x-data="${index}">
              <img src="../asset/unfriend.svg" alt="home" height="15">
              Unfriend
            </div>
            <div id="info">Info</div>
          </div>
        </div>`
      });
    } else {
      friendList.style.flex = '1';
      friendList.style.alignItems = 'center';
      friendList.style.justifyContent = 'center';
      friendList.innerHTML = "You doesn't have Friend"
    }
  
  } else if (dataOnGoing && pageId == 2) {
    const userData = Object.values(dataOnGoing.friend);

    console.log(userData.length)

    if (userData.length > 0) {
      userData.forEach((user, index) => {
        friendList.innerHTML += `
        <div class="friend">
          <div id="name" name-id="${index}">${user.username}</div>
          <div class="option">
            <div id="addfriend" x-data="${index}">
              <img src="../asset/addfriend.svg" alt="addfriend" height="15">
              Accept
            </div>
            <div id="reject">Reject</div>
          </div>
        </div>`
      });
    } else {
      friendList.style.flex = '1';
      friendList.style.alignItems = 'center';
      friendList.style.justifyContent = 'center';
      friendList.innerHTML = "There's no On Going Request"
    }
  } else if (dataPending && pageId == 3) {
    const userData = Object.values(dataPending.friend);

    console.log(userData.length)

    if (userData.length > 0) {
      userData.forEach((user, index) => {
        friendList.innerHTML += `
        <div class="friend">
          <div id="name" name-id="${index}">${user.username}</div>
          <div class="option">
            <div class="pending">Pending</div>
          </div>
        </div>`
      });
    } else {
      friendList.style.flex = '1';
      friendList.style.alignItems = 'center';
      friendList.style.justifyContent = 'center';
      friendList.innerHTML = "There's no Pending Request"
    }
  }

  const unfriend = document.querySelectorAll('#unfriend');
  const accfriend = document.querySelectorAll('#addfriend');

  if (unfriend) {
    unfriend.forEach(ufbutton => {
      ufbutton.addEventListener('click', unfollow)
    });
  }

  if (accfriend) {
    accfriend.forEach(afbutton => {
      afbutton.addEventListener('click', acceptfriend)
    });
  }

  return
}