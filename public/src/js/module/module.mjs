import { initializeApp } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js";
import { getDatabase, ref, set, get, update, push, query, orderByChild, equalTo } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-database.js";
import { getPicture, postPicture } from "./storage.mjs";

// const firebaseConfig = {
//   apiKey: window.API_TOKEN,
//   authDomain: "mail-ea223.firebaseapp.com",
//   databaseURL: "https://mail-ea223-default-rtdb.asia-southeast1.firebasedatabase.app",
//   projectId: "mail-ea223",
//   storageBucket: "mail-ea223.appspot.com",
//   messagingSenderId: "720207516334",
//   appId: "1:720207516334:web:34db9e14d94b57939c533f",
//   measurementId: "G-E7G44M30EV"
// };

const firebaseConfig = {
  apiKey: window.API_TOKEN,
  authDomain: "epistura-b75d5.firebaseapp.com",
  databaseURL: "https://epistura-b75d5-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "epistura-b75d5",
  storageBucket: "epistura-b75d5.firebasestorage.app",
  messagingSenderId: "936418042824",
  appId: "1:936418042824:web:af7bc8e5eb45968a7456fd",
  measurementId: "G-BJFLM128GE"
};

export const app = initializeApp(firebaseConfig);
export const database = getDatabase(app);

export async function setupConfig(path = './') {
  let config = {};
  const messageId = getMessageId();
  const response = await fetch(`${path}src/js/lib/setting.json`);
  config = await response.json();
  console.log(config)

  if (messageId) {
    const message = await readData(messageId);
    config = message.config
  } else {
    const auth = await checkUser();
    console.log(auth)
    
    if (auth) {
      config = auth.config
    }
  }
  console.log(config)
  // const refUserSetting = ref(database)

  return config
}

export function createData(title, description, pictures) {
  return new Promise((resolve, reject) => {
    console.log(pictures)
    
    async function getUser() {
      const config = await setupConfig();
      const user = await checkUser();
      const refMessage = ref(database, 'message/');
      const snapshot1 = await get(refMessage);
      const keys = Object.keys(snapshot1.val());
      const message_id = parseInt(keys[keys.length-1]) + 1;
      const refSet = ref(database, `message/${message_id}`);
      console.log(config)
      const now = timeNow();
      
      try {
        let uniqueKey = null;
        if (pictures !== null) {
          const messageRef = ref(database, `pictures/`);
          const messagePush = push(messageRef);
          uniqueKey = messagePush.key;

          postPicture(uniqueKey, pictures);
        }

        await set(refSet, {
          title: title,
          description: description,
          pictures: uniqueKey,
          author: user ? localStorage.getItem('userId') : 'anonymous',
          config: config,
          timestamp: {
            create_at: now,
            update_at: ""
          }
        })

        resolve(message_id);
      } catch (error)  {
        console.error('Error saving data: ', error);
        reject(error);
      };
    }

    getUser()
  });
}

export function updateData(id, title, description, pictures) {
  return new Promise(async(resolve, reject) => {
    const config = await setupConfig();
    const message_id = id;
    const newMessageRef = ref(database, 'message/' + message_id);
    const now = timeNow();


    update(newMessageRef, {
      title: title,
      description: description,
      pictures: pictures,
      config: config,
      'timestamp/update_at': now
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
  return new Promise(async(resolve, reject) => {
    const getData = await get(ref(database, `message/${id}`));
    const result = getData.val()
    // const authorGet = await get(ref(database, `message/${id}/author`))
    // const titleGet = await get(ref(database, `message/${id}/title`))
    // const descriptionGet = await get(ref(database, `message/${id}/description`))
    // const configGet = await get(ref(database, `message/${id}/config`))

    // const author = authorGet.val();
    // const title = titleGet.val();
    // const description = descriptionGet.val();
    // const config = configGet.val();
    const pictures = await getPicture(result.pictures);

    const data = {
      author: result.author,
      title: result.title,
      description: result.description,
      config: result.config,
      pictures: pictures
    }

    resolve(data)

    // get(dataRef)
    //   .then((snapshot) => {
    //     if (snapshot.exists()) {
    //       const data = snapshot.val();
    //       console.log(data)

    //       if (data.author != 'anonymous') {
    //         (async () => {
    //           try {

    //             resolve(data);
          
    //           } catch (error) {
    //             console.error('Error:', error.message);
    //           }
    //         })();
    //       } else {
    //         resolve(data);
    //       }
    //     } else {
    //       throw new Error("Data not found");
    //     }
    //   })
    //   .catch((error) => {
    //     console.error("Error fetching data:", error);
    //     reject(error);
    //   });
  });
}

export function getPictures(id) {
  return new Promise(async(resolve, reject) => {
    let index = 0;
    let getImage = true
    let pictures = []

    const key = await get(ref(database, 'message/' + id + '/pictures'));
    const keyVal = key.val();

    while (getImage) {
      console.log(index)
      const pictureGet = await get(ref(database, `pictures/${keyVal}/${index}`))

      if (pictureGet.exists()) {
        pictures.push(pictureGet.val());
      } else {
        getImage = false
      }
      index++
    }

    resolve(pictures)
  });
}

// ACCOUNT
export function readingToken() {
  return new Promise((resolve, reject) => {
    const token = localStorage.getItem('token') ?? null;

    if (token) {
      const account = ref(database, `account/`);
      const getToken = query(account, orderByChild('token'), equalTo(token));

      get(getToken)
        .then((userToken) => {
          if (userToken.exists()) {
            const data = Object.entries(userToken.val())[0]
            const userData = {
              userId: data[0],
              username: data[1].username,
              photoprofile: data[1]['photo-profile'] ?? './asset/defaultprofile.png'
            }

            localStorage.setItem('userId', data[0])
            resolve(userData)
          } else {
            reject();
          }
        })
        .catch((error) => {
          if (String(error).includes('offline')) {
            window.location.reload()
          }
          console.error('Error:', error);
        });
    } else {
      resolve(false);
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
              const userToken = ref(database, `account/${localStorage.getItem('userId')}`)

              update(userToken, {
                token: token
              })
                .then(() => {
                  localStorage.setItem('token', token);
      
                  setTimeout(() => {
                    window.location.href = '../'
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
    const account = ref(database, `account/`)
    const getUser = query(account, orderByChild('username'), equalTo(username))

    get(getUser)
      .then((user) => {
        if (user.exists()) {

          reject('This username Already exists')

        } else {

          async function sign() {
            const config = await setupConfig('../');
            const hashPassword = await hashing(password);
            const id = ranhex(16);
            const token = ranhex(32);
            const now = timeNow();

            const newuser = ref(database, `account/` + id)
              
            set(newuser, {
              username: username,
              password: hashPassword,
              token: token,
              config: config,
              timestamp: {
                create_at: now,
                update_at: ""
              }
            })
              .then(() => {
                console.log('Data added successfully');
  
                localStorage.setItem('token', token);

                setTimeout(() => {
                  window.location.href = '../'
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

export function newPhotoProfile(img) {
  return new Promise(async(resolve, reject) => {
    const check = await readingToken();

    if (!check) {
      reject()
    }

    const refUser = ref(database, `account/${check.userId}/photo-profile`);
    
    await set(refUser, img)
      .then(() => {
        resolve('Data added successfully');
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  });
}

export function wordCount(words) {
  return (
    String(words).split(' ').filter(Boolean).length +
    String(words).split('\n').filter(Boolean).length - 1
  ) ;
}

export function letterCount(words) {
  return (
    String(words).length
  )
}

export function getAuthor(userId) {
  return new Promise(async(resolve, reject) => {
    const refUser = ref(database, `account/${userId}`);
  
    const getUser = await get(refUser)
    const user = getUser.val()
    resolve(user ? `@${user.username}` : `deleted user ( @${userId} )`)
  });
}

export function getIdByUsername(username) {
  return new Promise(async(resolve, reject) => {
    const refUser = ref(database, 'account/');
    const queryUser = query(refUser, orderByChild('username'), equalTo(username));
  
    const getUser = (await get(queryUser)).val();
    resolve(Object.keys(getUser)[0])
  });
}
window.y = getIdByUsername

export function getAllMessage() {
  return new Promise(async(resolve, reject) => {
    const refMessage = ref(database, 'message/')
    const userMessage = query(refMessage, orderByChild('author'), equalTo(localStorage.getItem('userId')));

    const getUserMessage = await get(userMessage);
    const data = getUserMessage.val();
    delete data.pictures

    const keys = data ? Object.keys(data) : '';
    const dataLength = data ? keys.length : 0;
    let list = {}
    
    if (data) {
  
      keys.forEach((key, index) => {
        const value = data[key]
        list[key] = {
          title: decrypt(value.title),
          description: decrypt(value.description),
          config: value.config
        }
      });
    }
    const response = {
      sumData: dataLength,
      message: list ?? null
    }

    resolve(response)
  });
}
















export function encrypt(text) {
  console.log(text)
  var unicode = Array.from(text).map(ord => ord.codePointAt(0));
  return unicode.map(hex => hex.toString(16)).join('g')
}

export function decrypt(text) {
  var ununicode = text.split('g').map(uni => {
    const ununi = String.fromCodePoint(parseInt(uni, 16));

    if (ununi == '\n') {
      return "<br>"
    } else {
      return ununi
    }
  });

  return ununicode.join('').split('<br>');
}

export function checkUser() {
  return new Promise(async (resolve, reject) => {
    
    try {
      const user = ref(database, `account/${localStorage.getItem('userId')}`)
    
      if (localStorage.getItem('token') && localStorage.getItem('userId')) {
    
      get(user)
        .then((snapshot) => {
          if (snapshot.exists()) {
            const dataUser = snapshot.val();
    
            if (localStorage.getItem('token') == dataUser.token) {
              resolve({
                username: dataUser.username,
                config: dataUser.config
              })
            } 
          } 
        })
        .catch((error) => {
          console.error('Error:', error);
        });
      } else {
        resolve(false)
      }
    } catch (error) {
      console.error('Error:', error.message);
    }
  });
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

function getMessageId() {
  const url = window.location
  
  if (String(url.path).includes('Mail.html')) {
    const query = url.search
    var param = query.replace(/&amp;/g, '&').replace(/%20/g, ' ').slice(1).split('&')
  
    var x;
    var id;
    param.map(i => {
      x = i.split('=')
      if (x[0] == 'id') {
        id = x[1]
        return id
      }
    })
  } else {
    return localStorage.getItem('id')
  }
}

export function timeNow() {
  const now = new Date();
  return now.toLocaleString();
}