export function drawStatsChart(productivity, effectiveness) {
  const canvas = document.getElementById("statsChart");
  const size = canvas.parentElement.clientWidth;

  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");

  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const startAngle = -Math.PI / 2; // старт сверху
  const fullCircle = Math.PI * 2;

  // Внешний круг (effectiveness) - горчичный
  // const outerRadius = 53;
  const outerRadius = canvas.width * 0.28;
  const outerThickness = 21;
  const effectivenessAngle = (effectiveness / 100) * fullCircle;

  // фон
  ctx.beginPath();
  ctx.arc(centerX, centerY, outerRadius, 0, fullCircle);
  ctx.strokeStyle = "rgba(217, 217, 217, 0.2)";
  ctx.lineWidth = outerThickness;
  ctx.lineCap = "round";
  ctx.stroke();

  // заполнение
  ctx.beginPath();
  ctx.arc(
    centerX,
    centerY,
    outerRadius,
    startAngle,
    startAngle + effectivenessAngle,
  );
  const outerGradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
  outerGradient.addColorStop(0, "#D9B54A");
  outerGradient.addColorStop(1, "#735600");
  ctx.strokeStyle = outerGradient; // горчичный
  ctx.lineWidth = outerThickness;
  ctx.lineCap = "round";
  ctx.stroke();

  // Внутренний круг (productivity) - синий
  const innerRadius = canvas.width * 0.42;
  // const innerRadius = 80;
  const innerThickness = 19;
  const productivityAngle = (productivity / 100) * fullCircle;

  // фон
  ctx.beginPath();
  ctx.arc(centerX, centerY, innerRadius, 0, fullCircle);
  ctx.strokeStyle = "rgba(217, 217, 217, 0.2)";
  ctx.lineWidth = innerThickness;
  ctx.lineCap = "round";
  ctx.stroke();

  // заполнение
  ctx.beginPath();
  ctx.arc(
    centerX,
    centerY,
    innerRadius,
    startAngle,
    startAngle + productivityAngle,
  );
  const innerGradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
  innerGradient.addColorStop(0, "#1C7BFF");
  innerGradient.addColorStop(1, "#005EE0");
  ctx.strokeStyle = innerGradient;

  ctx.lineWidth = innerThickness;
  ctx.lineCap = "round";
  ctx.stroke();
}
