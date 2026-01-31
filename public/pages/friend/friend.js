import { loadAcc } from '../../src/js/lib/authing.js';
import { addFriend, unFriend, acceptFriend, getAllFriend } from '../../src/js/module/friend.mjs';
import { mode, portal } from '../../src/js/lib/tool.js';
import { readingToken } from '../../src/js/module/module.mjs';
import { loadPage } from '../../src/js/lib/opg.js';
import { CPATH } from '../../src/js/lib/path.js';



export function friendLoad() {
  const style = document.querySelector('#styleOpg');
  const script = document.querySelector('#scriptOpg');
  const main = document.querySelector('.main');

  style.href = CPATH.page + '/friend/friend.css';

  script.src = CPATH.page + '/friend/friend.js';

  main.innerHTML = `
    <div class="acc-container"></div>
    <div class="add">
      <form id="add-friend">
        <div class="input-label">
          <input type="text" name="username" placeholder=" " id="username" autocomplete="off">
          <label for="username">Add Friend</label>
        </div>
        <button type="submit">Add Friend</button>
      </form>
    </div>
    <div class="page-wrapper">
      <div class="friends">
        <div class="btn">
          <div class="flex">
            <span id="count"></span>
            <p><span>Friend </span>List</p>
          </div>
          <div class="line"></div>
        </div>
      </div>
      <div class="friend-ongoing">
        <div class="btn">
          <div class="flex">
            <span id="count"></span>
            <p>Ongoing <span>Request</span></p>
          </div>
          <div class="line"></div>
        </div>
      </div>
      <div class="friend-pending">
        <div class="btn">
          <div class="flex">
            <span id="count"></span>
            <p>Pending <span>Request</span></p>
          </div>
          <div class="line"></div>
        </div>
      </div>
    </div>
    <div class="friend-list"></div>
  `;

  const home = document.querySelector('#home');
  const friendList = document.querySelector('.friend-list');

  if (!localStorage.getItem('pageId')) {
    localStorage.setItem('pageId', 1);
  }

  const pageId = parseInt(localStorage.getItem('pageId'));

  const form = document.querySelector('#add-friend');
  const friendListBtn = document.querySelector('.friends .btn');
  console.log(friendListBtn)
  const onGoingBtn = document.querySelector('.friend-ongoing .btn');
  const pendingBtn = document.querySelector('.friend-pending .btn');

  const count = document.querySelectorAll('#count');

  if (pageId == 1) {
    friendListBtn.classList.add('btn-active');
  } else if (pageId == 2) {
    onGoingBtn.classList.add('btn-active');
  } else if (pageId == 3) {
    pendingBtn.classList.add('btn-active');
  }
  
  (async () => {
    
    const auth = await readingToken();
    
    if (!auth) {
      loadPage(1)
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

    window.addEventListener('resize', friendResponsive);
    window.addEventListener('mousemove', friendResponsive);
    friendResponsive();
    
    
    form.addEventListener('submit', follow);
  })()
}

function friendResponsive() {
  if (check()) {
    return
  }

  if (window.innerWidth > 540) {
    localStorage.setItem('mode', false);
  } else {
    localStorage.setItem('mode', true);
  }
}

function check() {
  if (localStorage.getItem('onPage') !== '2') {
    console.log('pagee')
    window.removeEventListener('resize', friendResponsive);
    window.removeEventListener('mousemove', friendResponsive);
    return true
  }

  return false
}

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

window.l = loadList
window.s = getAllFriend

async function loadList() {
  const pageId = localStorage.getItem('pageId');

  console.log('a')

  if (localStorage.getItem('loadFriendList') || localStorage.getItem('onPage') != '2') {
    return
  }

  localStorage.setItem('loadFriendList', 1);

  const friendList = document.querySelector('.friend-list');

  const data = await getAllFriend();
  count[0].innerHTML = `( ${data.lengthData} )`;
  const dataOnGoing = await getAllFriend(undefined, 2);
  count[1].innerHTML = `( ${dataOnGoing.lengthData} )`;
  const dataPending = await getAllFriend(undefined, 3);
  count[2].innerHTML = `( ${dataPending.lengthData} )`;

  friendList.style.removeProperty('flex');
  friendList.style.removeProperty('align-items');
  friendList.style.removeProperty('justify-content');

  console.log(data, dataOnGoing, dataPending, pageId)
  console.log('b')

  friendList.innerHTML = ''

  if (data && pageId == 1) {
    console.log('a')
    const userData = Object.values(data.friend);

    console.log(userData)

    if (userData.length > 0) {
      userData.forEach((user, index) => {
        friendList.innerHTML += `
        <div class="friend">
          <div class="friend-profile">
            <div class="frame">
              <img src="${user.photoprofile}">
            </div>
            <div id="name" name-id="${index}">${user.username}</div>
          </div>
          <div class="option">
            <div id="unfriend" x-data="${index}">
              <img src="./asset/unfriend.svg" alt="unfriend" height="15">
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
              <img src="./asset/addfriend.svg" alt="addfriend" height="15">
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

  localStorage.removeItem('loadFriendList');

  return
}