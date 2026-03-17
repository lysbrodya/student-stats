import { drawStatsChart } from "../charts/statsChart.js";
import { drawLevelChart } from "../charts/levelChart.js";

export function renderStudentPage(studentsContainer, student, back) {
  console.log(student);
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

    <ul>
      <li>
        <svg width="34" height="34" class="green-cat icon-cat">
          <use href="/sprite.svg#icon-green-cat"></use>
        </svg>
      </li>
            <li>
        <svg width="34" height="34" class="yellow-cat icon-cat">
          <use href="/sprite.svg#icon-yellow-cat"></use>
        </svg>
      </li>
            <li>
        <svg width="34" height="34" class="blue-cat icon-cat">
          <use href="/sprite.svg#icon-blue-cat"></use>
        </svg>
      </li>
    </ul>
  `;

  const statsContainer = document.createElement("div");

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
     <div>
    <p class="midle-scors_top">ADE</p>
    <p class="midle-scors_midle">${parseInt((student.A + student.D + student.E) / 3)}</p>
    <span class=""></span>
    <p>Ахроматика та літера</p>
  </div>
  <div>
    <p class="midle-scors_top">ABDE</p>
    <p class="midle-scors_midle">${parseInt((student.A + student.B + student.D + student.E) / 4)}</p>
    <span class=""></span>
    <p>Хроматика та літера</p>
  </div>
  <div>
    <p class="midle-scors_top">ABCE</p>
    <p class="midle-scors_midle">${parseInt((student.A + student.B + student.C + student.E) / 4)}</p>
    <span class=""></span>
    <p>Хроматика та природний мотив</p>
  </div>
      </div>
</section>
`;

  {
    /* <p class="midle-scors-general">середній бал <span class="midle-scors_num">${parseInt((student.A + student.B + student.C + student.D + student.E) / 5)}</span></p> */
  }

  studentsContainer.appendChild(top);
  studentsContainer.appendChild(back);
  studentsContainer.appendChild(undertop);
  studentsContainer.appendChild(statsContainer);

  drawStatsChart(student.productivity, student.effectiveness);
  drawLevelChart(student.level, student.time);
  window.addEventListener("resize", () => {
    drawStatsChart(student.productivity, student.effectiveness);
    drawLevelChart(student.level, student.time);
  });
}
