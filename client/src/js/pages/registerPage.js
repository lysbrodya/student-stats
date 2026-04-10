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
            <input type="text" id="name" placeholder="Ім'я"  class="gray-input"/>
            <input type="text" id="secondname" placeholder="Прізвище"  class="gray-input"/>
          </div>
          <input type="email" id="email" placeholder="Email" class="gray-input"/>
          <input type="password" id="password" placeholder="Пароль"  class="dark-input"/>
          <input
            type="password"
            id="password-confirm"
            placeholder="Підтвердження паролю" class="dark-input"
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

  const roleInputs = document.querySelectorAll('input[name="role"]');

  roleInputs.forEach((input) => {
    input.addEventListener("click", function () {
      if (this.dataset.checked === "true") {
        this.checked = false;
        this.dataset.checked = "false";
      } else {
        roleInputs.forEach((i) => (i.dataset.checked = "false"));
        this.dataset.checked = "true";
        this.checked = true;
      }
    });
  });
  container.prepend(back);
  // document.body.classList.remove("landing");
  document.body.classList.add("profile-bcg");

  const btn = document.getElementById("registerBtn");
  btn.onclick = async () => {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const formInputs = document.querySelectorAll(
      '#email, #password, input[name="role"], #terms',
    );

    function validateForm() {
      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;
      const role = document.querySelector('input[name="role"]:checked');
      const terms = document.getElementById("terms").checked;

      btn.disabled = !(email && password && role && terms);
    }

    formInputs.forEach((el) => {
      el.addEventListener("input", validateForm);
      el.addEventListener("change", validateForm);
    });
    btn.disabled = true;
    const selectedRole = document.querySelector('input[name="role"]:checked');
    const termsAccepted = document.getElementById("terms").checked;

    if (!selectedRole) {
      alert("Оберіть роль 👇");
      return;
    }

    if (!termsAccepted) {
      alert("Потрібно погодитись з умовами 🙏");
      return;
    }
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
