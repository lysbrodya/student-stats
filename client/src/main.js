import { getSprints, getStudents, getStudent, getTasks } from "./js/api/api.js";
import { initHeader } from "./js/components/header.js";
import { applyColors } from "./js/utils/applyColors.js";
import { renderStudentPage } from "./js/pages/studentPage.js";
import { renderSprintPage } from "./js/pages/sprintPage.js";
import { createStudentRow } from "./js/components/studentRow.js";

const studentsContainer = document.querySelector("#students");
const sprintsContainer = document.querySelector("#sprints");

initHeader();

let studentsMap = {};

const back = document.createElement("button");
back.innerHTML = `
    <svg class="right-svg" width="28" height="28">
      <use href="../../../public/icon-back.svg"></use>
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

  const params = new URLSearchParams(window.location.search);

  const studentId = params.get("student");
  const sprintName = params.get("sprint");

  if (studentId) {
    const student = await getStudent(studentId);
    renderStudentPage(studentsContainer, student, back);
    return;
  }

  if (sprintName) {
    await renderSprint(sprintName);
    return;
  }

  await renderHome();
}
// 4️⃣ Навигация

// Теперь переходы делают только pushState + router()

// Студент
function goStudent(id) {
  history.pushState({}, "", `?student=${id}`);
  router();
}
// Спринт
function goSprint(name) {
  history.pushState({}, "", `?sprint=${encodeURIComponent(name)}`);
  router();
}
// Домой
function goHome() {
  history.pushState({}, "", "/");
  router();
}
// 5️⃣ Главная страница
async function renderHome() {
  const thead = document.createElement("div");

  thead.innerHTML = `
  <div class="top">
    <h3>Потоки</h3>
    <p>Система ефективності</p>
  </div>
  <div class="under_top container">
    <div class="under_top-title">
      <h1>Курс Композиції</h1>
      <h2>4 потік</h2>
    </div>
    <div class="line"></div>
    <p class="blue-title">СТАН ПІДГОТОВКИ</p>
  </div>
  `;

  studentsContainer.appendChild(thead);

  const students = await getStudents();

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
      <use href="../../../public/right.svg"></use>
    </svg>
    `;

    ul.appendChild(li);
  });

  tableSpr.appendChild(ul);

  sprintsContainer.appendChild(tableSpr);
}
// 7️⃣ Рендер страницы спринта
async function renderSprint(sprintName) {
  const students = await getStudents();

  studentsMap = {};
  students.forEach((s) => {
    studentsMap[s.id] = s.name;
  });

  const tasks = await getTasks();

  const sprintNum = (sprintName.match(/\d+/) || [""])[0];

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
