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
    logout.innerHTML = 'x';

    const user = document.createElement('div');
    user.setAttribute('id', 'userWrap');
    user.appendChild(username);
    user.appendChild(logout);

    accWrap.appendChild(user)

    console.log('s')

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

  if (signin) {
    signin.addEventListener('click', () => {
      acc(1, path)
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