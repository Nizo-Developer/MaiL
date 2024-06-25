import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js";
import { getDatabase, ref, set, get, update, query, orderByChild, equalTo } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-database.js";

const firebaseConfig = {
  apiKey: window.API_TOKEN,
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
          localStorage.setItem('id', message_id)
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

export function updateData(id, title, description) {
  return new Promise((resolve, reject) => {
    const message_id = id;
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

// ACCOUNT
export function readingToken() {
  return new Promise((resolve, reject) => {
    const token = localStorage.getItem('token') ?? null;

    if (token) {
      const account = ref(database, `account/`);
      const getToken = query(account, orderByChild('token'), equalTo(token))

      get(getToken)
        .then((userToken) => {
          if (userToken.exists()) {
            const data = Object.entries(userToken.val())[0]
            const user = {
              userId: data[0],
              username: data[1].username
            }

            resolve(user)
          } else {
            reject();
          }
        })
        .catch((error) => {
          console.error('Error:', error);
        });
    }
  });
}

export function login(username, password) {
  return new Promise((resolve, reject) => {
    const account = ref(database, `account/`)
    const name = query(account, orderByChild('username'), equalTo(username))

    get(name)
      .then((user) => {
        if (user.exists()) {
          const data = Object.entries(user.val())
          const userData = data[0][1]
          console.log(data[0][1])

          async function sign() {
            const hashPassword = await hashing(password);

            if (hashPassword == userData.password) {
              const token = userData.token ?? ranhex(32);
              const userToken = ref(database, `account/${token}`)

              update(userToken, {
                token: token
              })
                .then(() => {
                  localStorage.setItem('token', token);
      
                  setTimeout(() => {
                    window.location.href = '/'
                  }, 1000);
                })
                .catch((error) => {
                  console.error('Error:', error);
                });
            }
          }
          sign()
        } else {
          console.log('Data not found');
        }
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  })
}

export function signup(username, password) {
  return new Promise((resolve, reject) => {
    const account = ref(database, `account/${username}`)

    get(account)
      .then((user) => {
        if (user.exists()) {

          reject('This username Already exists')

        } else {

          async function sign() {
            const hashPassword = await hashing(password)
            const id = ranhex(16)
            const token = ranhex(32)

            const newuser = ref(database, `account/` + id)
              
            set(newuser, {
              username: username,
              password: hashPassword,
              token: token
            })
              .then(() => {
                console.log('Data added successfully');
  
                localStorage.setItem('token', token);
  
                setTimeout(() => {
                  window.location.href = '/'
                }, 1000);
              })
              .catch((error) => {
                console.error('Error:', error);
              });
          }

          sign()
        }
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  })
}

function randint(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function ranhex(size) {
  return Array.from({ length: size }, (_, index) => randint(0,15).toString(16)).join('')
}

async function hashing(password) {
  try {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('');
    return hashHex;
  } catch (error) {
    console.error('Error:', error.message);
  }
}