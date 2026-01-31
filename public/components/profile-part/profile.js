import { secResponsive } from "../../src/js/lib/opg.js";
import { toggleUpload } from "../up-image-part/up-image.js";

document.addEventListener("DOMContentLoaded", () => {
  localStorage.removeItem("profile");

  const back = document.querySelector(".profile-back");

  back.addEventListener("click", toggleProfile);
});

export function toggleProfile(e, type) {
  const status = localStorage.getItem("profile");
  const mode = localStorage.getItem("mode");

  secResponsive();

  if (!status && type) {
    localStorage.setItem("profile", 1);
  } else if (status && !type) {
    localStorage.removeItem("profile");
    toggleUpload();
  }
}
