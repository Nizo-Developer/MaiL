import { envelopeResponsive } from "../../../pages/envelope/envelope.js";
import { responsive } from "../../../pages/main/main.js";
import { checkUser } from "../module/module.mjs";
import { dataUser, loadPage } from "./opg.js";
import { changeMonoSvg } from "./tool.js";

const sidebarBtn = document.querySelector('#sidebar');
const fixedSide = document.querySelector('.sidebar-wrapper');
const sidebar = document.querySelector('section');
const menus = document.querySelectorAll('.menu')

document.addEventListener('DOMContentLoaded', () => {
  
  if (!localStorage.getItem('side')) {
    localStorage.setItem('side', 1);  
  }

  toggleSidebar(undefined, 1)

  sidebarBtn.addEventListener('click', toggleSidebar);
})

function toggleSidebar(e, type) {
  const status = localStorage.getItem('side');
  const dummy = document.querySelector('.dummy').getBoundingClientRect();
  const fix = fixedSide.getBoundingClientRect();
  
  if (!type) {
    if (status == 1) {
      wideSide()
    } else {
      liteSide()
    }

    localStorage.setItem('side', status == 1 ? 2 : 1);
  } else {
    if (status == 2) {
      wideSide()
    } else {
      liteSide()
    }
  }
  console.log(localStorage.getItem('onPage'))

  if (localStorage.getItem('onPage') == 1) {
    const response = setInterval(() => {
      responsive()
    }, 15);
  
    setTimeout(() => {
      clearInterval(response);
    }, 300);
  } else if (localStorage.getItem('onPage') == 3) {
    const response = setInterval(() => {
      envelopeResponsive()
    }, 15);
  
    setTimeout(() => {
      clearInterval(response);
    }, 300);
  }

  home.addEventListener('click', () => {
    loadPage(1);
  });
  friend.addEventListener('click', () => {
    loadPage(2);
  });
  envelope.addEventListener('click', () => {
    loadPage(3);
  });
  forum.addEventListener('click', () => {
    loadPage(4);
  });


  function wideSide() {
    sidebar.style.gridTemplateColumns = '150px 1fr';
    fixedSide.style.width =  (150 - 2 - 43) + 'px'; 
    menus.forEach(e => {
      e.querySelector('.hide').style.width = '100%';
      e.style.gap = '10px';
      e.style.removeProperty('left');
    })
  }

  function liteSide() {
    sidebar.style.removeProperty('grid-template-columns');
    fixedSide.style.removeProperty('width')
    menus.forEach(e => {
      e.querySelector('.hide').style.removeProperty('width')
      e.style.removeProperty('gap');
      e.style.left = '3px';
    })
  }
}

export async function colorChange(color) {
  if (dataUser.data.length > 0) {
    const sidebar = document.querySelector('.sidebar-wrapper');
    const menuText = document.querySelectorAll('.menu .hide p')
    const svg = sidebar.querySelectorAll('img')
    
    const check = await checkUser();
    
    if (check) {
      const acc = document.querySelector('#user');
      const accSvg = acc.querySelector('img');
      
      changeMonoSvg(accSvg.attributes[0].value, color, accSvg);
    
      acc.style.color = color;
      acc.style.borderColor = color;
    }
    
    menuText.forEach(e => {
      e.style.color = color;
    })
    
    svg.forEach(e => {
      const url = e.attributes[0].value;
    
      changeMonoSvg(url, color, e)
    })
  }
}