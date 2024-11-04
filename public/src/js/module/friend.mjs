import { getDatabase, ref, set, get, update, push, query, orderByChild, equalTo, remove } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-database.js";
import { database, getIdByUsername, timeNow, readingToken } from "./module.mjs";

export function acceptFriend(username) {
  return new Promise(async(resolve, reject) => {
    const userId = localStorage.getItem('userId');
    const otherId = await getIdByUsername(username);
    const now = timeNow();

    const combination_key = combine_key(userId, otherId);
    console.log(combination_key)
    const refFriend = ref(database, 'friend/');
    const queryFriend = query(refFriend, orderByChild('comb_key'), equalTo(combination_key));
    const dataFriend = (await get(queryFriend)).val();

    const data = Object.entries(dataFriend)[0];
    console.log(data)
    data[1].status = 'accepted';

    const updates = {}
    updates[`friend/${data[0]}`] = data[1];
    
    update(ref(database), updates)
      .then(() => {
        resolve('Data added successfully');
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  });
}

export function unFriend(username) {
  return new Promise(async(resolve, reject) => {
    const userId = localStorage.getItem('userId');
    const otherId = await getIdByUsername(username);
    const now = timeNow();

    const combination_key = combine_key(userId, otherId);
    console.log(combination_key)
    const refFriend = ref(database, 'friend/');
    const queryFriend = query(refFriend, orderByChild('comb_key'), equalTo(combination_key));
    const dataFriend = (await get(queryFriend)).val();

    const data = Object.entries(dataFriend)[0];
    console.log(data)

    const detele = [
      `friend/${data[0]}`,
    ];
    
    const deletePromises = detele.map(node => {
      const nodeRef = ref(database, node);
      return remove(nodeRef);
    });
    
    Promise.all(deletePromises)
      .then(() => {
        resolve("Remove friend succesfully");
      })
      .catch((error) => {
        console.error("Penghapusan node gagal: ", error);
      });
  });
}

export function addFriend(username) {
  return new Promise(async(resolve, reject) => {
    const refUserId = ref(database, 'account/');
    const refFriend = ref(database, 'friend/')
    const snapshot = await get(refFriend);
    const keys = Object.keys(snapshot.val());
    const friend_id = keys.length;

    const friendId = query(refUserId, orderByChild('username'), equalTo(username));
    const getId = await get(friendId);
    if (!getId.val()) {
      reject('Username not found!');
    } else {
      const id = Object.keys(getId.val());
  
      const userId = localStorage.getItem('userId');
  
      const combination_key = combine_key(userId, id[0])
  
      // ? Mengecek apakah ada user dengan requestan sama
  
      const checkShip = query(refFriend, orderByChild('comb_key'), equalTo(combination_key));
      const ship = await get(checkShip);
  
      if (!ship.val()) {
  
        if (id[0] == localStorage.getItem('userId')) {
          reject("You can't make a friendship with your self :<");
        } else {
  
          if (!ship.val()) {
  
            const now = timeNow();
    
            const statusFriend = {
              request: userId,
              ask: id[0],
              comb_key: combination_key,
              since: now,
              status: "request"
            };
            
            const updates = {}
            updates[`friend/ship${friend_id}`] = statusFriend;
    
            update(ref(database), updates)
              .then(() => {
                resolve('Data added successfully');
              })
              .catch((error) => {
                console.error('Error:', error);
              });
          } else {
            
          }
        }
      } else {
        reject(`You have send friend request or You has friendship with ${username}`)
      }
    }
  });
}

export function getAllFriend(userId = localStorage.getItem('userId'), type = 1) {
  return new Promise(async(resolve, reject) => {
    const refFriend = ref(database, 'friend/');
    const queryRequest = query(refFriend, orderByChild('request'), equalTo(userId));
    const queryAsk = query(refFriend, orderByChild('ask'), equalTo(userId));

    const request = (await get(queryRequest)).val();
    const ask = (await get(queryAsk)).val();
    const data = {request, ask}
    console.log(data)

    let dataLength = 0;
    let dataLengthAll = 0;

    let list = {};

    if (data) {

      let accFriend = {}
      Object.values(data).forEach((d, index) => {
        if (d) {
          Object.values(d).forEach(x => {
            if (type == 1 && x.status == 'accepted') {
              if (index == 1) {
                x["type"] = 2;
              } else if (index == 0) {
                x["type"] = 3;
              }
              accFriend[Object.values(accFriend).length] = x
            } else if (x.status == 'request') {
              if (type == 2 && index == 1) {
                accFriend[Object.values(accFriend).length] = x
              } else if (type == 3 && index == 0) {
                accFriend[Object.values(accFriend).length] = x
              }
            }
          })
        }
      })
  
      dataLength = Object.keys(accFriend).length;
      dataLengthAll = Object.keys(data).length;
      console.log(accFriend)

      let promises = [];
      
      Object.values(accFriend).forEach((user, index) => {
        const refAccount = ref(database, 'account/' + user[setRequestAsk(type, user)]);
        console.log(user)
        
        const promise = get(refAccount).then((userData) => {
          const userDataValue = userData.val();

          list[index] = {
            username: userDataValue.username,
            status: user.status,
          };
        });

        promises.push(promise);
      });

      await Promise.all(promises);
    }
    
    const response = {
      allData: dataLengthAll,
      lengthData: dataLength,
      friend: list ?? null 
    }
    console.log(response)
    resolve(response)
  });
}

window.x = getAllFriend

async function getFriendData(username, type = 1) {
  const friendId = await getIdByUsername(username);
  console.log(friendId)
  const friendData = await getAllFriend(friendId, type);
  console.log(friendData)
  const friendList = friendArray(friendData);
  console.log(friendList);
  const user = await readingToken();
  console.log(user)
  return {
    id: friendId,
    userno: user.username >= 0 ? friendList.indexOf(user.username) : 0
  };
}

function friendArray(data) {
  return Object.values(data.friend).map(d => d.username)
}

function combine_key(first, second) {
  return (parseInt(first, 16) + parseInt(second, 16)).toString(16);
}

function setRequestAsk(type, data) {
  if (type == 1) {
    if (data.type == 2) {
      return "request"
    } else {
      return "ask"
    }
  } else if (type == 2) {
    return "request"
  } else if (type == 3) {
    return "ask"
  }
}
