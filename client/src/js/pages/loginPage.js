import { supabase } from "../../lib/supabaseClient.js";

export function renderLoginPage(container, router) {
  container.innerHTML = `
    <div class="container">
      <h2>Вхід</h2>

      <input type="email" id="email" placeholder="Email" />
      <input type="password" id="password" placeholder="Пароль" />

      <button id="loginBtn">Увійти</button>
    </div>
  `;

  document.getElementById("loginBtn").onclick = async () => {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert(error.message);
    } else {
      history.pushState({}, "", "?page=profile");
      router();
    }
  };
}
