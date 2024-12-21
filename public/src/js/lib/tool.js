import { createData, decrypt, encrypt, letterCount, readData, updateData } from "../module/module.mjs";
import { loadPage } from "./opg.js";

export function randint(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function portal() {
  window.location.href = '/'
}

export function mode() {
  return localStorage.getItem('mode') == 'true' ? true : false;
}

export function changeMonoSvg(url, color, origin) {
  if (color[0] !== '#') {
    color = '#' + color
  }

  fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error("Gagal memuat file SVG");
      }
      return response.text();
    })
    .then(svgContent => {
      if (!url.startsWith('data:image/svg+xml;base64')) {

        const parser = new DOMParser();
        const svgDocument = parser.parseFromString(svgContent, "image/svg+xml");
        const svgElement = svgDocument.querySelector("svg");
  
        svgElement.querySelectorAll("*").forEach(element => {
          element.setAttribute("fill", color);
        });

        const serializer = new XMLSerializer();
        const updatedSVG = serializer.serializeToString(svgElement);
  
        origin.src = `data:image/svg+xml;base64,${btoa(updatedSVG)}`;
      } else {
        const base64Content = url.split(",")[1];
        const svgContent = atob(base64Content);

        const parser = new DOMParser();
        const svgDocument = parser.parseFromString(svgContent, "image/svg+xml");

        svgDocument.querySelectorAll("*").forEach(element => {
          element.setAttribute("fill", color);
        });

        const serializer = new XMLSerializer();
        const updatedSVG = serializer.serializeToString(svgDocument);

        const newBase64Content = btoa(updatedSVG);

        origin.src = `data:image/svg+xml;base64,${newBase64Content}`;
      }
    })
    .catch(error => {
      console.error("Terjadi kesalahan:", error);
    });
}

export async function editMessage(elemen, load) {
  if (!load) {
    const messageId = elemen.target.getAttribute('edit-id');
    localStorage.setItem('id', messageId)
    localStorage.setItem('edit-mode', 1)
    loadPage(1)
  } else {
    const id = localStorage.getItem('id');
    const data = await readData(id);
    const description = document.getElementById('description');
    const result = document.querySelector('.result');
    const openlink = document.getElementById('openLink');
    const openBtn = document.getElementById('open');
    
  
    title.value = decrypt(data.title);
    description.value = decrypt(data.description);
    edit.style.display = 'block'
  
    var resultSrc = 'Mail.html?id=' + id;
    
    result.src = resultSrc
    openlink.href = resultSrc
    openBtn.removeAttribute('disabled')
    shareBtn.removeAttribute('disabled')
  
    titleAct();
    descriptionAct();
  }
}

export async function link(event) {
  event.preventDefault();

  const description = document.getElementById('description');
  const result = document.querySelector('.result');
  const openlink = document.getElementById('openLink');
  const openBtn = document.getElementById('open');

  const id = event.submitter.id[0] == 'g' ? 0 : (event.submitter.id[0] == 'e' ? 1 : null) 

  const iframe = document.querySelector('iframe')

  // const titleVal = title.value;
  // const descriptionVal = description.value;
  const titleVal = sanitization(title.value);
  const descriptionVal = sanitization(description.value);

  try {
    
    if (titleVal && descriptionVal) {
      console.log(formating(titleVal))
      var message_id = await (id == 0 ?
        createData(
          encrypt(formating(titleVal)), 
          encrypt(formating(descriptionVal))
        ) : ( id == 1 ?
        updateData(
          localStorage.getItem('id'),
          encrypt(formating(titleVal)), 
          encrypt(formating(descriptionVal))
        ) : null
      ))
      console.log(message_id)
      
      if (localStorage.getItem('id')) {
        edit.style.display = 'block'
      }
      
      var resultSrc = 'Mail.html?id=' + message_id;
      
      result.src = resultSrc;
      console.log(openlink);
      openlink.href = resultSrc;
      openBtn.removeAttribute('disabled')
      shareBtn.removeAttribute('disabled')
    } else {
      if (!titleVal) {
        label[0].style.color = 'red'
      }
      if (!descriptionVal) {
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

export function selectionFormating() {
  var focused;
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

export function formating(text) {
  var character = ['_', '\\*', '-', '```']
  var tag = ['i', 'b', 's', 'pre']
  
  character.map((i, index) => {
    var formatingRegex = new RegExp(`${i}(.*?)${i}`, 'g')
    text = text.replace(formatingRegex, `<${tag[index]}>$1</${tag[index]}>`)
  })

  return text
}

export function copy() {
  const url = document.querySelector('#copyLink p');
  navigator.clipboard.writeText(url.textContent)
}

export function titleAct() {
  const count1 = document.getElementById('ctitle');

  if (letterCount(title.value) > 0) {
    count1.innerHTML = `( ${letterCount(title.value)} )`
  } else {
    count1.innerHTML = '';
  }
}

export function descriptionAct() {
  const form = document.querySelector('.form');
  const description = document.getElementById('description');
  const count2 = document.getElementById('cdescription');

  description.style.height = 'auto';
  if (letterCount(description.value) > 0) {
    description.style.height = description.scrollHeight + 'px';
    count2.innerHTML = `( ${letterCount(description.value)} )`
  } else {
    description.removeAttribute('style');
    count2.innerHTML = '';
  }
  form.style.marginTop = description.scrollHeight < window.innerHeight / 4 ? description.scrollHeight  + 'px' : window.innerHeight / 4 + 'px';
}

function sanitization(input) {
  console.log(DOMPurify.sanitize(input))
  return DOMPurify.sanitize(input)
}

export function pathtomail() {
  const reverse = window.location.pathname.split('').reverse()
  const directory = reverse.slice(reverse.indexOf("/")).reverse().join("");

  return window.location.origin + directory
}