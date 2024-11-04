import { loadAcc } from "./authing.js";
import { readingToken } from "../module/module.mjs";
import { portal } from "./tool.js";

document.addEventListener('DOMContentLoaded', () => {
  (async () => {

    await loadAcc('../');

    const auth = await readingToken();
    
    if (!auth) {
      portal();
    }

    home.addEventListener('click', () => {
      portal();
    });
    friend.addEventListener('click', () => {
      window.location.href = '../friend'
    });
  })()
})