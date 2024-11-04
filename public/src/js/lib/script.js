import { encrypt, decrypt, createData, updateData, readingToken, wordCount, getAllMessage, readData, checkUser } from '../module/module.mjs';
import { loadAcc, logout } from './authing.js';

const body = document.querySelector('body')

const title = document.getElementById('title');
const description = document.getElementById('description');
const count1 = document.getElementById('ctitle');
const count2 = document.getElementById('cdescription');
const resultHead = document.querySelector('.iframe');
const resultAnimate = document.querySelector('.inner-iframe');
const result = document.querySelector('.result');
const copyLink = document.getElementById('copyLink');
const label = document.querySelectorAll('label');
const openlink = document.getElementById('openLink');
const openBtn = document.getElementById('open');
const form = document.querySelector('.form');

const conWrap = document.querySelector('.container-wrapper');
const list = document.getElementById('listBtn');
const container = document.getElementById('formContainer');
const messageList = document.getElementById('list');
const listParent = document.querySelector('.message-list');
const listContent = document.querySelector('.item-list');

const family = document.querySelector('#friend');
var focused;

document.addEventListener('DOMContentLoaded', () => {
  
  (async () => {
    await loadAcc();
    await loadList();
    
    console.log('load')
    localStorage.removeItem('id')
  })()
  list.addEventListener('click', togglePage);
  form.addEventListener('submit', link);
  copyLink.addEventListener('click', copy);
  document.addEventListener('selectionchange', selectionFormating);
  window.addEventListener('resize', responsive);
  result.addEventListener('load', previewScale);
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

function titleAct() {
  if (wordCount(title.value) > 0) {
    count1.innerHTML = `( ${wordCount(title.value)} )`
  } else {
    count1.innerHTML = '';
  }
}

function descriptionAct() {
  description.style.height = 'auto';
  if (wordCount(description.value) > 0) {
    description.style.height = description.scrollHeight + 'px';
    count2.innerHTML = `( ${wordCount(description.value)} )`
  } else {
    description.removeAttribute('style');
    count2.innerHTML = '';
  }
  form.style.marginTop = description.scrollHeight < window.innerHeight / 4 ? description.scrollHeight  + 'px' : window.innerHeight / 4 + 'px';
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

async function editMessage(messageId) {
  localStorage.setItem('id', messageId)
  const id = localStorage.getItem('id');
  const data = await readData(id);

  title.value = decrypt(data.title);
  description.value = decrypt(data.description);
  if (localStorage.getItem('id')) {
    edit.style.display = 'block'
  }

  var resultSrc = 'Mail.html?id=' + messageId;
  
  result.src = resultSrc
  openlink.href = resultSrc
  openBtn.removeAttribute('disabled')
  copyLink.removeAttribute('disabled')

  titleAct();
  descriptionAct();
  togglePage();
}

async function link(event) {
  event.preventDefault();

  const id = event.submitter.id[0] == 'g' ? 0 : (event.submitter.id[0] == 'e' ? 1 : null) 

  try {
    
    if (title.value && description.value) {
      console.log(formating(title.value))
      var message_id = await (id == 0 ?
        createData(
          encrypt(formating(title.value)), 
          encrypt(formating(description.value))
        ) : ( id == 1 ?
        updateData(
          localStorage.getItem('id'),
          encrypt(formating(title.value)), 
          encrypt(formating(description.value))
        ) : null
      ))
      console.log(message_id)
      
      if (localStorage.getItem('id')) {
        edit.style.display = 'block'
      }
      
      var resultSrc = 'Mail.html?id=' + message_id;
      
      result.src = resultSrc;
      console.log(openlink)
      openlink.href = resultSrc;
      openBtn.removeAttribute('disabled')
      copyLink.removeAttribute('disabled')
      await loadList();
    } else {
      if (!title.value) {
        label[0].style.color = 'red'
      }
      if (!description.value) {
        label[1].style.color = 'red'
      }

      
      setTimeout(() => {
        label.forEach((i, index) => {
          i.removeAttribute('style')
        });
      }, 3000);
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

function responsive() {
  const form = document.querySelector('.form');
  const list = document.getElementById('message-list');
  const listWidth = messageList.getBoundingClientRect().width;

  const width = window.innerWidth;
  const height = window.innerHeight;
  const responsive = window.innerWidth * 0.5 - 33

  console.log(listWidth)
  
  form.style.width = responsive + 'px';
  resultHead.style.height = height * 0.5 + 'px';
  resultHead.style.width = width * 0.5 - 33 + 'px';
  result.style.height = height * 0.5 - 3 + 'px';
  result.style.width = width * 0.5 - 36 + 'px';
}

function selectionFormating() {
  var selected = window.getSelection();
  var selectionText = selected.toString();
  var enableFormating = true;

  var keyBtn = ['b', 'i', 's', 'p']
  var keyIndi = ['*', '_', '-', '```']

  // console.log(selectionText)

  title.addEventListener('click', () => {
    focused = 1
  });
  description.addEventListener('click', () => {
    focused = 2
  });
  var tag = focused == 1 ? title : description
  var indexStart = tag.selectionStart
  
  if (selectionText && enableFormating) {
    console.log('hi')
    enableFormating = false

    document.addEventListener('keydown', fm)

    function fm(event)  {
      console.log(event.key)
      console.log(selectionText)
      var indi = event.key in keyBtn ? keyIndi[keyBtn.indexOf(event.key)] : ''

      console.log(event.ctrlKey, event.key in keyBtn)
      console.log(focused)
      console.log(event.ctrlKey && event.key in keyBtn && focused)

      if (event.ctrlKey && event.key in keyBtn && focused) {
        
        console.log(indexStart)
        console.log(tag)
        console.log(tag.value)
        var spesificRegex = new RegExp(`^.{${indexStart}}(.{${selectionText.length}})`, 'g')
        console.log(tag.value.match(spesificRegex))
        console.log(spesificRegex)
        console.log(selectionText)

        

        tag.value = tag.value.replace(spesificRegex, `${indi}${tag.value.match(spesificRegex)}${indi}`)
        
      }
      
      if (indi) {
        document.removeEventListener('keydown', fm)      
      }
    }
  }
}

function formating(text) {
  var character = ['_', '\\*', '-', '```']
  var tag = ['i', 'b', 's', 'pre']
  
  character.map((i, index) => {
    var formatingRegex = new RegExp(`${i}(.*?)${i}`, 'g')
    text = text.replace(formatingRegex, `<${tag[index]}>$1</${tag[index]}>`)
  })

  return text
}

function copy() {
  navigator.clipboard.writeText(result.src)
}



window.editMessage = editMessage;