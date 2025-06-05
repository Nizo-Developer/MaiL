import { login, signup } from "../module/module.mjs";
import { addCircle, particle } from "./particle.js";

const type = window.location.pathname.includes('signup') ? 1 : 2;
const form = document.querySelector("form");

const lUsername = document.querySelector('.label1');
const lPassword = document.querySelector('.label2');
const lConfirm = type == 1 ? document.querySelector('.label3') : '';

document.addEventListener("DOMContentLoaded", () => {
  responsive();
  addCircle();

  window.addEventListener("resize", responsive);
  form.addEventListener("submit", loginacc);
  window.addEventListener("mousemove", particle);
});

async function loginacc(event) {
  event.preventDefault();


  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  const confirm = type == 1 ? document.getElementById('confirm').value : '';

  try {
    if (type == 1) {
      if (password == confirm && username && password && confirm) {
        const register = await signup(
          username,
          password
        )
      } else {
        lPassword.style.color = 'red';
        lConfirm.style.color = 'red';
        if (!(username && password && confirm)) {
          lUsername.style.color = 'red';
        }

        setTimeout(() => {
          lPassword.removeAttribute('style');
          lConfirm.removeAttribute('style');
          lUsername.removeAttribute('style');
        }, 3000);
      }
    } else {
      const submit = await login(username, password);

      console.log(submit);
    }

  } catch (error) {
    console.error("Error:", error);
  }
}

function responsive() {
  var form = document.querySelector("form");
  var scale = window.innerWidth * 0.4;

  form.style.width = (scale > 280 ? scale : 280) + "px";
}
