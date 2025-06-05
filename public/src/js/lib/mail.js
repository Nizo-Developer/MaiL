import { readData, getAuthor, decrypt, getPictures } from '../module/module.mjs'
import { getMessage } from '../module/storage.mjs';

let isPictures = false;

document.addEventListener('DOMContentLoaded', () => {
  loadMessage();

  const envelope = document.querySelector('.envelope-button img');
  const back = document.querySelector('.back-btn');
  const pictBtn = document.querySelector('.picture-btn');

  envelope.addEventListener('click', openEnvelope);
  back.addEventListener('click', () => {
    togglePicture(1)
  });
  pictBtn.addEventListener('click', () => {
    togglePicture(2)
  });
})

function togglePicture(type) {
  const picture = document.querySelector('.pictures');
  const pictBtn = document.querySelector('.picture-btn');

  if (type == 1) {
    picture.style.backdropFilter = 'blur(0)';
    picture.style.left = '120vw';

    pictBtn.style.right = '0';
  } else if (type == 2) {
    picture.style.backdropFilter = 'blur(4px)';
    picture.style.left = '0';

    pictBtn.style.right = '-100px';
  }
}

function openEnvelope() {
  const envelope = document.querySelector('.envelope');
  const headEnvelope = document.querySelectorAll('.envelope-top, .envelope-button');

  const mail = document.querySelector('.mail-content');
  const pict = document.querySelector('.pictures');
  const pictWrap = document.querySelector('.pictures-wrapper');
  const pictScroll = document.querySelector('.pictures-scroll');
  const pictBack = document.querySelector('.pictures-back');

  const entop = document.querySelector('.envelope-top');
  const enbottom = document.querySelector('.envelope-bottom');
  const enbutton = document.querySelector('.envelope-button');
  const enbackground = document.querySelector('.background');
  const envelopePart = [entop, enbottom, enbutton, enbackground];

  const top = (envelope.getBoundingClientRect().width * 10.5 / 16 - 85) * -1;

  headEnvelope.forEach(e => {
    e.style.transform = 'rotateX(90deg)';
    // e.style.top = top + 'px';

    setTimeout(() => {  
      headEnvelope[0].style.zIndex = '-2';
      headEnvelope[1].style.zIndex = '-3';

      e.style.transform = 'rotateX(180deg)';
    }, 800);

    setTimeout(() => {
      envelope.style.transition = 'all 1s ease'
      envelope.style.bottom = (envelope.getBoundingClientRect().height + headEnvelope[0].getBoundingClientRect().height) * -1 + 'px'

      if (isPictures) {
        setTimeout(() => {
          const picture = document.querySelectorAll('.picture');

          picture.forEach(p => {
            p.style.removeProperty('display')
          })

          pictScroll.style.left = '120dvw';
          pict.style.top = '100dvh';
          pict.style.height = pict.getBoundingClientRect().width * 10.5 / 16 + 'px';
          pict.style.position = 'fixed';
          // pict.style.backgroundColor = '#16161b';
          pict.style.backdropFilter = 'blur(4px)';
          pictBack.style.display = 'flex';
          pict.style.transition = 'all 1s ease';


          const img = document.querySelectorAll('.picture > img');

          img.forEach((i, id) => {
            i.style.position = 'relative';

            if (id < 3) {
              i.style.removeProperty('transform');
            }
            if (id == 1) {
              i.style.removeProperty('z-index')
            }
          })
  
          setTimeout(() => {
            pictWrap.style.height = '100dvh';
            pictWrap.style.width = '100dvw';
            pict.style.height = '100dvh';
            pict.style.width = '100dvw';

            const picture = document.querySelectorAll('.picture')
            
            pict.style.top = '0';
            pict.style.maxWidth = 'unset';
            pict.style.transform = 'scale(1)';

            envelopePart.forEach(e => {
              e.style.display = 'none';
            })
            
            setTimeout(() => {
              picture.forEach(p => {
                p.style.height = '100dvh';
                p.style.maxHeight = '100dvh';
                p.style.width = '100dvw';
                p.style.maxWidth = '100dvw';
              })
              
              setTimeout(() => {
                pict.style.left = 0;

                pictScroll.style.left = 0;
              }, 500);

            }, 1000);
          }, 300);
        }, 1000);
      }

      setTimeout(() => {
        const container = document.querySelector('.container');
        const content = document.querySelector('.content');

        if (content.getBoundingClientRect().height < window.innerHeight) {
          container.style.justifyContent = 'center';
        }
        
        mail.style.top = '100dvh';
        mail.style.height = mail.getBoundingClientRect().width * 10.5 / 16 + 'px';
        mail.style.position = 'fixed';
        mail.style.transition = 'all 1s ease';

        setTimeout(() => {
          mail.style.top = '0';
          mail.style.height = '100dvh';
          mail.style.maxWidth = 'unset';
          mail.style.width = '100dvw';
          mail.style.transform = 'scale(1)'

          const content = document.querySelector('.content');

          content.style.transform = 'scale(1)';

          setTimeout(() => {
            mail.style.transition = 'unset';
          }, 1000);
        }, 300);
      }, 1000 + (isPictures ? 2300 : 0));
    }, 2000);
    
  })
}

function loadMessage() {
  const url = window.location.search
  var param = url.replace(/&amp;/g, '&').replace(/%20/g, ' ').slice(1).split('&')
  var params = {}
  
  const title = document.getElementById('title');
  const description = document.getElementById('description');
  const author = document.getElementById('author');

  const picturesScroll = document.querySelector('.pictures-scroll');
  
  var x;
  param.map(i => {
    x = i.split('=')
    params[x[0]] = x[1]
  })
  console.log(params);
  (async () => {
    try {
      const data = await getMessage(params['id']);
      console.log(data)
      const config = data.config;
      console.log(data)
      
      decrypt(data['title']).forEach(p => {
        const div = document.createElement('div');

        div.textContent += p
        title.appendChild(div)
      })
      decrypt(data['description']).forEach(p => {
        const div = document.createElement('div');

        div.textContent += p.length != 0 ? p : "ㅤ"
        description.appendChild(div)
      })

      const displayName = await getAuthor(data.author);
      const deg = [-30, 0, 30]
      const translate = [-100, 0, 100]

      const pictures = data.pictures ? Object.values(data['pictures']) : null;

      if (pictures) {
        isPictures = true;

        pictures.forEach((p, i) => {
          picturesScroll.innerHTML += `
            <div class="picture" data-pict="${i}" style="${i > 2 ? "display: none" : ''}">
              <img src="${p['url']}" style="${"transform: rotateZ(" + deg[i] + "deg) translateX(" + translate[i] + "px)"}">
              <p>${p['caption'].length > 0 ? decrypt(p['caption']) : ''}</p>
            </div>
          `;
        })
      }

      if (config.display_author) {
        author.textContent = (data.author != 'anonymous' ? displayName : 'anonymous');
      }

      console.log('done')

      removeLoading()
    } catch (error) {
      console.error('Error:', error);
    }
  })();
}

function removeLoading() {
  const loading = document.querySelector('.loading-page');

  loading.style.opacity = 0;

  setTimeout(() => {
    loading.style.display = 'none';
  }, 1500);
}