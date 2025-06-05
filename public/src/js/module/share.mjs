import { getDatabase, ref, set, get, update, push, query, orderByChild, equalTo, remove, child } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-database.js";
import { database, getIdByUsername, timeNow, readingToken, decrypt } from "./module.mjs";

export function shareMessage(id, user) {
  return new Promise(async(resolve, reject) => {
    const userId = (await getIdByUsername(user));
    const now = timeNow();

    const refShareUser = ref(database, 'share/share_user/');
    const queryChildUser = await query(refShareUser, orderByChild('user_id'), equalTo(userId));
    
    const getShareUser = (await get(refShareUser)).val();
    const checkUser = (await get(queryChildUser)).val();

    console.log(checkUser)
    const listId = Object.values(Object.values(checkUser)[0].shared_message.map(item => item.message_id));
    
    if (listId.includes(id)) {
      reject("You already share this message!")
      return
    }
    
    if (!checkUser) {
      const refUser = ref(database, 'share/share_user/user' + Object.keys(getShareUser).length)

      await set(refUser, {
        user_id: userId,
        shared_message: {
          0: {
            message_id: id,
            timestamp: {
              create_at: now,
              update_at: ""
            }
          }
        }
      })
      .then(() => {
        console.log('Data added successfully');
      })
      .catch((error) => {
        console.error('Error:', error);
      });
    } else {
      const reference = 'share/share_user/' + Object.keys(checkUser)[0] + '/shared_message/'
      const refLengthUser = ref(database, reference)
      
      const getUser = (await get(refLengthUser)).val();
      const lengthUser = Object.keys(getUser).length;

      const refUser = ref(database, reference + lengthUser + '/')
      
      await set(refUser, {
        message_id: id,
        timestamp: {
          create_at: now,
          update_at: ""
        }
      })
      .then(() => {
        console.log('Data added successfully');
      })
      .catch((error) => {
        console.error('Error:', error);
      });
    }  

    const refShareMessage = ref(database, 'share/share_message/');
    const queryChildMessage = await query(refShareMessage, orderByChild('message_id'), equalTo(id));
    
    const getShareMessage = (await get(refShareMessage)).val();
    const checkMessage = (await get(queryChildMessage)).val();

    console.log(checkMessage)
    
    if (!checkMessage) {
      const refMessage = ref(database, 'share/share_message/message' + Object.keys(getShareMessage).length)

      await await set(refMessage, {
        message_id: id,
        shared_user: {
          0: {
            user_id: userId
          }
        }
      })
      .then(() => {
        console.log('Data added successfully');
      })
      .catch((error) => {
        console.error('Error:', error);
      });
    } else {
      const reference = 'share/share_message/' + Object.keys(checkMessage)[0] + '/shared_user/'
      const refLengthMessage = ref(database, reference)
      
      const getMessage = (await get(refLengthMessage)).val();
      const lengthMessage = Object.keys(getMessage).length;

      const refMessage = ref(database, reference + lengthMessage + '/')

      await set(refMessage, {
        user_id: userId
      })
      .then(() => {
        console.log('Data added successfully');
      })
      .catch((error) => {
        console.error('Error:', error);
      });
    }  
  });

}

export function getAllSharedMessage() {
  return new Promise(async(resolve, reject) => {
    const userId = (await readingToken()).userId;
    const refMessage = ref(database, 'share/share_user/')
    const messageId = query(refMessage, orderByChild('user_id'), equalTo(userId));

    const getMessageId = await get(messageId);
    console.log(getMessageId.val())
    const data = getMessageId.val() ? Object.values(getMessageId.val())[0].shared_message : null;
    const dataLength = data ? data.length : 0;

    console.log(data)

    
    
    let list = {}
    
    
    if (data) {
      
      for (const d of data) {
        const id = d.message_id

        const refMessage = ref(database, `/message/${id}`);
        const getMessage = await get(refMessage);
        const message = getMessage.val()

        console.log(message)

        const value = message
        list[id] = {
          title: decrypt(value.title),
          description: decrypt(value.description),
          config: value.config
        }
      }
    }
    const response = {
      sumData: dataLength,
      message: list ?? null
    }

    resolve(response)
  });
}