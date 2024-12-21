import { newPhotoProfile } from "../../src/js/module/module.mjs";

let isConfirming = false;
let imageData;

document.addEventListener('DOMContentLoaded', () => {
  localStorage.removeItem('uploading');

  const button = document.querySelector('.upload-btn');
  const fileInput = document.querySelector('#file-portal');
  const dropArea = document.querySelector('.upload-page');
  const dragArea = document.querySelector('.drag-area');

  button.addEventListener('click', () => {
    fileInput.click();
  })

  fileInput.addEventListener('change', (e) => {
    handleFile(e.target.files[0])
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

    console.log(e.dataTransfer.files[0])
    handleFile(e.dataTransfer.files[0]);
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

function handleFile(file) {
  if (file.type.startsWith('image/')) {
    const reader = new FileReader();
    const img = new Image();

    reader.onload = (e) => {
      img.onload = () => {
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
      }
      img.src = e.target.result;
    }

    reader.readAsDataURL(file);

    setTimeout(() => {
      const photoProfile = document.querySelector('.photo-frame img');

      photoProfile.src = reader.result;
      imageData = reader.result

      isConfirming = true;
      confirmToggle();
    }, 100);
  }
}

export function toggleUpload(e, type) {
  const status = localStorage.getItem('uploading');

  const upload = document.querySelector('.upload-page');

  if (!status && type) {
    upload.style.top = '0';
    localStorage.setItem('uploading', 1);
  } else if (status && !type) {
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

  if (localStorage.getItem('uploading')) {
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

  if (type == 1) {
    await newPhotoProfile(imageData);

    localStorage.setItem('pp', imageData);

    confirmToggle();
    toggleUpload();
  } else if (type == 2) {
    photoProfile.src = localStorage.getItem('pp', photoProfile);

    isConfirming = false;

    confirmToggle();
  }
}