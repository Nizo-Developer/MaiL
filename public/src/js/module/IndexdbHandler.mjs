

document.addEventListener('DOMContentLoaded', () => {
  const request = indexedDB.open('Epistura', 1);
  
  request.onupgradeneeded = (e) => {
    const db = e.target.result;

    console.log(db)

    if (!db.objectStoreNames.contains('images')) {
      const store = db.createObjectStore('images', { keyPath: 'id', autoincrement: true });
      store.createIndex('imgIndex', 'img');
    }
  }

  // const addIDB = (data)
})

