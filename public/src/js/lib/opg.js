import { envelopeLoad } from "../../../pages/envelope/envelope.js";
import { forumLoad } from "../../../pages/forum/forum.js";
import { friendLoad } from "../../../pages/friend/friend.js";
import { mainLoad, preview } from "../../../pages/main/main.js";
import { defineLogout, loadAcc } from "./authing.js";
import { colorChange } from "./sidebar.js";

export const dataUser = {
  data: {}
}

document.addEventListener("DOMContentLoaded", () => {
  if (!localStorage.getItem("onPage")) {
    localStorage.setItem("onPage", 1);
  }

  localStorage.removeItem("preview");
  localStorage.removeItem("loadFriendList");
  localStorage.removeItem("id");

  window.addEventListener("resize", secResponsive);

  (async () => {
    loadPage();
    intoNew();

    await loadAcc();

  })();
});

function intoNew() {
  const status = localStorage.getItem("neww");
  const white = document.querySelector(".wht-screen");

  if (status) {
    setTimeout(() => {
      white.style.opacity = 0;

      localStorage.removeItem("neww");
    }, 1000);
  } else {
    white.style.display = "none";
  }
}

export function secResponsive(e) {
  const status = localStorage.getItem("profile");
  const profile = document.querySelector(".sec-section");

  if ((status && !e) || (!status && e)) {
    profile.style.removeProperty("grid-template-columns");
  } else if ((!status && !e) || (status && e)) {
    const mode = localStorage.getItem("mode");

    profile.style.gridTemplateColumns = mode == "false" ? "1fr 300px" : "0 1fr";
  }
}

export function loadPage(id) {
  if (id == localStorage.getItem("onPage")) {
    return;
  } else if (id) {
    localStorage.setItem("onPage", id);
  }

  clearPage();

  const page = localStorage.getItem("onPage");

  if (page == 1) {
    mainLoad();
  } else if (page == 2) {
    friendLoad();
  } else if (page == 3) {
    envelopeLoad();
  } else if (page == 4) {
    forumLoad();
  }

  colorChange("#ffffff");
  localStorage.removeItem("preview");
  preview(undefined, 1);
}

function clearPage() {
  const style = document.querySelector("#styleOpg");
  const script = document.querySelector("#scriptOpg");
  const main = document.querySelector(".main");

  main.innerHTML = "";
  style.href = "";
  script.src = "";
}
