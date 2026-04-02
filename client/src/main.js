import {
  getSprints,
  getStudents,
  getStudent,
  getTasks,
  getStreams,
} from "./js/api/api.js";
import { initHeader } from "./js/components/header.js";
import { applyColors } from "./js/utils/applyColors.js";
import { renderStudentPage } from "./js/pages/studentPage.js";
import { renderSprintPage } from "./js/pages/sprintPage.js";
import { createStudentRow } from "./js/components/studentRow.js";
import { runCronIfNeeded } from "./js/utils/cron.js";
import { renderRegisterPage } from "./js/pages/registerPage.js";
import { renderLoginPage } from "./js/pages/loginPage.js";
import { renderSelectStudentPage } from "./js/pages/selectStudentPage.js";
import { supabase } from "./lib/supabaseClient.js";
import { renderStudentHomePage } from "./js/pages/profilePage.js";

async function renderLandingPage() {
  runCronIfNeeded();
  document.body.classList.add("landing");
  studentsContainer.innerHTML = "";
  sprintsContainer.innerHTML = "";

  const wrapper = document.createElement("section");
  wrapper.classList.add("landing-page");

  wrapper.innerHTML = ` 
      <div class="container landing-main-img">
        <div> <img src="/img/Frame 2087326902.png" alt=""> 
        </div>
        <h1 class="landing-main-title">Система трекінгу навчального прогресу </br> для студентів Art Osvita</h1>
      </div>
      <div class="container reg-container ">
        <button class="goRegister gr" id="goRegister">Реєстрація   </button>
        <button class="goRegister goLogin" id="goLogin">Увійти </button>
      </div>

  `;

  studentsContainer.appendChild(wrapper);

  document.getElementById("goRegister").onclick = () => {
    history.pushState({}, "", "?page=register");
    router();
  };

  document.getElementById("goLogin").onclick = () => {
    history.pushState({}, "", "?page=login");
    router();
  };
}

const studentsContainer = document.querySelector("#students");
const sprintsContainer = document.querySelector("#sprints");

initHeader(router);

let studentsMap = {};

const back = document.createElement("button");
back.innerHTML = `
    <svg class="left-svg" width="11.5" height="11.5">
      <use href="/sprite.svg#icon-back"></use>
    </svg>
    <span>Назад</span>
`;
back.classList.add("btn-back");

back.onclick = () => {
  history.back();
};

async function router() {
  studentsContainer.innerHTML = "";
  sprintsContainer.innerHTML = "";

  const { data: userData } = await supabase.auth.getUser();
  const user = userData.user;

  const params = new URLSearchParams(window.location.search);
  const page = params.get("page");
  const studentId = params.get("student");
  const sprintName = params.get("sprint");
  const streamId = params.get("stream");

  // 👉 1. НЕ ЗАЛОГИНЕН
  if (!user) {
    if (page === "register") {
      renderRegisterPage(studentsContainer, router, back);
      return;
    }

    if (page === "login") {
      renderLoginPage(studentsContainer, router, back);
      return;
    }

    // по умолчанию
    await renderLandingPage();
    return;
  }

  // 👉 2. ЗАЛОГИНЕН — получаем профиль
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  // 👉 3. ЕСЛИ НЕТ student_id → выбор студента
  if (!profile?.student_id) {
    renderSelectStudentPage(studentsContainer, router);
    return;
  }

  // 👉 4. ЕСЛИ ЗАЛОГИНЕН — НЕ ПУСКАЕМ В LOGIN/REGISTER
  if (page === "login" || page === "register") {
    history.replaceState({}, "", "?page=profile");
    router();
    return;
  }

  // 👉 5. ПРОФИЛЬ (главная для студента)
  if (page === "profile" || (!page && !streamId)) {
    renderStudentHomePage(studentsContainer, router);
    return;
  }

  // 👉 6. STREAM FLOW
  if (!streamId) {
    await renderLandingPage();
    return;
  }

  if (studentId) {
    const student = await getStudent(studentId);

    if (!student || !student.id) {
      studentsContainer.innerHTML = "<h2>Студента не найдено</h2>";
      return;
    }

    renderStudentPage(studentsContainer, student, back);
    return;
  }

  if (sprintName) {
    await renderSprint(sprintName);
    return;
  }

  await renderStudentsSpintsPage();
}
// 4️⃣ Навигация

// Теперь переходы делают только pushState + router()

// Студент
function goStudent(id) {
  const params = new URLSearchParams(window.location.search);
  const streamId = params.get("stream");

  history.pushState({}, "", `?stream=${streamId}&student=${id}`);

  router();
}
// Спринт
function goSprint(name) {
  const params = new URLSearchParams(window.location.search);
  const streamId = params.get("stream");

  history.pushState(
    {},
    "",
    `?stream=${streamId}&sprint=${encodeURIComponent(name)}`,
  );

  router();
}
// Домой
function goHome() {
  history.pushState({}, "", "?page=profile");
  router();
}
// 5️⃣ Главная страница
async function renderStudentsSpintsPage() {
  document.body.classList.remove("streams");
  const params = new URLSearchParams(window.location.search);
  const streamId = params.get("stream"); // ✅ СНАЧАЛА
  // console.log("streamId", streamId);
  const streams = await getStreams();
  const currentStream = streams.find((s) => s.id === streamId);
  // console.log("streams", streams);
  // console.log("currentStream", currentStream);

  let streamName = currentStream.number ? `${currentStream.number} потік` : "";
  let courseName = currentStream.course || "";

  const thead = document.createElement("div");

  thead.innerHTML = `
    <div class="top">
      <h3>Потоки</h3>
      <p>Система ефективності</p>
    </div>
    <div class="under_top container">
      <div class="under_top-title">
        <h1>${courseName}</h1>
        <h2>${streamName}</h2>
      </div>
      <div class="line"></div>
      <p class="blue-title">СТАН ПІДГОТОВКИ</p>
    </div>
  `;

  studentsContainer.appendChild(thead);

  let students = await getStudents(streamId);

  if (!Array.isArray(students)) {
    console.error("API ERROR:", students);
    students = [];
  }

  students.sort((a, b) => b.level - a.level);

  studentsMap = {};
  students.forEach((s) => {
    studentsMap[s.id] = s.name;
  });

  const ul = document.createElement("ul");
  ul.classList.add("container");

  students.forEach((student) => {
    const li = createStudentRow(student, () => {
      goStudent(student.id);
    });

    ul.appendChild(li);
  });

  studentsContainer.appendChild(ul);

  await renderSprints();

  applyColors();
}
// 6️⃣ Спринты
async function renderSprints() {
  document.body.classList.remove("streams");
  const sprints = await getSprints();

  const tableSpr = document.createElement("div");

  const header = document.createElement("div");
  header.innerHTML = `<p class="blue-title">РЕЗУЛЬТАТИ СПРИНТІВ</p>`;

  tableSpr.appendChild(header);

  const ul = document.createElement("ul");

  sprints.sort((a, b) => {
    const numA = Number(a.sprint.match(/\d+/)?.[0] || 0);
    const numB = Number(b.sprint.match(/\d+/)?.[0] || 0);
    return numA - numB;
  });

  sprints.forEach((sprint, index) => {
    const li = document.createElement("li");
    li.classList.add("load-table-item");

    li.onclick = () => goSprint(sprint.sprint);

    li.innerHTML = `
    <div class="stud-title">
      <p class="number">${String(index + 1).padStart(2, "0")}</p>
      <p>${sprint.sprint}</p>
    </div>

    <svg class="right-svg" width="28" height="28">
      <use href="/sprite.svg#icon-right"></use>
    </svg>
    `;

    ul.appendChild(li);
  });

  tableSpr.appendChild(ul);

  sprintsContainer.appendChild(tableSpr);
}
// 7️⃣ Рендер страницы спринта
async function renderSprint(sprintName) {
  document.body.classList.remove("streams");
  const params = new URLSearchParams(window.location.search);
  const streamId = params.get("stream");

  const students = await getStudents(streamId);

  studentsMap = {};
  students.forEach((s) => {
    studentsMap[s.id] = s.name;
  });

  const tasks = await getTasks(streamId);

  if (!Array.isArray(tasks)) {
    console.error("TASKS ERROR:", tasks);
    return;
  }
  const sprintNum = Number((sprintName.match(/\d+/) || [""])[0]);

  const sprintData = tasks.filter((t) => t.sprint === sprintNum);

  renderSprintPage(
    studentsContainer,
    sprintName,
    sprintData,
    studentsMap,
    back,
    applyColors,
    (studentId) => {
      goStudent(studentId);
    },
  );
}
// 8️⃣ Кнопка браузера назад
window.addEventListener("popstate", router);
// 9️⃣ Запуск приложения
router();
// console.log("CRON RUN:", new Date().toISOString());
