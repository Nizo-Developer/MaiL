import { loadAcc } from "../../src/js/lib/authing.js";
import { loadPage } from "../../src/js/lib/opg.js";
import { colorChange } from "../../src/js/lib/sidebar.js";
import { changeMonoSvg, copy, descriptionAct, editMessage, link, mode, selectionFormating, titleAct } from "../../src/js/lib/tool.js";

export function mainLoad() {
  const style = document.querySelector('#styleOpg');
  const script = document.querySelector('#scriptOpg');
  const main = document.querySelector('.main');

  style.href = './component/main/main.css';

  script.src = './component/main/main.js';

  main.innerHTML = `
    <div class="preview-container">
      <div class="preview-transition">
        <div class="preview-wrapper">
          <div class="preview">
            <iframe class="result"></iframe>
          </div>
        </div>
      </div>
      <div class="preview-btn" id="previewBtn">Preview</div>
    </div>
    <div class="acc-container"></div>
    <div class="container" id="formContainer">
      <form class="form">
        <div class="link">
          <button id="copyLink" type="button" disabled>Copy Link</button>
          <button id="open" disabled><a id="openLink" target="_blank">Open In New Tab</a></button>
        </div>
        <div class="link">
          <button id="generate" type="submit">Generate</button>
          <button id="edit" type="submit">Edit</button>
        </div>
        <textarea name="" id="description" placeholder=" "></textarea>
        <label for="description" class="label2">Description
          <span id="cdescription" class="counter"></span>
        </label>
        <input type="text" id="title" placeholder=" ">
        <label for="title" class="label1">Title
          <span id="ctitle" class="counter"></span>
        </label>
      </form>
    </div>
  `;

  (async () => {
    await loadAcc();

    localStorage.removeItem('id');
  })();

  if (localStorage.getItem('id')) {
    editMessage(undefined, 1)
  }

  const previewBtn = document.querySelector('#previewBtn');
  const title = document.getElementById('title');
  const description = document.getElementById('description');
  const form = document.querySelector('.form');

  form.addEventListener('submit', link);
  copyLink.addEventListener('click', copy);
  document.addEventListener('selectionchange', selectionFormating);
  previewBtn.addEventListener('click', preview);
  title.addEventListener('input', titleAct)
  description.addEventListener('input', descriptionAct);
  window.addEventListener('resize', responsive);
  window.addEventListener('mousemove', responsive);
  responsive();
}

export function responsive() {
  if (check()) {
    return
  }

  if (window.innerWidth > 540) {
    localStorage.setItem('mode', false);
  } else {
    localStorage.setItem('mode', true);
  }

  const form = document.querySelector('.form');

  const width = window.innerWidth;
  const height = window.innerHeight;
  const responsive = window.innerWidth * 0.5 - 33

  const main = document.querySelector('.main');
  const preview = document.querySelector('.preview');
  const button = document.querySelector('.preview-btn');
  const previewWrap = document.querySelector('.preview-wrapper');
  
  form.style.width = responsive + 'px';
  descriptionAct()

  preview.style.width = main.getBoundingClientRect().width + 'px';
  previewWrap.style.width = main.getBoundingClientRect().width + 'px';
  
  if (localStorage.getItem('preview')) {
    preview.style.height = `calc(100dvh - ${mode() ? '175.5px' : '115.5px'} - 4px)`;
    preview.style.bottom = mode() ? '95.5px' : '35.5px';
    button.style.top = `calc(100dvh - ${mode() ? '85px' : '25px'})`;
  }

}

function check() {
  if (localStorage.getItem('onPage') !== '1') {
    console.log('pagee')
    window.removeEventListener('resize', responsive);
    window.removeEventListener('mousemove', responsive);
    return true
  }

  return false
}

export function preview(e, type) {
  const modes = mode();
  const status = localStorage.getItem('preview');

  const body = document.querySelector('body');
  const container = document.querySelector('.preview-transition');
  const button = document.querySelector('.preview-btn');
  const preview = document.querySelector('.preview');

  if (!status && !type) {
    body.style.overflow = 'hidden';
    container.style.top = '-50vh';
    container.style.height = '400vh';
    container.style.width = '400vh';
    
    setTimeout(() => {
      colorChange("#16161b")
    }, modes ? 250 : 400);
  } else {
    body.style.overflow = 'auto';
    if (!type) {
      container.style.removeProperty('top');
      container.style.height = '200px';
      container.style.width = '200px';
      button.style.removeProperty('top');
      preview.style.removeProperty('bottom');
    }
    
    setTimeout(() => {
      colorChange("#ffffff")
    }, modes ? 550 : 400);
  }

  !status && !type ? localStorage.setItem('preview', 1) : localStorage.removeItem('preview');

  responsive();
}