import { getStreams, getStudents } from "../api/api.js";
import { supabase } from "../../lib/supabaseClient.js";

export async function renderSelectStudentPage(container, router) {
  container.innerHTML = `
    <div class="container">
      <h2>Обери себе</h2>

      <div id="streamSelect" class="custom-select">
        <div class="select-header">
          <span class="select-title">Оберіть потік</span>
        </div>
        <div class="select-dropdown"></div>
      </div>

      <div id="studentsList"></div>
    </div>
  `;

  const select = document.getElementById("streamSelect");
  const dropdown = select.querySelector(".select-dropdown");
  const title = select.querySelector(".select-title");
  const studentsList = document.getElementById("studentsList");

  const streams = await getStreams();

  streams.forEach((stream) => {
    const option = document.createElement("div");
    option.textContent = stream.name;

    option.onclick = async () => {
      title.textContent = stream.name;
      select.classList.remove("open");

      const students = await getStudents(stream.id);

      const { data: profiles } = await supabase
        .from("profiles")
        .select("student_id");

      const takenIds = profiles.map((p) => p.student_id);

      // 👇 фильтрация
      const freeStudents = students.filter(
        (student) => !takenIds.includes(student.id),
      );
      studentsList.innerHTML = "";

      freeStudents.forEach((student) => {
        const btn = document.createElement("button");
        btn.textContent = student.name;

        btn.onclick = async () => {
          const { data: userData } = await supabase.auth.getUser();
          const userId = userData.user.id;

          // ❗ проверка
          const { data: existing } = await supabase
            .from("profiles")
            .select("*")
            .eq("student_id", student.id)
            .single();

          if (existing) {
            alert("Цей студент вже обраний 😬");
            return;
          }

          await supabase
            .from("profiles")
            .update({ student_id: student.id })
            .eq("id", userId);

          console.log("UPDATED");

          await supabase.auth.refreshSession();

          //   history.pushState({}, "", `?stream=${stream.id}`);
          history.pushState({}, "", "?page=profile");
          router();
        };

        studentsList.appendChild(btn);
      });

      //   students.forEach((student) => {
      //     const li = createStudentRow(student, async () => {
      //       const { data: userData } = await supabase.auth.getUser();
      //       const userId = userData.user.id;
      //       await supabase
      //         .from("profiles")
      //         .update({ student_id: student.id })
      //         .eq("id", userId);

      //       history.pushState({}, "", `?stream=${stream.id}`);
      //       router();
      //     });

      //     studentsList.appendChild(li);
      //   });
    };

    dropdown.appendChild(option);
  });

  select.querySelector(".select-header").onclick = () => {
    select.classList.toggle("open");
  };
}
