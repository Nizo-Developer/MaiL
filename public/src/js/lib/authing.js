import { toggleProfile } from '../../../component/profile-part/profile.js';
import { readingToken } from '../module/module.mjs';


export async function loadAcc(path = './') {
  const accWrap = document.querySelector('.acc-container');
  const account = await readingToken();
  console.log(account)

  if (account && localStorage.getItem('token')) {
    const username = document.createElement('div')
    username.setAttribute('class', 'account');
    username.setAttribute('id', 'user');
    username.innerHTML = `<img src="${path}asset/user.svg" height="15">` + account.username;

    const logout = document.createElement('div');
    logout.setAttribute('id', 'logout');
    logout.textContent = 'x';

    const user = document.createElement('div');
    user.setAttribute('id', 'userWrap');
    user.appendChild(username);
    user.appendChild(logout);

    accWrap.appendChild(user)

    const profilePhoto = document.querySelector('.photo-frame > img');
    const profileName = document.querySelector('.user-info > .user-username');

    profilePhoto.src = account.photoprofile;
    profileName.textContent = account.username;

  } else {
    const secRight = document.createElement('div');
    secRight.setAttribute('class', 'section-right');

    const btnWrap = document.createElement('div');
    btnWrap.setAttribute('class', 'acc-button');

    const signin = document.createElement('button');
    signin.setAttribute('class', 'account');
    signin.setAttribute('id', 'signin');
    signin.innerHTML = 'Login';

    btnWrap.appendChild(signin);
    secRight.appendChild(btnWrap);
    accWrap.appendChild(secRight);
  }

  const signin = document.getElementById('signin');
  const profile = document.querySelector('#user');
  const photoProfile = document.querySelector('.photo-frame > img').src;

  localStorage.setItem('pp', photoProfile)

  if (signin) {
    console.log('h')
    signin.addEventListener('click', () => {
      acc(1, path);
    });
  } else { 
    profile.addEventListener('click', () => {
      toggleProfile(undefined, 1);
    }); 
  }

  defineLogout()
}

export function defineLogout() {
  if (localStorage.getItem('token')) {
    const out = document.getElementById('logout');
  
    out.addEventListener('click', logout);
  }
}

export function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('userId');
  console.log('a')

  setTimeout(() => {
    window.location.reload()
  }, 300);
}

function acc(id, path) {
  if (id == 1) {
    window.location.href = `${path}auth/login.html`
  } else if (id == 2) {
    window.location.href = `${path}auth/signup.html`
  }
}