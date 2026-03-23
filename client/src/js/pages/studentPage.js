import { drawStatsChart } from "../charts/statsChart.js";
import { drawLevelChart } from "../charts/levelChart.js";
import { getTasks } from "../api/api.js";
import { applyColors } from "../utils/applyColors.js";

export async function renderStudentPage(studentsContainer, student, back) {
  const params = new URLSearchParams(window.location.search);
  const streamId = params.get("stream");
  document.body.classList.remove("streams");
  const tasksData = await getTasks(streamId);
  console.log("student:", student);

  const tasks = Array.isArray(tasksData) ? tasksData : [];
  console.log("tasks:", tasks);

  const studentTasks = tasks.filter(
    (t) => String(t.student ?? t.student_id) === String(student.id),
  );
  const sprintScores = {};
  const commentsData = [];
  const formatDate = (date) => {
    if (!date) return "";
    return new Date(date).toLocaleDateString("uk-UA");
  };
  studentTasks.forEach((item) => {
    const sprint = item.sprint;
    const task = item.task;
    if (item.comment) {
      commentsData.push({
        sprint: item.sprint,
        task: item.task,
        comment: item.comment,
        date: item.date || "",
      });
    }
    if (!sprintScores[sprint]) {
      sprintScores[sprint] = {};
    }

    sprintScores[sprint][task] = item.score;
    console.log(studentTasks.comment);
  });

  const comments = document.createElement("div");
  comments.classList.add("comments", "container");

  comments.innerHTML = `
  <h2>Коментарі викладача</h2>
  <div class="comments-slider">
    ${commentsData
      .map(
        (c) => `
        <div class="comment-card">
          <p class="comment-title">
            Спринт ${c.sprint} <span class="comment-task">Завдання ${c.task}</span>
          </p>

          <p class="comment-text">
            ${c.comment}
          </p>

          <p class="comment-date comment-title">
            ${formatDate(c.date)}
          </p>
        </div>
      `,
      )
      .join("")}
  </div>
`;

  studentsContainer.innerHTML = "";
  const fullName = student.name;

  const shortName = fullName.split(" ").slice(0, 2).join(" ");

  const top = document.createElement("div");

  const undertop = document.createElement("div");
  undertop.classList.add("under_top");
  undertop.classList.add("under_top__st-page");
  undertop.classList.add("container");

  top.innerHTML = `
  <div class="top">
    <h3>Особиста сторінка</h3>
    <p>Потоки</p>
  </div>`;
  undertop.innerHTML = `
  
    <div>
      <h1>${shortName}</h1>
      <div class="under_top-item"><p>СТУДЕНТ</p></div>
    </div>

<ul class="cats">
  <li>
    <svg width="34" height="34" class="icon-cat cat-productivity">
      <use href="/sprite.svg#icon-gray-cat"></use>
    </svg>
  </li>
  <li>
    <svg width="34" height="34" class="icon-cat cat-effectiveness">
      <use href="/sprite.svg#icon-gray-cat"></use>
    </svg>
  </li>
  <li>
    <svg width="34" height="34" class="icon-cat cat-level">
      <use href="/sprite.svg#icon-gray-cat"></use>
    </svg>
  </li>
</ul>
  `;
  const catProductivity = undertop.querySelector(".cat-productivity");
  const catEffectiveness = undertop.querySelector(".cat-effectiveness");
  const catLevel = undertop.querySelector(".cat-level");

  if (student.productivity > 60) {
    catProductivity.classList.add("blue-cat");
  }

  if (student.effectiveness > 60) {
    catEffectiveness.classList.add("yellow-cat");
  }

  if (student.level > 60) {
    catLevel.classList.add("green-cat");
  }
  const statsContainer = document.createElement("div");

  const avg = (arr) => {
    const valid = arr.filter((n) => typeof n === "number");
    if (!valid.length) return 0;

    return Math.round(valid.reduce((sum, n) => sum + n, 0) / valid.length);
  };

  statsContainer.innerHTML = `
<section class="container stroke-section">
  <div>  
    <p class="top-canvas-title">Sprint</p>
    <canvas id="statsChart" ></canvas>
    <h3><span class="persents persents-blue">${student.productivity}%</span> <span class="stats-title">продуктивність</span></h3>
     <h3><span class="persents persents-yellow">${student.effectiveness}%</span> <span class="stats-title">ефективність</span></h3>
  </div>
  <div>  
    <p class="top-canvas-title">Стан підготовки</p>
    <canvas id="levelChart" ></canvas>
     <h3>
      <span class="persents persents-red">${student.time}%</span> 
      <span class="stats-title">час до ТК</span>
    </h3>
     <h3>
      <span class="persents persents-green">${student.level}%</span> 
      <span class="stats-title">рівень підготовки</span>
     </h3>
  </div>
</section>
<section class="container stroke-section-modules">
<div class="line line-st">
</div>
<div class="costs">
<p class="top-canvas-title">Оцінки за модулі:</p>
<ul>
<li>
  <p class="letter">A</p>
  <p class="letter-title">Лінійно-конструктивна,
    <br/> побудова</p><span class="line-leter">
  </span> <span class="leter-persent">${student.A}</span></li>
<li><p class="letter">B</p><p class="letter-title">Повітряна перспектива</p><span class="line-leter"></span> <span class="leter-persent"> ${student.B}</span></li>
<li><p class="letter">C</p><p class="letter-title">Світло-тіньова побудова</p><span class="line-leter"></span> <span class="leter-persent">${student.C}</span></li>
<li><p class="letter">D</p><p class="letter-title">Штрих та технічне виконання</p><span class="line-leter"></span> <span class="leter-persent">${student.D}</span></li>
<li><p class="letter">E</p><p class="letter-title">Пропорції</p><span class="line-leter"></span> <span class="leter-persent">${student.E}</span></li>

${student.F ? `<li><p class="letter">F</p><p class="letter-title">Композиція</p><span class="line-leter"></span> <span class="leter-persent">${student.F}</span></li>` : ``}
</ul>
</div>
  <div class="midle-scors">
  ${
    student.course === "Композиція ЛНАМ"
      ? `<div>
      <p class="midle-scors_top">ADE</p>
      <p class="midle-scors_midle">${avg([student.A, student.D, student.E])}</p>
      <span class=""></span>
      <p>Ахроматика та літера</p>
    </div>
    <div>
      <p class="midle-scors_top">ABDE</p>
      <p class="midle-scors_midle">${avg([student.A, student.B, student.D, student.E])}</p>
      <span class=""></span>
      <p>Хроматика та літера</p>
    </div>
    <div>
      <p class="midle-scors_top">ABCE</p>
      <p class="midle-scors_midle">${avg([student.A, student.B, student.C, student.E])}</p>
      <span class=""></span>
      <p>Хроматика та природний мотив</p>
    </div>`
      : `<p class="midle-scors-general">середній бал <span class="midle-scors_num">${avg([student.A, student.B, student.C, student.D, student.E, student.F])}</span></p>
 `
  }
  </div>
</section>
`;

  const sectionTable = document.createElement("section");
  sectionTable.classList.add("section-table", "container");
  sectionTable.innerHTML = `<h2 class="section-table-title">Результати по спринтах</h2>`;
  const table = document.createElement("table");
  table.classList.add("sprints-scores");

  const thead = document.createElement("thead");
  const headerRow = document.createElement("tr");
  const colgroup = document.createElement("colgroup");

  colgroup.innerHTML = `
  <col style="width:50px">   <!-- AVG -->
  <col>   <!-- sprint -->
  <col style="width:30px">
  <col style="width:30px">
  <col style="width:30px">
  <col style="width:30px">
  <col style="width:30px">
`;

  table.appendChild(colgroup);

  headerRow.innerHTML = `
  <th class="sb">СБ</th>
  <th>СПРИНТ</th>
  <th>1</th>
  <th>2</th>
  <th>3</th>
  <th>4</th>
  <th>5</th>
`;

  thead.appendChild(headerRow);
  table.appendChild(thead);

  const tbody = document.createElement("tbody");

  Object.keys(sprintScores)
    .sort((a, b) => Number(a) - Number(b))
    .forEach((sprint, index) => {
      const row = document.createElement("tr");
      const scores = Object.values(sprintScores[sprint]).filter(
        (s) => s !== undefined && s !== null,
      );

      const avg =
        scores.length > 0
          ? scores.reduce((sum, s) => sum + s, 0) / scores.length
          : 0;

      row.innerHTML = `
  <td class="avg">${avg.toFixed(1)}</td>
  <td class="sprint-name">Спринт ${sprint}</td>
  <td class="cell">${sprintScores[sprint]["1"] || ""}</td>
  <td class="cell">${sprintScores[sprint]["2"] || ""}</td>
  <td class="cell">${sprintScores[sprint]["3"] || ""}</td>
  <td class="cell">${sprintScores[sprint]["4"] || ""}</td>
  <td class="cell">${sprintScores[sprint]["5"] || ""}</td>
`;

      tbody.appendChild(row);
    });

  table.appendChild(tbody);
  sectionTable.appendChild(table);

  studentsContainer.appendChild(top);
  studentsContainer.appendChild(back);
  studentsContainer.appendChild(undertop);
  studentsContainer.appendChild(statsContainer);
  if (Object.keys(sprintScores).length > 0) {
    studentsContainer.appendChild(sectionTable);
  }

  if (commentsData.length > 0) {
    studentsContainer.appendChild(comments);
  }

  drawStatsChart(student.productivity, student.effectiveness);
  drawLevelChart(student.level, student.time);
  window.addEventListener("resize", () => {
    drawStatsChart(student.productivity, student.effectiveness);
    drawLevelChart(student.level, student.time);
  });
  applyColors();
}
