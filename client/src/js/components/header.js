// const BASE_PATH = location.hostname.includes("github.io")
//   ? "/Artosvita-js"
//   : "";
import { supabase } from "../../lib/supabaseClient.js";
export function initHeader(router) {
  const header = document.getElementById("header");
  if (!header) return;

  header.innerHTML = `
    <div class="header__container container">
        <a class="logo" href="/" id="logoLink">
          <svg class="logo-svg" width="30" height="30">
            <use href="/sprite.svg#icon-logo"></use>
          </svg>
        </a>
        <p>ART OSVITA</p>
              <button class="mob-menu" id="logoutBtn" aria-label="Відкрити меню" type="button">                  <span class="icon">
                    <span class="icon-line icon-line--t"></span>
                    <span class="icon-line icon-line--b"></span>
                  </span></button>
      </div>
  `;
  const btn = document.getElementById("logoutBtn");

  btn.onclick = async () => {
    await supabase.auth.signOut();

    history.pushState({}, "", "/");
    router();
  };

  const logo = document.getElementById("logoLink");

  logo.onclick = async (e) => {
    e.preventDefault();

    const { data: userData } = await supabase.auth.getUser();
    const user = userData.user;

    if (!user) {
      history.pushState({}, "", "/");
    } else {
      history.pushState({}, "", "?page=profile");
    }

    router();
  };
}
