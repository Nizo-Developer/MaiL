import { loadAcc } from "../../src/js/lib/authing.js";
import { loadPage } from "../../src/js/lib/opg.js";
import { CPATH } from "../../src/js/lib/path.js";
import { readingToken } from "../../src/js/module/module.mjs";
import { allForum, postForum } from "../../src/js/module/storage.mjs";
import { envelopeResponsive, nav, searchEnvelope } from "../envelope/envelope.js";

let forumTitle;
let forumType;
let isCreatePanel = 0;

export function forumLoad() {
  const style = document.querySelector('#styleOpg');
  const script = document.querySelector('#scriptOpg');
  
  style.href = CPATH.page + '/forum/forum.css';
  
  script.src = CPATH.page + '/forum/forum.js';

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
            <div id="openPanel">
              <img src="./asset/plus.svg" alt="plus" id="action" height="10">
              <span>Create</span>
            </div>
          </div>
        </div>
        <div class="forum-list"></div>
      </div>
    </div>
  `;

  const openBtn = document.querySelector('#openPanel');
  const closeBtn = document.querySelector('#closePanel');
  const form = document.querySelector('form');

  forumTitle = document.querySelector('#forumTitle');
  forumType = document.querySelector('#forumType');
  
  openBtn.addEventListener('click', panelHandler);
  closeBtn.addEventListener('click', panelHandler);
  form.addEventListener('submit', createForum);
  
  (async () => {
    
    const auth = await readingToken();
    
    if (!auth) {
      loadPage(1)
    }
    await allForum();
  })();
}

function panelHandler() {
  console.log(isCreatePanel);
  const panel = document.querySelector('#createForum');

  isCreatePanel = (isCreatePanel + 1) % 2;
  panel.style.opacity = isCreatePanel;
  panel.style.pointerEvents = isCreatePanel == 0 ? 'none' : 'all';
}

function createForum(e) {
  e.preventDefault();

  const title = forumTitle.value;
  const type = forumType.value.toLowerCase();

  postForum(title, type);
}

