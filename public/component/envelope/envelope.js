import { loadAcc } from "../../src/js/lib/authing.js";
import { loadPage } from "../../src/js/lib/opg.js";
import { editMessage } from "../../src/js/lib/tool.js";
import { checkUser, getAllMessage, readingToken } from "../../src/js/module/module.mjs";
import { getAllSharedMessage } from "../../src/js/module/share.mjs";
import { toggleShare } from "../share-part/share.js";

export function envelopeLoad() {
  const style = document.querySelector('#styleOpg');
  const script = document.querySelector('#scriptOpg');
  const main = document.querySelector('.main');
  
  style.href = './component/envelope/envelope.css';
  
  script.src = './component/envelope/envelope.js';
  
  main.innerHTML = `
    <div class="acc-container"></div>
    <div class="sidebar-background"></div>
    <div class="head">
      <div class="top">
        <div class="title">Envelope <span id="count"></span></div>
        <div class="search-wrap">
          <input type="text" id="search" placeholder=" ">
          <label for="search" class="label1">Search:</label>
        </div>
      </div>
    </div>
    <div class="page-wrapper">
      <div class="my-envelope">
        <div class="btn">
          <div class="flex">
            <span id="count"></span>
            <p><span>My </span>Envelope</p>
          </div>
          <div class="line"></div>
        </div>
      </div>
      <div class="mailing-envelope">
        <div class="btn">
          <div class="flex">
            <span id="count"></span>
            <p>Mailing <span>Envelope</span></p>
          </div>
          <div class="line"></div>
        </div>
      </div>
    </div>
    <div class="mail-wrapper">
      <div class="mail-log"></div>
      <div class="list-wrapper"></div>
    </div>
  `;
  
  if (!localStorage.getItem('enId')) {
    localStorage.setItem('enId', 1);
  }
  
  (async () => {
    
    await loadAcc();
    
    const auth = await readingToken();
    
    if (!auth) {
      loadPage(1)
    }
    
    const myEnvelope = document.querySelector('.my-envelope .btn');
    const mailing = document.querySelector('.mailing-envelope .btn');
    const search = document.querySelector('.search-wrap #search');
    
    window.addEventListener('resize', () => {
      envelopeResponsive(1);
    });
    window.addEventListener('mousemove', envelopeResponsive);
    envelopeResponsive();
    nav();
    
    myEnvelope.addEventListener('click', () => {
      nav(1)
    })
    mailing.addEventListener('click', () => {
      nav(2)
    })

    search.addEventListener('input', searchEnvelope)
  })()
}

export function envelopeResponsive(type) {
  if (check() || !type) {
    return
  }
  
  if (window.innerWidth > 540) {
    localStorage.setItem('mode', false);
  } else {
    localStorage.setItem('mode', true);
  }
  
  const main = document.querySelector('.main');
  const mailWrapper = document.querySelector('.mail-wrapper');
  
  mailWrapper.style.maxWidth = main.getBoundingClientRect().width - 40;
}

function check() {
  if (localStorage.getItem('onPage') !== '3') {
    console.log('pagee')
    window.removeEventListener('resize', envelopeResponsive);
    window.removeEventListener('mousemove', envelopeResponsive);
    return true
  }
  
  return false
}

async function nav(type = localStorage.getItem('enId')) {
  const page = parseInt(localStorage.getItem('enId'));
  const myEnvelope = document.querySelector('.my-envelope .btn');
  const mailing = document.querySelector('.mailing-envelope .btn');
  
  if (page != type) {
    localStorage.setItem('enId', type)
  }
  myEnvelope.classList[type == 1 ? 'add' : 'remove']('btn-active');
  mailing.classList[type == 1 ? 'remove' : 'add']('btn-active');
  
  const myData = await getAllMessage();
  
  const myCount = document.querySelector('.my-envelope #count');
  myCount.textContent = String(`( ${myData.sumData} )`);
  
  const enData = await getAllSharedMessage();

  const enCount = document.querySelector('.mailing-envelope #count');
  enCount.textContent = String(`( ${enData.sumData} )`);

  const listWrapper = document.querySelector('.list-wrapper');
  listWrapper.innerHTML = ''
  mailLog(undefined, true)

  type == 1 ? loadList(myData) : loadEnvelope(enData);
}

async function loadList(data) {
  const mailWrapper = document.querySelector('.mail-wrapper');
  mailWrapper.style.removeProperty('flex-direction');
  
  try {
    console.log('yes')
    
    if (data && data.sumData > 0) {
      const listWrapper = document.querySelector('.list-wrapper');
      
      listWrapper.innerHTML = '';
      mailWrapper.style.flexDirection = 'column';
      
      const btn = document.createElement('button');
      btn.setAttribute('class', 'btn');

      Object.keys(data.message).forEach((key) => {
        listWrapper.innerHTML += `
          <div class="message">
            <div class="message-right">
              <p>#${key}</p>
              <div class="message-wrapper">
                <div class="msg listTitle"></div>
                <div class="msg listDescription"></div>
              </div>
            </div>
            <div class="button-wrapper">
              <button class="btn" id="share-list" share-id="${key}">
                share
              </button>
              <button class="btn" id="edit-list" edit-id="${key}">
                edit
              </button>
              <button class="btn" id="view-list">
                <a href="./Mail.html?id=${key}" target="_blank">view</a>
              </button>
            </div>
            </div>
        `;
      })
      

      const titleFiller = document.querySelectorAll('.listTitle');
      const descriptionFiller = document.querySelectorAll('.listDescription');
      
      Object.keys(data.message).forEach((key, index) => {
        const dataMessage = data.message[key];
        
        titleFiller[index].textContent = dataMessage.title
        descriptionFiller[index].textContent = dataMessage.description
      })

      const shareBtn = document.querySelectorAll('button[share-id]');
      const editBtn = document.querySelectorAll('button[edit-id]');

      shareBtn.forEach(e => {
        e.addEventListener('click', toggleShare)
      })
      editBtn.forEach(e => {
        e.addEventListener('click', editMessage)
      })

      
    } else {
      const validation = await checkUser();

      // You haven't get a single mail :<
      
      if (validation) {
        mailLog("You haven't create a single message yet", false)
      } else {
        mailLog("You should Login to use this Feature", false)
      }
      envelopeResponsive()
    }
  } catch (error) {
    console.log(error)
    mailLog(error.message, false)
  }
}

async function loadEnvelope(data) {
  const mailWrapper = document.querySelector('.mail-wrapper');
  mailWrapper.style.removeProperty('flex-direction');
  
  try {
    if (data && data.sumData > 0) {
      const listWrapper = document.querySelector('.list-wrapper');
      
      listWrapper.innerHTML = '';
      mailWrapper.style.flexDirection = 'column';
      
      const btn = document.createElement('button');
      btn.setAttribute('class', 'btn');

      Object.keys(data.message).forEach((key) => {
        listWrapper.innerHTML += `
          <div class="message">
            <div class="message-right">
              <p>#${key}</p>
              <div class="message-wrapper">
                <div class="msg listTitle"></div>
                <div class="msg listDescription"></div>
              </div>
            </div>
            <div class="button-wrapper">
              <button class="btn" id="view-list">
                <a href="./Mail.html?id=${key}" target="_blank">view</a>
              </button>
            </div>
            </div>
        `;
      })
      

      const titleFiller = document.querySelectorAll('.listTitle');
      const descriptionFiller = document.querySelectorAll('.listDescription');
      
      Object.keys(data.message).forEach((key, index) => {
        const dataMessage = data.message[key];
        
        titleFiller[index].textContent = dataMessage.title
        descriptionFiller[index].textContent = dataMessage.description
      })
    } else {
      const validation = await checkUser();

      // You haven't get a single mail :<
      
      if (validation) {
        mailLog("You haven't create a single message yet", false)
      } else {
        mailLog("You should Login to use this Feature", false)
      }
      envelopeResponsive()
    }
  } catch (error) {
    console.log(error)
    mailLog(error.message, false)
  }
}

function searchEnvelope() {
  const search = document.querySelector('.search-wrap #search');
  const query = search.value.toLowerCase();
  const items = document.querySelectorAll('.message');

  let isFound = false

  items.forEach(e => {
    const title = e.querySelector('.listTitle').textContent.toLowerCase();
    const description = e.querySelector('.listDescription').textContent.toLowerCase();

    if (title.includes(query) || description.includes(query)) {
      e.style.display = 'grid';
      isFound = true
    } else {
      e.style.display = 'none';
    }
  })

  mailLog('No Message Found', isFound)
}

function mailLog(message, type) {
  const mail = document.querySelector('.mail-log');

  mail.textContent = message

  if (type == true) {
    mail.style.display = 'none';
  } else if (type == false) {
    mail.style.display = 'flex'
  }
}

window.e = envelopeResponsive