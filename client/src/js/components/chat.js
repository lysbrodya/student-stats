import { getChatTemplate } from "./chatTemplate.js";

export function initChat(user) {
  // ❌ не показываем если нет юзера
  if (!user) return;

  // ❌ защита от повторного рендера
  if (document.getElementById("chat-widget")) return;
  let user_id = user.id;
  // 👉 вставляем в body
  document.body.insertAdjacentHTML("beforeend", getChatTemplate());
  if (user_id) {
    user_id = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
  }
  /* HISTORY STORAGE */
  let chatHistory = JSON.parse(localStorage.getItem("chat_messages") || "[]");

  function saveHistory() {
    localStorage.setItem("chat_messages", JSON.stringify(chatHistory));
    localStorage.setItem("chat_history", "1");
    localStorage.setItem("user_id", user_id);
  }

  /* DOM */
  const chat = document.getElementById("chat-widget");
  const toggle = document.getElementById("chat-toggle");
  const preview = document.getElementById("preview");
  const hero = document.getElementById("hero");
  const messages = document.getElementById("messages");
  const inputArea = document.getElementById("inputArea");

  const previewText = document.getElementById("preview-text");
  const startBtn = document.getElementById("startChat");

  /* STATE */
  const hasHistory = chatHistory.length > 0;
  let typingEl = null;
  function showTyping() {
    typingEl = document.createElement("div");
    typingEl.className = "msg bot";

    typingEl.innerHTML = `
    <div class="avatar-mini">
      <img src="https://cdn.prod.website-files.com/675b04336f854ecee246186f/690d18a149cd06264c8d1ed1_Art%20Osvita%20AI%202.png">
    </div>
    <div class="bubble typing">
      <span></span><span></span><span></span>
    </div>
  `;

    messages.appendChild(typingEl);
    messages.scrollTop = messages.scrollHeight;
  }

  function hideTyping() {
    if (typingEl) {
      typingEl.remove();
      typingEl = null;
    }
  }
  function getLastBotMessage() {
    for (let i = chatHistory.length - 1; i >= 0; i--) {
      if (chatHistory[i].from === "bot") {
        return chatHistory[i];
      }
    }
    return null;
  }
  /* INIT PREVIEW */
  if (hasHistory) {
    const lastBotMsg = getLastBotMessage();

    if (lastBotMsg) {
      previewText.innerText = lastBotMsg.text;

      const meta = document.querySelector(".preview-meta");

      const time = lastBotMsg.time || Date.now();
      meta.innerText = `ARSI · ${formatTime(time)}`;
    } else {
      previewText.innerText =
        "Привіт! Я допоможу вам розібратись зі вступом 👇";

      const meta = document.querySelector(".preview-meta");
      meta.innerText = "ARSI · щойно";
    }

    startBtn.innerHTML = `
  Повернутися до чату
  <img src="/arrow-chat.svg" alt="" class="cta-icon" />
`;
  } else {
    previewText.innerText =
      "Привіт! Я допоможу вам розібратися з вступом, курсами та форматом навчання. Напишіть, будь ласка, куди ви плануєте вступати, який у вас зараз рівень і що саме хочете покращити — я підкажу оптимальний варіант і дам чітке розуміння наступних кроків.";
    startBtn.innerHTML = `
  Розпочати діалог
  <img src="/arrow-chat.svg" alt="" class="cta-icon" />
`;
  }

  toggle.onclick = () => {
    chat.classList.add("open");
    setTimeout(() => {
      chat.classList.add("done");
    }, 200);
    toggle.style.display = "none";
  };

  document.getElementById("chat-close").onclick = () => {
    chat.classList.remove("open");
    toggle.style.display = "block";
  };

  /* LINKIFY SAFE */
  function linkify(text) {
    if (text.includes("<a")) return text;

    // 1. markdown
    text = text.replace(
      /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g,
      (match, label, url) =>
        `<a href="${url}" target="_blank" rel="noopener noreferrer">${label}</a>`,
    );

    // 2. обычные ссылки (НО не внутри тегов)
    text = text.replace(
      /(^|[^">])(https?:\/\/[^\s<]+)/g,
      (match, prefix, url) =>
        `${prefix}<a href="${url}" target="_blank" rel="noopener noreferrer">${url}</a>`,
    );

    // 3. t.me
    text = text.replace(
      /(^|\s)(t\.me\/[^\s<]+)/g,
      (match, space, url) =>
        `${space}<a href="https://${url}" target="_blank">${url}</a>`,
    );

    // 4. @username
    text = text.replace(
      /(^|\s)@([a-zA-Z0-9_]+)/g,
      (match, space, username) =>
        `${space}<a href="https://t.me/${username}" target="_blank">@${username}</a>`,
    );

    return text;
  }

  /* ADD MESSAGE */
  function addMessage(text, from, save = true) {
    const msg = document.createElement("div");
    msg.className = "msg " + from;

    if (from === "bot") {
      msg.innerHTML = `
      <div class="avatar-mini">
        <img src="https://cdn.prod.website-files.com/675b04336f854ecee246186f/690d18a149cd06264c8d1ed1_Art%20Osvita%20AI%202.png">
      </div>
      <div class="bubble">${linkify(text)}</div>
    `;
    } else {
      msg.innerHTML = `<div class="bubble">${linkify(text)}</div>`;
    }

    messages.appendChild(msg);
    messages.scrollTop = messages.scrollHeight;

    if (save) {
      chatHistory.push({ text, from, time: Date.now() });

      if (chatHistory.length > 50) {
        chatHistory.shift();
      }

      saveHistory();
    }
  }
  function formatTime(timestamp) {
    const date = new Date(timestamp);

    return date.toLocaleTimeString("uk-UA", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }
  /* LOAD HISTORY */
  function loadMessages() {
    chatHistory.forEach((m) => {
      addMessage(m.text, m.from, false);
    });
  }

  /* START CHAT */
  startBtn.onclick = () => {
    preview.style.display = "none";
    hero.style.display = "none";
    startBtn.style.display = "none";
    messages.style.display = "block";
    inputArea.style.display = "block";

    // 🔥 новое
    document.querySelector(".chat-header").classList.add("hidden");
    document.querySelector(".chat-box").classList.add("chat-active");
    document.querySelector(".messages").classList.add("chat-active");

    if (hasHistory) {
      loadMessages();
    } else {
      addMessage(
        "Привіт! Я допоможу вам розібратися з вступом, курсами та форматом навчання. Напишіть, будь ласка, куди ви плануєте вступати...",
        "bot",
      );
    }
  };

  /* SEND */

  async function sendMessage() {
    const input = document.getElementById("input");
    const text = input.value.trim();
    if (!text) return;

    addMessage(text, "user");
    input.value = "";

    showTyping(); // 👈 ВКЛЮЧАЕМ ДО запроса

    try {
      const res = await fetch("https://n8n.artosvita.com/webhook-test/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          user_id: user_id,
          source: "student-stats",
          // message_type: "callback_query",
          callback_query: { data: "lnam" },
        }),
      });

      const data = await res.json();

      hideTyping(); // 👈 Вимикаємо після відповіді

      addMessage(data.reply || "Немає відповіді", "bot");
    } catch {
      hideTyping(); // 👈 При помилці
      addMessage(
        "Виникла помилка з’єднання. Ви можете звернутись до менеджерки Марії — вона оперативно відповість: https://t.me/maryartosvita",
        "bot",
      );
    }
  }

  document.getElementById("sendBtn").onclick = sendMessage;
  document.getElementById("input").addEventListener("keypress", (e) => {
    if (e.key === "Enter") sendMessage();
  });

  function canShowPopup() {
    return !localStorage.getItem("popup_seen");
  }
}
