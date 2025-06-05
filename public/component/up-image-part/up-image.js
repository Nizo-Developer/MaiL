import { newPhotoProfile } from "../../src/js/module/module.mjs";

let isConfirming = false;
let imageData;
let uploadType;
let view;
let imageLength = 0;

let anView = false;

document.addEventListener('DOMContentLoaded', () => {
  localStorage.removeItem('uploading');
  localStorage.removeItem('view');

  const button = document.querySelector('.upload-btn');
  const fileInput = document.querySelector('#file-portal');
  const dropArea = document.querySelector('.upload-page');
  const dragArea = document.querySelector('.drag-area');
  
  button.addEventListener('click', () => {
    fileInput.click();
  })

  fileInput.addEventListener('change', (e) => {
    handleFile(e.target.files)
  })

  dropArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropArea.classList.add('drag-on');
    dragArea.classList.add('drag-over');
  });
  dropArea.addEventListener('dragleave', () => {
    dropArea.classList.remove('drag-on');
    dragArea.classList.remove('drag-over');
  });

  dropArea.addEventListener('drop', (e) => {
    e.preventDefault();
    dropArea.classList.remove('drag-on');
    dragArea.classList.remove('drag-over');

    console.log(e.dataTransfer.files)
    handleFile(e.dataTransfer.files);
  })

  const photoChange = document.querySelector('.photo-frame');
  const back = document.querySelector('.upload-back');

  photoChange.addEventListener('click', () => {
    toggleUpload(undefined, 1)
  });
  back.addEventListener('click', toggleUpload);
  toggleUpload();

  const confirmYes = document.querySelector('.confirm-yes div');
  const confirmNo = document.querySelector('.confirm-no div'); 

  confirmYes.addEventListener('click', () => {
    confirm(undefined, 1)
  })
  confirmNo.addEventListener('click', () => {
    confirm(undefined, 2)
  })

  window.addEventListener('resize', responsive);
});

export function arrowView(id) {
  console.log(imageLength)
  if (id == 1) {
    view--

    if (view < 0) {
      view = imageLength - 1
    }
  } else if (id == 2) {
    view++

    if (view > imageLength - 1) {
      view = 0
    }
  }

  changeView();
}

async function handleFile(files) {
  imageLength += files.length
  let images = {};

  console.log(imageLength)
  console.log(images)
  const type = uploadType == 1 ? true : uploadType == 2 ? false : null;
  let id = document.querySelectorAll('.picture').length;

  console.log(type)

  const sortedFiles = Array.from(files).reverse();
  console.log(sortedFiles)

  function processFile(file) {
    return new Promise((resolve) => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        const img = new Image();
        console.log(file)
    
        reader.onload = (e) => {
          img.onload = () => {
            if (type) {
              const width = img.width;
              const height = img.height;
              const photoProfile = document.querySelector('.photo-frame > img');
      
              if (width <= height) {
                photoProfile.style.width = '100%';
                photoProfile.style.removeProperty('height');
              } else {
                photoProfile.style.height = '100%';
                photoProfile.style.width = 'unset';
              }
              console.log('PPP')
            } else {
              const container = document.querySelector('.picture-container');
    
              console.log('OOO')
              console.log(id)
              container.innerHTML += `
                <div class="picture" picture="${id}">
                  <div class="picture-nav">
                    <div class="picture-back">
                      <img src="./asset/arrowback.svg" height="18">
                      <p>Back</p>
                    </div>
                  </div>
                  <div class="picture-content" pict=${id}>
                    <div class="delete-picture" data-pd="${id}">
                      <img src="./asset/xback.svg" height="10">
                    </div>
                    <img data-p="${id}">
                    <comment>
                  </div>
                  <div class="picture-comment">
                    <input type='text' id="comment" placeholder=" ">
                    <label for="comment${id}">Caption</label>
                  </div>
                </div>
              `
              id++
            }
            resolve(e.target.result)
          }
          img.src = e.target.result;
        }
    
        reader.readAsDataURL(file);
      }
    });
  }

  await Promise.all(
    sortedFiles.map(async (file, id) => {
      const result = await processFile(file);

      images[id] = result;
      console.log(images)
    })
  )

  if (type) {
    const photoProfile = document.querySelector('.photo-frame img');

    photoProfile.src = images[0];
    imageData = images[0]

    isConfirming = true;
    confirmToggle();
  } else {
    const preview = document.querySelector('.picture-preview');
    const img = document.querySelectorAll('.picture > .picture-content > img');

    preview.style.height = '114px';

    Object.values(images).forEach((image, index) => {
      img[index + imageLength - files.length].src = image;
    })

    const deleteBtn = document.querySelectorAll(`.delete-picture[data-pd]`);

    deleteBtn.forEach(btn => {
      btn.addEventListener('click', deletePict);
    })

    const picture = document.querySelectorAll('.picture[picture] .picture-content');

    picture.forEach(pict => {
      pict.addEventListener('click', (e) => {
        viewPicture(e, 1)
      });
    })

    const backBtn = document.querySelectorAll('.picture-back');

    backBtn.forEach(back => {
      back.addEventListener('click', (e) => {
        viewPicture(e, 2)
      });
    });
    
    toggleUpload()
  }
}

function viewPicture(e, type) {
  const preview = document.querySelector('.picture-preview');
  const container = document.querySelector('.picture-container'); 
  const picture = document.querySelectorAll('.picture'); 
  const delBtn = document.querySelectorAll('.delete-picture');

  const arrowWrapper = document.querySelector('.picture-arrow');
  const arrow = document.querySelectorAll('.picture-arrow > *');

  if (type == 1 && !anView) {
    anView = true;

    const child = Array.from(container.children).map(pict => pict.children[1])
    const id = child.indexOf(e.target);
    const childTarget = child[id];

    view = id

    preview.style.height = '0';
    preview.style.paddingBottom = '0';
  
    setTimeout(() => {
      container.style.position = 'fixed';
      container.style.top = '0';
      container.style.gap = '0';
      container.style.left = '120dvw';
      container.style.zIndex = '20';
  
      setTimeout(() => {
        container.style.height = '100dvh';
        container.style.transition = 'left 2s ease, backdrop-filter 0.5s ease';

        delBtn.forEach(btn => {
          btn.style.display = 'none';
        })
  
        picture.forEach(pict => {
          const part = pict.querySelectorAll('.picture-nav, .picture-comment');
          const content = pict.querySelector('.picture-content');
          const image = pict.querySelector('.picture-content > img');

          pict.style.borderWidth = '0px';
          pict.style.overflow = 'unset';
          pict.style.display = 'grid'
          pict.style.gridTemplateRows = '50px 1fr 100px'
          pict.style.height = '100dvh';
          pict.style.width = '100dvw';
  
          part.forEach(p => {
            p.style.display = 'flex';
          })
          
          content.style.pointerEvents = 'none';

          image.style.width = 'unset';
          image.style.maxWidth = 'calc(100dvw - 90px)';
          image.style.maxHeight = 'calc(100dvh - 150px)';
        });
        
        setTimeout(() => {
          arrowWrapper.style.opacity = '1';
          arrow.forEach(a => {
            a.style.pointerEvents = 'all';
          });

          console.log(id)
          container.style.left = id * -100 + 'dvw';
          container.style.backdropFilter = 'blur(4px)';

          setTimeout(() => {
            anView = false
          }, 2000);
        }, 500);
      }, 200);
    }, 800);
  } else if (type == 2 && !anView) {
    anView = true

    container.style.removeProperty("backdrop-filter");

    setTimeout(() => {
      arrowWrapper.style.removeProperty("opacity");
      arrow.forEach(a => {
        a.style.removeProperty("pointer-events");
      });

      container.style.left = '100dvw';
      
      setTimeout(() => {
        container.style.removeProperty("height");
        container.style.removeProperty("transition");

        delBtn.forEach(btn => {
          btn.style.removeProperty("display");
        })
  
        picture.forEach(pict => {
          const part = pict.querySelectorAll('.picture-nav, .picture-comment');
          const content = pict.querySelector('.picture-content');
          const image = pict.querySelector('.picture-content > img');

          pict.style.removeProperty("border-width");
          pict.style.removeProperty("overflow");
          pict.style.removeProperty("display");
          pict.style.removeProperty("grid-template-rows");
          pict.style.removeProperty("height");
          pict.style.removeProperty("width");
  
          part.forEach(p => {
            p.style.removeProperty("display");
          })

          content.style.removeProperty("pointer-events");
  
          image.style.removeProperty("width");
          image.style.removeProperty("max-width");
          image.style.removeProperty("max-height");
          image.style.removeProperty("pointer-events");
        });

        setTimeout(() => {
          container.style.removeProperty("position");
          container.style.removeProperty("top");
          container.style.removeProperty("gap");
          container.style.removeProperty("left");
          container.style.removeProperty("z-index");

          setTimeout(() => {
            preview.style.height = '114px';
            preview.style.removeProperty("padding-bottom");

            anView = false
          }, 800);
        }, 200);
      }, 2000);
    }, 500);
  }
}

function changeView() {
  const coor = view * -100 + 'dvw';

  const container = document.querySelector('.picture-container'); 

  container.style.left = coor
}

function deletePict(e) {
  const id = e.target.getAttribute('data-pd');

  const picture = document.querySelector(`.picture[picture="${id}"]`)
  picture.remove();

  imageLength--
}

export function toggleUpload(e, type) {
  const status = localStorage.getItem('uploading');

  const upload = document.querySelector('.upload-page');
  const portal = document.querySelector('#file-portal')

  if (!status && type) {
    upload.style.top = '0';
    localStorage.setItem('uploading', 1);

    uploadType = type

    if (type == 2) {
      portal.multiple = true;
    } else {
      portal.multiple = false;
    }
  } else if (status && !type) {
    uploadType = ''
    upload.style.removeProperty('top');
    localStorage.removeItem('uploading');
  }
}

function responsive() {
  const status = window.innerWidth <= 750 ? true : false;
  const placeholder = document.querySelector('.upload-content > p')

  if (localStorage.getItem('uploading')) {

    if (status) {
      placeholder.textContent = 'Upload an image';
    } else {
      placeholder.textContent = 'Drop an image or upload an image';
    }

    confirmToggle();
  }
}

function confirmToggle(e, type) {
  const confirmYes = document.querySelector('.confirm-yes div');
  const confirmNo = document.querySelector('.confirm-no div'); 
  const status = window.innerWidth <= 750 ? true : false;

  if (localStorage.getItem('uploading') || type) {
    if (status) {
      if (isConfirming) {
        confirmYes.style.top = '0';
        confirmNo.style.bottom = '0';
      } else {
        confirmYes.style.removeProperty('top');
        confirmNo.style.removeProperty('bottom');
      }
    } else {
      if (isConfirming) {
        confirmYes.style.right = '0';
        confirmNo.style.left = '0';
      } else {
        confirmYes.style.removeProperty('right');
        confirmNo.style.removeProperty('left');
      }
    }
  }
}

async function confirm(e, type) {
  const photoProfile = document.querySelector('.photo-frame > img');
  const dataImg = document.querySelector('data-img');

  if (type == 1) {
    await newPhotoProfile(imageData);

    dataImg.setAttribute('value', dataImg);

    confirmToggle();
    toggleUpload();

    setTimeout(() => {
      isConfirming = false;
  
      confirmToggle(undefined, 1)
    }, 500);

  } else if (type == 2) {
    photoProfile.src = dataImg.getAttribute('value');

    isConfirming = false;

    confirmToggle();
  }
}