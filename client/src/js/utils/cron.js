export function runCronIfNeeded() {
  const lastRun = localStorage.getItem("cronLastRun");
  const now = Date.now();

  if (!lastRun || now - lastRun > 30 * 60 * 1000) {
    Promise.all([
      fetch("/api/cron"),
      fetch("/api/cron-sprints"),
      fetch("/api/cron-tasks"),
      fetch("/api/cron-teams"),
    ])
      .then(() => {
        localStorage.setItem("cronLastRun", now);
        console.log("CRON UPDATED");
      })
      .catch(() => {
        console.log("CRON ERROR");
      });
  }
}
