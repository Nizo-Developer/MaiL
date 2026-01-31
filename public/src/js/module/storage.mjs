import { initializeApp } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js";
import { getFirestore, query, doc, collection, setDoc, addDoc, getDoc, getDocs, serverTimestamp } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-firestore.js";
import { setupConfig, checkUser, database, timeNow } from "./module.mjs";

const firebaseConfig = {
  apiKey: window.API_TOKEN,
  authDomain: "epistura-b75d5.firebaseapp.com",
  databaseURL:
    "https://epistura-b75d5-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "epistura-b75d5",
  storageBucket: "epistura-b75d5.firebasestorage.app",
  messagingSenderId: "936418042824",
  appId: "1:936418042824:web:af7bc8e5eb45968a7456fd",
  measurementId: "G-BJFLM128GE",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const forumType = {
  'question': 1
}

export async function addData(path, data) {
  const pathArray = path.split("/");

  const dbCollection = collection(db, "data", ...pathArray);

  try {
    const post = await addDoc(dbCollection, data);

    return post.id;
  } catch (error) {
    console.error(error);
  }
}

export async function getData(path) {
  const pathArray = path.split("/");
  const docRef = doc(db, "data", ...pathArray);

  try {
    const docData = await getDoc(docRef);

    if (docData.exists()) {
      return docData.data();
    } else {
      console.error("Not Found");
      window.location.href = './404.html'
    }
  } catch (error) {
    console.error("Error: " + error);
  }
}

export async function getMultipleData(path, where) {
  const pathArray = path.split("/");
  let q = collection(db, "data", ...pathArray);

  if (where) {
    const child = Object.entries(where);
    const conditions = child.map(([property, value]) => where(property, '==', value));

    q = query(q, ...conditions);
  }

  try {
    const docData = await getDocs(q);

    if (docData.exists()) {
      return docData.data();
    }
  } catch (error) {
    console.error("Error: " + error);
  }
}

export async function postPicture(picture) {
  const path = "picture/data";

  console.log(picture)
  const data = {};
  picture.map((pict, index) => {
    data[index] = {
      url: pict[0],
      caption: pict[1],
    }
  });

  console.log(data)

  try {
    return await addData(path, data);
  } catch (error) {
    console.error(error);
  }
}

export async function getPicture(key) {
  const path = "picture/data/" + key;

  try {
    return getData(path);
  } catch (error) {
    console.error(error);
  }
}

export async function postMessage(title, description, pictures) {
  try {
    const config = await setupConfig();
    const user = await checkUser();
    const path = 'message/data'

    let uniqueKey = null;
    console.log(pictures)
    if (pictures !== null) {
      uniqueKey = await postPicture(pictures);
    }

    const message = await addData(path, {
      title: title,
      description: description,
      pictures: uniqueKey,
      author: user ? localStorage.getItem("userId") : "anonymous",
      config: config,
      timestamp: {
        create_at: serverTimestamp(),
        update_at: "",
      },
    });

    return message;

  } catch (error) {
    console.error("Error saving data: ", error);
  }
}

export async function getMessage(key) {
  try {
    const path = "message/data/" + key;

    const result = await getData(path);

    console.log(result)

    const pictures = result.pictures ? await getPicture(result.pictures) : null;
    
    const data = {
      author: result.author,
      title: result.title,
      description: result.description,
      config: result.config,
      pictures: pictures,
    };

    console.log(data)

    return data;

  } catch (error) {
    console.error();
  }
}

export async function postForum(title, type) {
  try {
    const user = await checkUser();
    const path = 'forum/data'

    const forum = await addData(path, {
      title: title,
      type: forumType[type.toLowerCase()],
      author: user ? localStorage.getItem("userId") : "anonymous",
      timestamp: {
        create_at: serverTimestamp(),
        update_at: "",
      },
    });

    return forum;

  } catch (error) {
    console.error("Error saving data: ", error);
  }
}

export async function allForum() {
  try {

    const path = "forum/data/";
    console.log('pppp')
    const result = await getMultipleData(path, {
      author: localStorage.getItem('userId')
    });
    console.log('pppp')

    console.log(result)

    const pictures = result.pictures ? await getPicture(result.pictures) : null;
    
    const data = {
      author: result.author,
      title: result.title,
      description: result.description,
      config: result.config,
      pictures: pictures,
    };

    console.log(data)

    return data;

  } catch (error) {
    console.error();
  }
}

export async function getForum(key) {
  try {
    const path = "forum/data/" + key;

    const result = await getData(path);

    console.log(result)

    const pictures = result.pictures ? await getPicture(result.pictures) : null;
    
    const data = {
      author: result.author,
      title: result.title,
      description: result.description,
      config: result.config,
      pictures: pictures,
    };

    console.log(data)

    return data;

  } catch (error) {
    console.error();
  }
}
