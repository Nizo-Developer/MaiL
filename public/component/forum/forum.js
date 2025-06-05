import { loadAcc } from "../../src/js/lib/authing.js";
import { loadPage } from "../../src/js/lib/opg.js";
import { readingToken } from "../../src/js/module/module.mjs";
import { postForum } from "../../src/js/module/storage.mjs";
import { envelopeResponsive, nav, searchEnvelope } from "../envelope/envelope.js";

let forumTitle;
let forumType;
let isCreatePanel = 0;

export function forumLoad() {
  const style = document.querySelector('#styleOpg');
  const script = document.querySelector('#scriptOpg');
  
  style.href = './component/forum/forum.css';
  
  script.src = './component/forum/forum.js';

  const main = document.querySelector('.main');
  main.innerHTML = `
    <div class="acc-container"></div>
    <div class="container">
      <div class="content">
        <div class="head">
          <div class="title">
            Forum
          </div>
          <div class="action">
            <div id="createBtn">
              <img src="./asset/plus.svg" alt="plus" id="action" height="10">
              <span>Create</span>
            </div>
          </div>
        </div>
        <div class="forum-list"></div>
      </div>
    </div>
  `;

  const createBtn = document.querySelector('#createBtn');
  const form = document.querySelector('form');

  forumTitle = document.querySelector('#forumTitle');
  forumType = document.querySelector('#forumType');
  
  createBtn.addEventListener('click', createPanel);
  form.addEventListener('submit', createForum);
  
  console.log(isCreatePanel);
  (async () => {
    
    await loadAcc();
    
    const auth = await readingToken();
    
    if (!auth) {
      loadPage(1)
    }
    
  })();
}

function createPanel() {
  const panel = document.querySelector('#createForum');

  isCreatePanel = isCreatePanel + 1 % 2;
  panel.style.opacity = isCreatePanel;
  panel.style.pointerEvents = isCreatePanel == 0 ? 'none' : 'all';
}

function createForum(e) {
  e.preventDefault();

  const title = forumTitle.value;
  const type = forumType.value.toLowerCase();

  postForum(title, type);
}

