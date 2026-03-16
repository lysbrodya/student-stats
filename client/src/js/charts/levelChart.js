export function drawLevelChart(level, time) {
  const canvas = document.getElementById("levelChart");
  const size = canvas.parentElement.clientWidth;

  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const startAngle = -Math.PI / 2; // старт сверху
  const fullCircle = Math.PI * 2;

  // Внешний круг (level) - зеленый
  const outerRadius = canvas.width * 0.27;

  // const outerRadius = 53;
  const outerThickness = canvas.width * 0.13;
  const levelAngle = (level / 100) * fullCircle;

  // фон
  ctx.beginPath();
  ctx.arc(centerX, centerY, outerRadius, 0, fullCircle);
  ctx.strokeStyle = "rgba(217, 217, 217, 0.2)";
  ctx.lineWidth = outerThickness;
  ctx.lineCap = "round";
  ctx.stroke();
  const outerGradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
  outerGradient.addColorStop(0, "rgba(28, 255, 236, 0.5)");
  outerGradient.addColorStop(1, "rgba(0, 150, 224, 0.5)");
  // заполнение
  ctx.beginPath();
  ctx.arc(centerX, centerY, outerRadius, startAngle, startAngle + levelAngle);
  ctx.strokeStyle = outerGradient; // зеленый
  ctx.lineWidth = outerThickness;
  ctx.lineCap = "round";
  ctx.stroke();

  // Внутренний круг (time) - красный, нормализуем time, предположим max 200
  // const innerRadius = 80;
  const innerRadius = canvas.width * 0.43;
  const innerThickness = canvas.width * 0.12;
  const maxTime = 100; // предположим максимум
  const timeAngle = Math.min(time / maxTime, 1) * fullCircle;

  // фон
  ctx.beginPath();
  ctx.arc(centerX, centerY, innerRadius, 0, fullCircle);
  ctx.strokeStyle = "rgba(217, 217, 217, 0.2)";
  ctx.lineWidth = innerThickness;
  ctx.lineCap = "round";
  ctx.stroke();

  // заполнение
  ctx.beginPath();
  ctx.arc(centerX, centerY, innerRadius, startAngle, startAngle + timeAngle);

  const innerGradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
  innerGradient.addColorStop(0, "#D98F8F");
  innerGradient.addColorStop(1, "#8C4D4D");
  ctx.strokeStyle = innerGradient;

  ctx.lineWidth = innerThickness;
  ctx.lineCap = "round";
  ctx.stroke();
}
