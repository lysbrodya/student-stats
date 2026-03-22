import { Client } from "@notionhq/client";

const notionClient = new Client({
  auth: process.env.NOTION_SECRET,
});

console.log("ENV CHECK:", {
  secret: !!process.env.NOTION_SECRET,
  results: !!process.env.NOTION_RESULTS_ID,
});
// ПРОВЕРКА №1: Сразу при загрузке файла
console.log("ТИП QUERY:", typeof notionClient.databases?.query);

export async function getResults(streamId) {
  const databaseId = process.env.NOTION_RESULTS_ID;

  const response = await notionClient.databases.query({
    database_id: databaseId,
    filter: streamId
      ? {
          property: "ПОТОКИ КУРСІВ",
          relation: {
            contains: streamId,
          },
        }
      : undefined,
  });

  return response.results.map((page) => {
    const p = page.properties;

    return {
      id: page.id,
      name: p["Name"]?.title?.[0]?.plain_text || "",

      productivity: p["Продуктивність %"]?.formula?.number ?? 0,

      effectiveness: p["Ефективність %"]?.formula?.number ?? 0,

      level: p["Рівень підготовки %"]?.rollup?.array?.[0]?.formula?.number ?? 0,

      A: p["A"]?.rollup?.array?.[0]?.number ?? 0,

      B: p["B"]?.rollup?.array?.[0]?.number ?? 0,

      C: p["C"]?.rollup?.array?.[0]?.number ?? 0,

      D: p["D"]?.rollup?.array?.[0]?.number ?? 0,

      E: p["E"]?.rollup?.array?.[0]?.number ?? 0,

      time: p["time"]?.number ?? 0,
      course: p["Курс"]?.rollup?.array?.[0]?.plain_text || "",
      stream: p["ПОТОКИ КУРСІВ"]?.relation?.array?.[0]?.plain_text || "",
    };
  });
}
export async function getSprintTasks(streamId) {
  const databaseId = process.env.NOTION_SPRINTS_TASCK_ID;

  const response = await notionClient.databases.query({
    database_id: databaseId,
    filter: streamId
      ? {
          property: "ПОТОКИ КУРСІВ",
          relation: {
            contains: streamId,
          },
        }
      : undefined,
  });

  return response.results.map((page) => {
    const p = page.properties;
    const name = p["Name"]?.title?.[0]?.plain_text || "";
    // Ожидаем формат "1-1", "1-2" и т.д.
    let sprint = "",
      task = "";
    if (/^\d+-\d+$/.test(name)) {
      [sprint, task] = name.split("-");
    }
    return {
      id: page.id,
      sprint: sprint.trim(),
      task: task.trim(),
      student:
        p["Студенти"]?.relation?.[0]?.id || p["Студенти"]?.select?.id || "",
      score: p["Оцінка"]?.number ?? 0,
      done: p["Виконано"]?.checkbox ?? false,
      comment:
        p["Коментар викладача"]?.rich_text?.map((t) => t.plain_text).join("") ||
        "",
      date: p["Дата"]?.created_time || "",
    };
  });
}
export async function getSprints() {
  const databaseId = process.env.NOTION_SPRINTS_ID;

  const response = await notionClient.databases.query({
    database_id: databaseId,
  });

  return response.results.map((page) => {
    const p = page.properties;
    return {
      id: page.id,

      sprint:
        p["Name"]?.title?.[0]?.plain_text ||
        p["Спринт - завдання"]?.rich_text?.[0]?.plain_text ||
        "",

      student: p["ПРОФІЛЬ СТУДЕНТІВ"]?.people?.[0]?.name || "",

      score: p["Оцінка з 13"]?.number ?? 0,

      done: p["Checkbox"]?.checkbox ?? false,
    };
  });
}

export async function getCourseStreams() {
  const databaseId = process.env.NOTION_COURSES_STREAMS_ID;

  const response = await notionClient.databases.query({
    database_id: databaseId,
  });

  return response.results.map((page) => {
    const p = page.properties;

    return {
      id: page.id,
      name: p["Name"]?.title?.[0]?.plain_text || "",
      course: p["КУРС"]?.select?.name || "",
      done: p["ЗАВЕРШЕНО"]?.checkbox || false,
      number: p["ПОТІК"]?.number || 0,
    };
  });
}

export async function testDatabase() {
  const databaseId = process.env.NOTION_COURSES_STREAMS_ID;

  const response = await notionClient.databases.query({
    database_id: databaseId,
  });

  return response;
}
