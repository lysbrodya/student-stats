import { supabase } from "../../lib/supabaseClient.js";
import { getStudent } from "../api/api.js";

export async function renderStudentHomePage(container, router) {
  const { data: userData } = await supabase.auth.getUser();
  const userId = userData.user.id;

  const { data: profile } = await supabase
    .from("profiles")
    .select("student_id")
    .eq("id", userId)
    .single();

  const student = await getStudent(profile.student_id);

  container.innerHTML = `
    <div class="container">
      <h2>${student.name}</h2>

      <p>Продуктивність: ${student.productivity || 0}%</p>
      <p>Ефективність: ${student.efficiency || 0}%</p>
      <p>Час до ТК: ${student.time || 0}%</p>
      <p>Рівень: ${student.level || 0}%</p>

      <button id="goDashboard">Система ефективності</button>
      <button id="goCourses">Курси</button>
    </div>
  `;
  console.log(student);
  document.getElementById("goDashboard").onclick = () => {
    history.pushState(
      {},
      "",
      `?stream=${student.stream_id}&student=${student.id}`,
    );

    router();
  };

  document.getElementById("goCourses").onclick = () => {
    history.pushState({}, "", `?stream=${student.stream_id}`);
    router();
  };
}
