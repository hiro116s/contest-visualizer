const N = 50;
const vx = [0, 1, 0, -1];
const vy = [1, 0, -1, 0];

function lerpColor(color1, color2, t) {
  return [
    color1[0] + (color2[0] - color1[0]) * t,
    color1[1] + (color2[1] - color1[1]) * t,
    color1[2] + (color2[2] - color1[2]) * t,
  ];
}

function draw(inMap, outMap) {
  const canvas = document.getElementById("visualizer-main");
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const isDropMode = document.querySelector("#dropToggle input").checked;

  const oxMap = isDropMode ? getMapAfterDrop(inMap, outMap) : inMap;
  const maxConnectedComponents = getMaxConnectedComponents(oxMap);
  const size = 20;
  for (let y = 0; y < N; y++) {
    for (let x = 0; x < N; x++) {
      if (oxMap[y][x] == 'o' || oxMap[y][x] == 'x') {
        ctx.beginPath();
        ctx.rect(x * size, y * size, size, size);
        ctx.fillStyle = "black";
        ctx.stroke();
        if (isDropMode && maxConnectedComponents.map[y][x]) {
          ctx.beginPath();
          ctx.rect(x * size, y * size, size, size);
          ctx.fillStyle = "yellow";
          ctx.fill();
        }

        ctx.beginPath();
        ctx.arc((x + 0.5) * size, (y + 0.5) * size, 5, 0, 2 * Math.PI);
        ctx.fillStyle = oxMap[y][x] == 'o' ? "red" : "blue";
        ctx.fill();
      } else if (outMap[y][x] == '-') {
        ctx.beginPath();
        ctx.rect(x * size, y * size, size, size / 2);
        ctx.fillStyle = "silver";
        ctx.fill();
      } else if ((isDropMode && oxMap[y][x] == '+') || (!isDropMode && outMap[y][x] == '+')) {
        ctx.beginPath();
        ctx.rect(x * size, y * size, size, size);
        ctx.fillStyle = "green";
        ctx.fill();
      }
    }
  }
}

function getMaxConnectedComponents(map) {
  const visited = new Array(N);
  for (let y = 0; y < N; y++) {
    visited[y] = new Array(N).fill(false);
  }

  let oMax = { v: 0, x: 0, y: 0 };
  let xMax = { v: 0, x: 0, y: 0 };
  for (let y = 0; y < N; y++) {
    for (let x = 0; x < N; x++) {
      if (!visited[y][x]) {
        if (map[y][x] == 'o') {
          const cnt = dfs(map, visited, x, y, 'o');
          if (cnt > oMax.v) {
            oMax = { v: cnt, x: x, y: y };
          }
        } else if (map[y][x] == 'x') {
          const cnt = dfs(map, visited, x, y, 'x');
          if (cnt > oMax.v) {
            xMax = { v: cnt, x: x, y: y };
          }
        }
      }
    }
  }
  for (let y = 0; y < N; y++) {
    visited[y] = new Array(N).fill(false);
  }
  dfs(map, visited, oMax.x, oMax.y, 'o');
  dfs(map, visited, xMax.x, xMax.y, 'x');
  return { map: visited, cnt: oMax.v + xMax.v };
}

function dfs(map, visited, x, y, c) {
  if (x < 0 || x >= N || y < 0 || y >= N) {
    return 0;
  }
  if (visited[y][x]) {
    return 0;
  }
  if (map[y][x] != c) {
    return 0;
  }
  visited[y][x] = true;
  let cnt = 1;
  for (let i = 0; i < 4; i++) {
    cnt += dfs(map, visited, x + vx[i], y + vy[i], c);
  }
  return cnt;
}

function getMapAfterDrop(inMap, outMap) {
  const oxMap = new Array(N);
  for (let y = 0; y < N; y++) {
    oxMap[y] = new Array(N).fill('.');
  }
  for (let x = 0; x < N; x++) {
    let oy = N - 1;
    let iy = N - 1;
    while (iy >= 0 && oy >= 0) {
      if (inMap[iy][x] == 'o' || inMap[iy][x] == 'x') {
        oxMap[oy][x] = inMap[iy][x];
        oy--;
      } else if (outMap[iy][x] == '+') {
        oxMap[oy][x] = '+';
        oy--;
      }
      if (outMap[iy][x] == '-') {
        oy = iy - 1;
      }
      iy--;
    }
  }
  return oxMap;
}

function parseInput(input) {
  return input.trim().split("\n");
}

function parseOutput(output) {
  return output.trim().split("\n");
}

export function apply(seed, input, output) {
  const inMap = parseInput(input);
  const outMap = parseOutput(output);

  const optionDiv = document.createElement("div");
  optionDiv.id = "option";
  optionDiv.appendChild(createScore(inMap, outMap));
  optionDiv.appendChild(createDropToggle(inMap, outMap));

  const canvas = document.createElement("canvas");
  canvas.id = "visualizer-main";
  canvas.width = 1000;
  canvas.height = 1000;

  const resultDiv = document.getElementById("result");
  resultDiv.innerHTML = "";
  resultDiv.appendChild(canvas);
  resultDiv.appendChild(optionDiv);

  draw(inMap, outMap);
}

function createScore(inMap, outMap) {
  const scoreDiv = document.createElement("div");
  scoreDiv.id = "score";
  const scoreLabel = document.createElement("label");
  scoreLabel.innerHTML = "Score: ";
  const scoreSpan = document.createElement("span");
  scoreSpan.innerHTML = getMaxConnectedComponents(getMapAfterDrop(inMap, outMap)).cnt;
  scoreDiv.appendChild(scoreLabel);
  scoreDiv.appendChild(scoreSpan);
  return scoreDiv;
}

function createDropToggle(inMap, outMap) {
  const dropToggleDiv = document.createElement("div");
  dropToggleDiv.id = "dropToggle";
  const dropToggleLabel = document.createElement("label");
  dropToggleLabel.innerHTML = "Drop: ";
  const dropToggleCheckbox = document.createElement("input");
  dropToggleCheckbox.type = "checkbox";
  dropToggleCheckbox.checked = true;
  dropToggleCheckbox.addEventListener("change", () => draw(inMap, outMap));
  dropToggleDiv.appendChild(dropToggleLabel);
  dropToggleDiv.appendChild(dropToggleCheckbox);
  return dropToggleDiv;
}