function lerpColor(color1, color2, t) {
  return [
    color1[0] + (color2[0] - color1[0]) * t,
    color1[1] + (color2[1] - color1[1]) * t,
    color1[2] + (color2[2] - color1[2]) * t,
  ];
}

function drawRectanglesAndCircles(ctx, rectangles, circles, areas) {
  for (let i = 0; i < rectangles.length; i++) {
    const rect = rectangles[i];
    const area = areas[i];
    const circleRadius = circles[i][2];
    const vi = 1 - (1 - Math.min(area, circleRadius) / Math.max(area, circleRadius));

    const red = [255, 100, 0];
    const blue = [30, 0, 200];
    const fillColor = lerpColor(blue, red, vi);

    ctx.beginPath();
    ctx.rect(rect[0] / 10, rect[1] / 10, (rect[2] - rect[0]) / 10, (rect[3] - rect[1]) / 10);
    ctx.fillStyle = `rgb(${fillColor[0]}, ${fillColor[1]}, ${fillColor[2]})`;
    ctx.fill();
    ctx.strokeStyle = "black";
    ctx.stroke();
  }

  for (const circle of circles) {
    ctx.beginPath();
    ctx.arc(circle[0] / 10, circle[1] / 10, 3, 0, 2 * Math.PI);
    ctx.fillStyle = "red";
    ctx.fill();
  }
}

function parseInput(input) {
  const inputLines = input.trim().split("\n");
  const n = parseInt(inputLines.shift(), 10);

  const circles = inputLines.map((line) => {
    const [x, y, r] = line.split(" ").map(Number);
    return [x, y, r];
  });

  return { n, circles };
}

function parseOutput(output) {
  const outputLines = output.trim().split("\n");

  const rectangles = outputLines.map((line) => {
    const [a, b, c, d] = line.split(" ").map(Number);
    return [a, b, c, d];
  });

  return rectangles;
}

export function apply(seed, input, output) {
  const { n, circles } = parseInput(input);
  const rectangles = parseOutput(output);

  const areas = rectangles.map(([a, b, c, d]) => {
    return Math.abs((c - a) * (d - b));
  });

  const canvas = document.createElement("canvas");
  canvas.width = 1000;
  canvas.height = 1000;
  const ctx = canvas.getContext("2d");

  drawRectanglesAndCircles(ctx, rectangles, circles, areas);

  const resultDiv = document.getElementById("result");
  resultDiv.innerHTML = "";
  resultDiv.appendChild(canvas);
}
