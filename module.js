import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js";
import { getDatabase, ref, set, get, child } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-database.js";

const firebaseConfig = {
  apiKey: process.env.API_TOKEN,
  authDomain: "mail-ea223.firebaseapp.com",
  databaseURL: "https://mail-ea223-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "mail-ea223",
  storageBucket: "mail-ea223.appspot.com",
  messagingSenderId: "720207516334",
  appId: "1:720207516334:web:34db9e14d94b57939c533f",
  measurementId: "G-E7G44M30EV"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export function createData(title, description) {
  return new Promise((resolve, reject) => {
    const dataRef = ref(database, 'message/');

    get(dataRef)
      .then((snapshot) => {
        const message_id = snapshot.val().length;
        // console.log(count) 
        // const message_id = count + 1; 
        const newMessageRef = ref(database, 'message/' + message_id);

        set(newMessageRef, {
          title: title,
          description: description
        })
        .then(() => {
          console.log('Data saved successfully.');
          resolve(message_id);
        })
        .catch((error) => {
          console.error('Error saving data: ', error);
          reject(error);
        });
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        reject(error);
      });
  });
}

export function readData(id) {
  return new Promise((resolve, reject) => {
    const dataRef = ref(database, `message/${id}`);

    get(dataRef)
      .then((snapshot) => {
        if (snapshot.exists()) {
          resolve(snapshot.val());
        } else {
          throw new Error("Data not found");
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        reject(error);
      });
  });
}
