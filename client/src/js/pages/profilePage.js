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
          <div class="top">
      <h3>Особиста сторынка</h3>
      <p>Потоки</p>
    </div>
    <div class="container">
      <div class="register-top">
        <img src="/img/profile-ava.jpg" alt="avatar" class="avatar" />
        <div>
      <h2>${student.name}</h2>

      <p>${student.productivity || 0}% Продуктивність</p>
      <p>${student.efficiency || 0}% Ефективність</p>
      <p>${student.level || 0}% Рівень підготовки </p>
      <p>${student.time || 0}% Час до ТК</p>
        </div>
      </div>


      <div class="prof-nav">      
        <button id="goDashboard" class="prof-nav-btn">    <svg class="profile-svg" width="24" height="24">
      <use href="../../../public/Vector.svg"></use>
    </svg><span>СИСТЕМА ЕФЕКТИВНОСТІ</span></button>
       
        <button id="goDiary" class="prof-nav-btn">    <svg class="profile-svg" width="24" height="24">
      <use href="../../../public/Vector-1.svg"></use>
    </svg><span>РОЗКЛАД, ДОМАШНЄ, ПОДІЇ</span></button>
     <button id="goCourses" class="prof-nav-btn">    <svg class="profile-svg" width="24" height="24">
      <use href="../../../public/Vector-2.svg"></use>
    </svg><span>РЕЙТИНГ</span></button>
        <button id="goArticles" class="prof-nav-btn">    <svg class="profile-svg" width="24" height="24">
      <use href="../../../public/Vector-3.svg"></use>
    </svg><span>статті</span></button>
      </div>
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
