export function createStudentRow(student, onClick) {
  const li = document.createElement("li");
  li.classList.add("load-table-item");
  li.innerHTML = `
<div class="stud-title">
  <p class="number">${student.level}%</p>
  <p>${student.name}</p>
</div>
          <svg class="right-svg" width="28" height="28">
            <use href="/sprite.svg#icon-right"></use>
          </svg>
`;

  li.addEventListener("click", () => onClick(student));
  return li;
}
