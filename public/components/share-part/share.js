import { copy, pathtomail } from "../../src/js/lib/tool.js";
import { getAllFriend } from "../../src/js/module/friend.mjs";
import { shareMessage } from "../../src/js/module/share.mjs";

document.addEventListener("DOMContentLoaded", () => {
  localStorage.removeItem("loadShareFriend");
  localStorage.removeItem("share");

  const back = document.querySelector("#back");
  const search = document.querySelector(".share-head #search");
  const copyLink = document.querySelector("#copyLink");

  back.addEventListener("click", toggleShare);
  search.addEventListener("input", searchShareFriend);
  copyLink.addEventListener("click", copy);

  (async () => {
    await loadList();

    const shareBtn = document.querySelectorAll(".friend #send");
    shareBtn.forEach((e) => {
      e.addEventListener("click", sendMessage);
    });
  })();
});

function shareResponsive() {
  const main = document.querySelector(".main");
  const shareWrapper = document.querySelector(".share-wrapper");

  // shareWrapper.style.width = main.getBoundingClientRect().width + 'px';
}

export function toggleShare(e, type) {
  const status = localStorage.getItem("share");

  const id =
    e && !type ? e.target.getAttribute("share-id") : localStorage.getItem("id");

  if (id != null) {
    const path = pathtomail() + "Mail.html?id=" + id;

    const idHolder = document.querySelector("div[message-id]");
    idHolder.setAttribute("message-id", id);

    const linkHolder = document.querySelector("#copyLink p");
    linkHolder.textContent = path;
  }

  const background = document.querySelector(".background");
  const sharePage = document.querySelector(".share-page");

  if (!status) {
    background.style.backdropFilter = "blur(1px)";
    sharePage.style.top = "0";
  } else {
    background.style.removeProperty("backdrop-filter");
    sharePage.style.removeProperty("top");
  }

  !status ? localStorage.setItem("share", 1) : localStorage.removeItem("share");
}

async function loadList() {
  if (
    localStorage.getItem("loadShareFriend") ||
    localStorage.getItem("onPage") == "2"
  ) {
    return;
  }

  localStorage.setItem("loadShareFriend", 1);

  const shareFriend = document.querySelector(".share-friend");

  const data = await getAllFriend();

  const shareFriendList = document.querySelector(".share-friendlist");

  shareFriendList.innerHTML = "";

  if (data) {
    const userData = Object.values(data.friend);

    if (userData.length > 0) {
      userData.forEach((user, index) => {
        shareFriendList.innerHTML += `
        <div class="friend">
          <div id="name" name-id="${index}">${user.username}</div>
          <div id="send" x-data="${index}">
            <img src="./asset/send.svg" alt="send" height="15">
          </div>
        </div>`;
      });
    } else {
      shareFriend.style.flex = "1";
      shareFriend.style.alignItems = "center";
      shareFriend.style.justifyContent = "center";
      shareFriend.innerHTML = "You doesn't have Friend";
    }
  }

  localStorage.removeItem("loadShareFriend");

  return;
}

function searchShareFriend() {
  const search = document.querySelector(".share-head #search");
  const query = search.value.toLowerCase();
  const items = document.querySelectorAll(".share-friendlist .friend");

  let isFound = false;

  items.forEach((e) => {
    const name = e.querySelector("#name").textContent.toLowerCase();

    if (name.includes(query)) {
      e.style.display = "flex";
      isFound = true;
    } else {
      e.style.display = "none";
    }
  });

  shareLog("No Message Found", isFound);
}

function shareLog(message, type) {
  const mail = document.querySelector(".share-log");

  mail.textContent = message;

  if (type == true) {
    mail.style.display = "none";
  } else if (type == false) {
    mail.style.display = "flex";
  }
}

function sendMessage(e) {
  const id = document
    .querySelector("div[message-id]")
    .getAttribute("message-id");
  const user = document.querySelector(
    `.friend #name[name-id="${e.target.getAttribute("x-data")}"]`
  ).textContent;

  shareMessage(id, user);
}
