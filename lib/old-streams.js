import { getCourseStreams } from "./notion.js";

export default async function handler(req, res) {
  try {
    const streams = await getCourseStreams();

    console.log("STREAMS DATA:", streams); // 👈 ЛОГ

    res.status(200).json(streams);
  } catch (e) {
    console.error("STREAMS ERROR:", e); // 👈 ВАЖНО

    res.status(500).json({
      error: e.message,
      details: e.body || null,
    });
  }
}
// select conteiner streams
// <div class="container">
//   <div class="custom-select" id="streamSelect">
//     <div class="select-header">
//       <span class="select-title">Ваш потік</span>
//       <img src="/wite-right.svg" class="select-arrow" />
//     </div>
//     <div class="select-dropdown"></div>
//   </div>
// </div>

// const select = document.getElementById("streamSelect");
// const header = select.querySelector(".select-header");
// const dropdown = select.querySelector(".select-dropdown");
// const title = select.querySelector(".select-title");

// const streams = await getStreams();
// streams.sort((a, b) => a.number - b.number);
// streams.forEach((stream) => {
//   const option = document.createElement("div");
//   option.classList.add("select-option");
//   option.textContent = stream.name;
//   console.log(stream);
//   console.log(stream.name);

//   option.addEventListener("click", () => {
//     title.textContent = stream.name;

//     select.classList.remove("open");

//     history.pushState({}, "", `?stream=${stream.id}`);
//     router();
//   });

//   dropdown.appendChild(option);
// });
// header.addEventListener("click", () => {
//   select.classList.toggle("open");
// });
// select.addEventListener("change", (e) => {
//   const streamId = e.target.value;

//   if (!streamId) return;

//   history.pushState({}, "", `?stream=${streamId}`);
//   router();
// });
// `<span class="arrow-circle">
//     <img src="/wite-right.svg" class="select-arrow" />
//   </span>
//   <span class="arrow-circle">
//     <img src="/wite-right.svg" class="select-arrow" />
//   </span>`
