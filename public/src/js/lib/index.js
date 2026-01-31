import { encrypt, decrypt, createData, updateData, readingToken, wordCount, getAllMessage, readData, checkUser } from '../module/module.mjs';
import { loadAcc, logout } from './authing.js';
import { copy, link, mode, selectionFormating, editMessage, titleAct, descriptionAct } from './tool.js';

const body = document.querySelector('body')

const title = document.getElementById('title');
const description = document.getElementById('description');
const resultHead = document.querySelector('.iframe');
const resultAnimate = document.querySelector('.inner-iframe');
const result = document.querySelector('.result');
const copyLink = document.getElementById('copyLink');
const label = document.querySelectorAll('label');
const form = document.querySelector('.form');

const conWrap = document.querySelector('.container-wrapper');
const list = document.getElementById('listBtn');
const container = document.getElementById('formContainer');
const messageList = document.getElementById('list');
const listParent = document.querySelector('.message-list');
const listContent = document.querySelector('.item-list');

const previewBtn = document.querySelector('#previewBtn')
const newThing = document.querySelector('.new')

const family = document.querySelector('#friend');

const theme = document.querySelector('theme').attributes[0].value;

document.addEventListener('DOMContentLoaded', () => {
  
  (async () => {
    await loadAcc();
    if (theme == 1) {
      await loadList();
    }
    
    console.log('load')
    localStorage.removeItem('id')
  })()

  localStorage.setItem('preview', 0)

  if (window.innerWidth > 540) {
    localStorage.setItem('mode', false);
  } else {
    localStorage.setItem('mode', true);
  }

  console.log(theme)

  if (theme == 1) {
    list.addEventListener('click', togglePage);
    result.addEventListener('load', previewScale);
    newThing.addEventListener('click', newInterface);
  } 
  form.addEventListener('submit', link);
  copyLink.addEventListener('click', copy);
  document.addEventListener('selectionchange', selectionFormating);
  window.addEventListener('resize', responsive);
  window.addEventListener('mousemove', responsive)
  responsive();
});

title.addEventListener('input', titleAct)
description.addEventListener('input', descriptionAct);
friend.addEventListener('click', () => {
  window.location.href = './friend'
});
envelope.addEventListener('click', () => {
  window.location.href = './envelope'
});

function responsive() {
  if (window.innerWidth > 540) {
    localStorage.setItem('mode', false);
  } else {
    localStorage.setItem('mode', true);
  }

  const form = document.querySelector('.form');
  const list = document.getElementById('message-list');

  if (theme == 1) {
    const listWidth = messageList.getBoundingClientRect().width;
  }

  const width = window.innerWidth;
  const height = window.innerHeight;
  const responsive = window.innerWidth * 0.5 - 33

  const main = document.querySelector('.main');
  const preview = document.querySelector('.preview');
  const button = document.querySelector('.preview-btn');
  const previewWrap = document.querySelector('.preview-wrapper');
  
  form.style.width = responsive + 'px';
  if (theme == 1) {
    resultHead.style.height = height * 0.5 + 'px';
    resultHead.style.width = width * 0.5 - 33 + 'px';
    result.style.height = height * 0.5 - 3 + 'px';
    result.style.width = width * 0.5 - 36 + 'px';
  } else {
    preview.style.width = main.getBoundingClientRect().width + 'px';
    previewWrap.style.width = main.getBoundingClientRect().width + 'px';
    
    if (localStorage.getItem('preview') == '1') {
      preview.style.height = `calc(100dvh - ${mode() ? '175.5px' : '115.5px'} - 4px)`;
      preview.style.bottom = mode() ? '95.5px' : '35.5px';
      button.style.top = `calc(100dvh - ${mode() ? '85px' : '25px'})`;
    }
  }
}

function newInterface() {
  newThing.style.height = '500vh';
  newThing.style.width = '500vh';
  newThing.style.right = '-250vh';
  newThing.style.bottom = '-250vh';
  localStorage.setItem('neww', 1);
  setTimeout(() => {
    window.location.href = './'
  }, 800);
}

function previewScale() {
  const iframeDocument = result.contentDocument || result.contentWindow.document;
  const allElements = iframeDocument.querySelectorAll('*');
  const container = iframeDocument.querySelector('.container')
  const style1 = window.getComputedStyle(container);
  const newPadding = parseFloat(style1.paddingInline) * 0.5;
  container.style.paddingInline = newPadding + 'px';
  const content = iframeDocument.querySelector('.content')
  const style2 = window.getComputedStyle(content);
  const newMargin = parseFloat(style2.marginBlock) * 0.5;
  content.style.marginBlock = newMargin + 'px';
  allElements.forEach(element => {
    const style = window.getComputedStyle(element);
    const currentFontSize = parseFloat(style.fontSize);
    const currentGap = parseFloat(style.gap);
    const newFontSize = currentFontSize * 0.5;
    const newGap = currentFontSize * 0.5;
    element.style.fontSize = newFontSize + 'px';
    element.style.gap = newGap + 'px';
  });
  resultAnimate.style.height = 100 + '%';
}

window.onerror = function(message, source, lineno, colno, error) {
  localStorage.setItem('error', [message,source,lineno,colno,error]); 
};

async function loadList() {
  listContent.innerHTML = ''

  try {
    console.log('yes')
    const data = await getAllMessage();

    if (data.sumData > 0) {

      const message = document.createElement('div');
      const btn = document.createElement('button');
      btn.setAttribute('class', 'btn');
      const anchor = document.createElement('a');
      const parag = document.createElement('p');

      const fragment = document.createDocumentFragment();
      
      Object.keys(data.message).forEach((key, index) => {
        const dataMessage = data.message[key]

        const content = message.cloneNode(true);
        content.setAttribute('class', 'message');
        fragment.appendChild(content);

        const right = message.cloneNode(true);
        right.setAttribute('class', 'message-right');
        content.appendChild(right);

        const id = parag.cloneNode(true);
        id.innerHTML = `#${key}`
        right.appendChild(id)

        const messageContent = message.cloneNode(true);
        messageContent.setAttribute('class', 'message-wrapper');
        right.appendChild(messageContent);
        
        const title = message.cloneNode(true);
        title.setAttribute('class', 'msg listTitle');
        title.innerHTML = dataMessage.title;
        messageContent.appendChild(title);

        const description = message.cloneNode(true);
        description.setAttribute('class', 'msg listDescription');
        description.innerHTML = dataMessage.description
        messageContent.appendChild(description);

        const buttonContent = message.cloneNode(true);
        buttonContent.setAttribute('class', 'button-wrapper');
        content.appendChild(buttonContent);
        
        const share = btn.cloneNode(true);
        // ashare.setAttribute('onclick', `shareMessage(${key})`)
        share.setAttribute('id', 'share-list');
        
        const ashare = anchor.cloneNode(true)
        ashare.innerHTML = 'share';

        const edit = btn.cloneNode(true);
        edit.setAttribute('id', 'edit-list');

        const aedit = anchor.cloneNode(true);
        aedit.setAttribute('onclick', `editMessage(${key})`)
        aedit.innerHTML = 'edit';
        
        const view = btn.cloneNode(true);
        view.setAttribute('id', 'view-list');
        
        const aview = anchor.cloneNode(true);
        aview.href = `./Mail.html?id=${key}`;
        aview.target = '_blank'
        aview.innerHTML = 'view';
        
        share.appendChild(ashare)
        edit.appendChild(aedit)
        view.appendChild(aview)
        buttonContent.appendChild(share);
        buttonContent.appendChild(edit);
        buttonContent.appendChild(view);
      })

      listContent.appendChild(fragment);
    } else {
      listParent.style.alignItems = 'center';
      const validation = await checkUser();

      if (validation) {
        listContent.innerHTML = "You haven't create a single message yet";
      } else {
        listContent.innerHTML = "You should Login to use this Feature"
      }
    }
  } catch (error) {
      listContent.innerHTML = error.message
  }
}

function togglePage() {
  const page = list.children[0].innerText == '<' ? true : false;
  if (page) {
    window.scrollTo({
      top: 0,         
      behavior: 'smooth' 
    });
    
    list.style.paddingInline = 0;
    container.style.position = 'relative'
    container.style.gap = '10px'
    container.style.right = '-100px'
    list.style.transition = 'all 1s ease';
    
    setTimeout(() => {
      body.style.overflowY = 'hidden'
      messageList.style.display = 'flex';
      responsive()
      list.style.right = '100vw'
      container.style.gap = '40px'
      container.style.right = '100vw'
      conWrap.style.left = '-100vw'
      messageList.style.left = 0
      setTimeout(() => {
        list.style.right = '100vw'
        container.style.gap = '40px'
        setTimeout(() => {
          list.children[0].innerText = '>'
          list.style.left = '-40px'
          messageList.style.position = 'fixed'
          setTimeout(() => {
            list.style.left = 0;
            list.style.right = 'unset';
            list.style.removeProperty('padding-inline');
            setTimeout(() => {
              list.style.removeProperty('transition');
            }, 500);
          }, 300);
        }, 800);
      }, 500);
    }, 500);
  } else {
    body.style.overflowY = 'auto'
    list.style.paddingInline = 0;
    messageList.style.left = '-100px'
    list.style.transition = 'all 1s ease';

    setTimeout(() => {
      list.style.left = '100vw'
      container.style.gap = '20px'
      container.style.right = '0';
      conWrap.style.left = '0'
      messageList.style.left = '100vw' 
      setTimeout(() => {
        list.style.left = '100vw'
        setTimeout(() => {
          messageList.style.display = 'none';
          list.children[0].innerText = '<'
          list.style.right = '-40px'
          setTimeout(() => {
            list.style.right = 0;
            list.style.left = 'unset';
            list.style.removeProperty('padding-inline');
            setTimeout(() => {
              list.style.removeProperty('transition');
            }, 500);
          }, 300);
        }, 800);
      }, 500);
    }, 500);
  }
}

// async function shareMessage(messageId) {
  
// }

