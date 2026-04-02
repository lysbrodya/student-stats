// //<script>
// let user_id = localStorage.getItem("chat_user_id") || ("u_" + Math.random().toString(36).slice(2));
// localStorage.setItem("chat_user_id", user_id);

// const chat = document.getElementById("chat-widget");
// const toggle = document.getElementById("chat-toggle");
// const preview = document.getElementById("preview");
// const hero = document.getElementById("hero");
// const messages = document.getElementById("messages");
// const inputArea = document.getElementById("inputArea");

// const previewText = document.getElementById("preview-text");
// const startBtn = document.getElementById("startChat");

// /* STATE */
// const hasHistory = localStorage.getItem("chat_history");

// /* INIT PREVIEW */
// if(hasHistory){
//   previewText.innerText = "Продовжимо розмову, де ви зупинились";
//   startBtn.innerText = "Повернутися до чату ➤";
// }else{
//   previewText.innerText = "Поставте питання і я допоможу підібрати курс";
//   startBtn.innerText = "Розпочати чат";
// }

// /* OPEN */
// toggle.onclick = () => {
//   chat.style.display = "block";
//   toggle.style.display = "none";
// };

// /* CLOSE */
// document.getElementById("chat-close").onclick = () => {
//   chat.style.display = "none";
//   toggle.style.display = "block";
// };

// /* START CHAT */
// startBtn.onclick = () => {
//   preview.style.display = "none";
//   hero.style.display = "none";
//   messages.style.display = "block";
//   inputArea.style.display = "block";

//   if(!hasHistory){
//     addMessage("Привіт, я котик ARSI 🐾", "bot");
//   }
// };

// /* LINKIFY SAFE */
// function linkify(text){
//   if(text.includes("<a")) return text;
//   return text.replace(/https?:\/\/[^\s]+/g, url =>
//     <a href="${url}" target="_blank">${url}</a>
//   );
// }

// /* ADD MESSAGE */
// function addMessage(text, from){
//   const msg = document.createElement("div");
//   msg.className = "msg " + from;

//   msg.innerHTML = <div class="bubble">${linkify(text)}</div>;

//   messages.appendChild(msg);
//   messages.scrollTop = messages.scrollHeight;

//   localStorage.setItem("chat_history", "1");
// }

// /* SEND */
// async function sendMessage(){
//   const input = document.getElementById("input");
//   const text = input.value.trim();
//   if(!text) return;

//   addMessage(text,"user");
//   input.value = "";

//   try{
//     const res = await fetch("https://n8n.artosvita.com/webhook/chat",{
//       method:"POST",
//       headers:{"Content-Type":"application/json"},
//       body:JSON.stringify({message:text,user_id})
//     });

//     const data = await res.json();
//     addMessage(data.reply || "Немає відповіді","bot");

//   }catch{
//     addMessage("Помилка","bot");
//   }
// }

// document.getElementById("sendBtn").onclick = sendMessage;
// document.getElementById("input").addEventListener("keypress", e => {
//   if(e.key==="Enter") sendMessage();
// });
// </script>

// <script>
// let user_id = localStorage.getItem("chat_user_id") || ("u_" + Math.random().toString(36).slice(2));
// localStorage.setItem("chat_user_id", user_id);

// /* HISTORY STORAGE */
// let chatHistory = JSON.parse(localStorage.getItem("chat_messages") || "[]");

// function saveHistory(){
//   localStorage.setItem("chat_messages", JSON.stringify(chatHistory));
//   localStorage.setItem("chat_history", "1");
// }

// /* DOM */
// const chat = document.getElementById("chat-widget");
// const toggle = document.getElementById("chat-toggle");
// const preview = document.getElementById("preview");
// const hero = document.getElementById("hero");
// const messages = document.getElementById("messages");
// const inputArea = document.getElementById("inputArea");

// const previewText = document.getElementById("preview-text");
// const startBtn = document.getElementById("startChat");

// /* STATE */
// const hasHistory = chatHistory.length > 0;

// /* INIT PREVIEW */
// if(hasHistory){
//   previewText.innerText = "Продовжимо розмову, де ви зупинились";
//   startBtn.innerText = "Повернутися до чату ➤";
// }else{
//   previewText.innerText = "Поставте питання і я допоможу підібрати курс";
//   startBtn.innerText = "Розпочати чат";
// }

// /* OPEN */
// toggle.onclick = () => {
//   chat.style.display = "block";
//   toggle.style.display = "none";
// };

// /* CLOSE */
// document.getElementById("chat-close").onclick = () => {
//   chat.style.display = "none";
//   toggle.style.display = "block";
// };

// /* LINKIFY SAFE */
// function linkify(text){
//   if(text.includes("<a")) return text;
//   return text.replace(/https?:\/\/[^\s]+/g, url =>
//     `<a href="${url}" target="_blank">${url}</a>`
//   );
// }

// /* ADD MESSAGE */
// function addMessage(text, from, save = true){
//   const msg = document.createElement("div");
//   msg.className = "msg " + from;

//   msg.innerHTML = `<div class="bubble">${linkify(text)}</div>`;

//   messages.appendChild(msg);
//   messages.scrollTop = messages.scrollHeight;

//   if(save){
//     chatHistory.push({ text, from });

//     // обмеження (щоб не ріс безкінечно)
//     if(chatHistory.length > 50){
//       chatHistory.shift();
//     }

//     saveHistory();
//   }
// }

// /* LOAD HISTORY */
// function loadMessages(){
//   chatHistory.forEach(m => {
//     addMessage(m.text, m.from, false);
//   });
// }

// /* START CHAT */
// startBtn.onclick = () => {
//   preview.style.display = "none";
//   hero.style.display = "none";
//   messages.style.display = "block";
//   inputArea.style.display = "block";

//   if(hasHistory){
//     loadMessages();
//   } else {
//     addMessage("Привіт, я котик ARSI 🐾", "bot");
//   }
// };

// /* SEND */
// async function sendMessage(){
//   const input = document.getElementById("input");
//   const text = input.value.trim();
//   if(!text) return;

//   addMessage(text,"user");
//   input.value = "";

//   try{
//     const res = await fetch("https://n8n.artosvita.com/webhook/chat",{
//       method:"POST",
//       headers:{"Content-Type":"application/json"},
//       body:JSON.stringify({
//         message:text,
//         user_id:user_id,
//         source:"website"
//       })
//     });

//     const data = await res.json();
//     addMessage(data.reply || "Немає відповіді","bot");

//   }catch{
//     addMessage("Помилка з'єднання 😔","bot");
//   }
// }

// document.getElementById("sendBtn").onclick = sendMessage;
// document.getElementById("input").addEventListener("keypress", e => {
//   if(e.key==="Enter") sendMessage();
// });
// </script>//
