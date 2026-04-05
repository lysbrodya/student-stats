import { supabase } from "../../lib/supabaseClient.js";

export function renderLoginPage(container, router, back) {
  container.innerHTML = `
    <div class="container register-container">
      <div class="register-top">
        <img src="/img/avatar.jpg" alt="avatar" class="avatar" />
        <div>
          <h2>Авторизація</h2>
          <p>Запаліть іскру творчості!</p>
        </div>
      </div>
<div class="register-form">
      <input type="email" id="email" placeholder="Email" class="dark-input"/>
      <input type="password" id="password" placeholder="Пароль" class="dark-input"/>
</div>
      <button id="loginBtn" class="goRegister gr reg-btn">Вхід</button>
    </div>
  `;

  container.prepend(back);
  document.body.classList.remove("landing");

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
