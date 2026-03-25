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

async function renderStreamsPage() {
  document.body.classList.add("streams");
  studentsContainer.innerHTML = "";
  sprintsContainer.innerHTML = "";

  const wrapper = document.createElement("section");
  wrapper.classList.add("streams-page");

  wrapper.innerHTML = `
      <div class="container streams-main-img">
        <div> <img src="/img/Frame 2087326902.png" alt=""> </div>
        <h1 class="streams-main-title">Система трекінгу навчального прогресу </br> для студентів Art Osvita</h1>
      </div>
    <div class="container">
<div class="custom-select" id="streamSelect">
  <div class="select-header">
    <span class="select-title">Ваш потік</span>
    <img src="/wite-right.svg" class="select-arrow" />
  </div>

  <div class="select-dropdown"></div>
</div>
    </div>
  `;

  studentsContainer.appendChild(wrapper);

  const select = document.getElementById("streamSelect");
  const header = select.querySelector(".select-header");
  const dropdown = select.querySelector(".select-dropdown");
  const title = select.querySelector(".select-title");

  const streams = await getStreams();
  streams.sort((a, b) => a.number - b.number);
  streams.forEach((stream) => {
    const option = document.createElement("div");
    option.classList.add("select-option");
    option.textContent = stream.name;
    console.log(stream);
    console.log(stream.name);

    option.addEventListener("click", () => {
      title.textContent = stream.name;

      select.classList.remove("open");

      history.pushState({}, "", `?stream=${stream.id}`);
      router();
    });

    dropdown.appendChild(option);
  });
  header.addEventListener("click", () => {
    select.classList.toggle("open");
  });
  select.addEventListener("change", (e) => {
    const streamId = e.target.value;

    if (!streamId) return;

    history.pushState({}, "", `?stream=${streamId}`);
    router();
  });
}

const studentsContainer = document.querySelector("#students");
const sprintsContainer = document.querySelector("#sprints");

initHeader();

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

  const params = new URLSearchParams(window.location.search);

  const studentId = params.get("student");
  const sprintName = params.get("sprint");
  const streamId = params.get("stream");

  if (!streamId) {
    await renderStreamsPage(); // 👈 НОВАЯ ГЛАВНАЯ
    return;
  }

  if (studentId) {
    const student = await getStudent(studentId);

    if (!student || !student.id) {
      console.error("STUDENT ERROR:", student);
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

  await renderHome();
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
  const params = new URLSearchParams(window.location.search);
  const streamId = params.get("stream");

  history.pushState({}, "", `?stream=${streamId}`);
  router();
}
// 5️⃣ Главная страница
async function renderHome() {
  document.body.classList.remove("streams");
  const params = new URLSearchParams(window.location.search);
  const streamId = params.get("stream"); // ✅ СНАЧАЛА
  console.log("streamId", streamId);
  const streams = await getStreams();
  const currentStream = streams.find((s) => s.id === streamId);
  console.log("streams", streams);
  console.log("currentStream", currentStream);

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
/*
We want to be able to call 'toJadenCase()' directly on a string like so:
'most trees are blue'.toJadenCase(); // returns 'Most Trees Are Blue'
For that, we need to add a method to the String prototype:
*/

Object.defineProperty(String.prototype, "toJadenCase", {
  value: function toJadenCase() {
    console.log(this.split(" "));
    let arr = this.split(" ").map((w) => w[0].toUpperCase() + w.slice(1));
    return arr.join(" ");
  },
});
// function toJadenCase() {
//   console.log(this);
//   return this;
// }
"abc def".toJadenCase();
