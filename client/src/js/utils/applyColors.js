export function applyColors() {
  const cells = document.querySelectorAll(".cell");

  const colors = {
    1: "#f5f5f5",
    2: "#e0e0e0",
    3: "#cfcfcf",
    4: "#cfcfcf",
    5: "#9e9e9e",
    6: "#9e9e9e",
    7: "#9e9e9e",
    8: "#616161",
    9: "#616161",
    10: "#616161",
    11: "#008377",
    12: "#008377",
    13: "#008377",
  };

  cells.forEach((cell) => {
    const value = Number(cell.textContent);
    if (!value) return;

    if (colors[value]) {
      cell.style.background = colors[value];
    }

    if (value >= 8) {
      cell.style.color = "white";
    }
  });
}
