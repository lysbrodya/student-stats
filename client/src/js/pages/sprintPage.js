export function renderSprintPage(
  container,
  name,
  data,
  studentsMap,
  back,
  applyColors,
  onStudentClick,
) {
  container.innerHTML = "";

  const top = document.createElement("div");

  const undertop = document.createElement("div");
  undertop.classList.add("under_top");
  undertop.classList.add("container");

  top.innerHTML = `
  <div class="top">
    <h3>Спринти</h3>
    <p>Потоки</p>
  </div>`;
  undertop.innerHTML = `
    <div class="under_top-title">
      <h1>Результати</h1>
      <h2>${name}</h2>
    </div>
    <div class="line"></div>
    <p class="blue-title">СТАН ПІДГОТОВКИ</p>
  `;
  // Группируем данные по студентам
  const studentScores = {};
  data.forEach((row) => {
    const studentId = row.student;
    const task = row.task;
    const score = row.score;
    if (!studentScores[studentId]) {
      studentScores[studentId] = {};
    }
    studentScores[studentId][task] = score;
  });

  // Создаем таблицу
  const table = document.createElement("table");
  table.classList.add("table");
  table.classList.add("container");
  // table.style.borderCollapse = "collapse";
  // table.style.width = "100%";

  // Заголовок
  const thead = document.createElement("thead");
  const headerRow = document.createElement("tr");
  const thIndex = document.createElement("th");
  thIndex.classList.add("th-trophy");
  thIndex.innerHTML = `
<svg width="22" height="22">
  <use href="/sprite.svg#icon-trophy"></use>
</svg>
`;
  headerRow.appendChild(thIndex);
  const thStudent = document.createElement("th");
  thStudent.classList.add("thStudent");
  thStudent.textContent = "СТУДЕНТИ";

  headerRow.appendChild(thStudent);

  for (let i = 1; i <= 5; i++) {
    const th = document.createElement("th");
    th.textContent = i.toString();
    headerRow.appendChild(th);
  }
  thead.appendChild(headerRow);
  table.appendChild(thead);

  // Тело таблицы
  const tbody = document.createElement("tbody");
  Object.keys(studentScores).forEach((studentId, index) => {
    const row = document.createElement("tr");

    const tdIndex = document.createElement("td");
    tdIndex.textContent = index + 1;
    tdIndex.classList.add("student-index");
    row.appendChild(tdIndex);

    const tdStudent = document.createElement("td");
    const fullName = studentsMap[studentId] || studentId;

    const shortName = fullName.split(" ").slice(0, 2).join(" ");

    tdStudent.textContent = shortName;

    tdStudent.classList.add("student");
    tdStudent.style.cursor = "pointer";

    tdStudent.onclick = () => {
      onStudentClick(studentId);
    };

    row.appendChild(tdStudent);

    for (let i = 1; i <= 5; i++) {
      const td = document.createElement("td");
      td.textContent = studentScores[studentId][i.toString()] || "";
      td.classList.add("cell");

      row.appendChild(td);
    }
    console.log("studentId", studentId);
    tbody.appendChild(row);
  });
  table.appendChild(tbody);
  const colgroup = document.createElement("colgroup");

  colgroup.innerHTML = `
  <col style="width:40px">
  <col style="width:auto">
  <col style="width:36px">
  <col style="width:36px">
  <col style="width:36px">
  <col style="width:36px">
  <col style="width:36px">
`;

  table.appendChild(colgroup);
  container.appendChild(top);
  container.appendChild(back);
  container.appendChild(undertop);
  container.appendChild(table);

  applyColors();
}
