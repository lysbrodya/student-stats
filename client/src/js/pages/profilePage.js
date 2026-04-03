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
      <h3>Особиста сторінка</h3>
      <p>Потоки</p>
    </div>
    <div class="container">
      <div class="profile-top">
        <img src="/img/profile-ava.jpg" alt="avatar" class="avatar" />
        <div>
          <div>
            <h2 class="stud-name">${student.name}</h2>
            <p class="stud-role">СТУДЕНТ</p>
          </div>
          <div class="stud-scores">
            <p><span class="stud-score">${student.productivity || 0}%</span> <span class="stat-title">продуктивність</span></p>
            <p><span class="stud-score">${student.effectiveness || 0}%</span> <span class="stat-title">ефективність</span></p>
            <p><span class="stud-score">${student.level || 0}%</span> <span class="stat-title">рівень підготовки</span></p>
            <p><span class="stud-score">${student.time || 0}%</span> <span class="stat-title">час до ТК</span></p>
          </div>
        </div>
      </div>


      <div class="prof-nav">      
        <button id="goDashboard" class="prof-nav-btn">    <svg class="profile-svg" width="24" height="24">
      <use href="/Vector.svg"></use>
    </svg><span>СИСТЕМА ЕФЕКТИВНОСТІ</span></button>
       
        <button id="goDiary" class="prof-nav-btn">    <svg class="profile-svg" width="24" height="24">
      <use href="/Vector-1.svg"></use>
    </svg><span>РОЗКЛАД, ДОМАШНЄ, ПОДІЇ</span></button>
     <button id="goCourses" class="prof-nav-btn">    <svg class="profile-svg" width="24" height="24">
      <use href="/Vector-2.svg"></use>
    </svg><span>РЕЙТИНГ</span></button>
        <button id="goArticles" class="prof-nav-btn">    <svg class="profile-svg" width="24" height="24">
      <use href="/Vector-3.svg"></use>
    </svg><span>статті</span></button>
      </div>
      <div>
        <p class="blue">РЕКОМЕНДОВАНІ МАТЕРІАЛИ</p>
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
