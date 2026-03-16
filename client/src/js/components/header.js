// const BASE_PATH = location.hostname.includes("github.io") ? "/Artosvita-js" : "";

export function initHeader() {
  const header = document.getElementById("header");
  if (!header) return;

  header.innerHTML = `
    <div class="header__container container">
        <a class="logo" href="/index.html">         
          <svg class="logo-svg" width="30" height="30">
            <use href="/sprite.svg#icon-logo"></use>
          </svg>
        </a>
        <p>ART OSVITA</p>
              <button class="mob-menu" aria-label="Відкрити меню" type="button">                  <span class="icon">
                    <span class="icon-line icon-line--t"></span>
                    <span class="icon-line icon-line--b"></span>
                  </span></button>
      </div>
  `;
}
