import { supabase } from "../../lib/supabaseClient.js";

export function renderRegisterPage(container, router, back) {
  container.innerHTML = `
      <div class="container register-container">
        <div class="register-top">
          <img src="/img/avatar.jpg" alt="avatar" class="avatar" />
          <div>
            <h2>Реєстрація</h2>
            <p>Запаліть іскру творчості!</p>
          </div>
        </div>

        <div class="register-form">
          <div class="row">
            <input type="text" id="name" placeholder="Ім'я" />
            <input type="text" id="secondname" placeholder="Прізвище" />
          </div>
          <input type="email" id="email" placeholder="Email" class="email"/>
          <input type="password" id="password" placeholder="Пароль" />
          <input
            type="password"
            id="password-confirm"
            placeholder="Підтвердження паролю"
          />
          <div class="roles">
            <label>
              <input type="radio" name="role" value="student" />
              <span>СТУДЕНТ</span>
            </label>

            <label>
              <input type="radio" name="role" value="mentor" />
              <span>МЕНТОР</span>
            </label>

            <label>
              <input type="radio" name="role" value="curator" />
              <span>КУРАТОР</span>
            </label>
          </div>

          <label class="terms">
            <input type="checkbox" id="terms" />
            <span>
              Я погоджуюсь з Умовами використання та політикою Конфіденційності Art Osvita
            </span>
          </label>
        </div> 
        <button id="registerBtn" class="goRegister gr reg-btn">Зареєструватися</button>
        <p class="login-link">
          Вже є обліковий запис?
          <a href="?page=login">Увійти</a>
        </p>
        </div>
    `;
  container.prepend(back);
  document.body.classList.remove("landing");

  const btn = document.getElementById("registerBtn");
  btn.onclick = async () => {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    btn.disabled = true;

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    btn.disabled = false;

    if (error) {
      if (error.message.includes("rate limit")) {
        alert("Забагато спроб. Спробуй через 1-2 хвилини 🙏");
      } else {
        alert(error.message);
      }
      return;
    } else {
      alert("Успішна реєстрація!");
      history.pushState({}, "", "?page=login");
      router();
    }
    const userId = data.user?.id;

    if (userId) {
      await supabase.from("profiles").insert([
        {
          id: userId,
          student_id: null, // пока не выбран
        },
      ]);
    }
  };
}
