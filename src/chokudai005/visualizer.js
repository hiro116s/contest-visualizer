const N = 100;
const vx = [0, 1, 0, -1];
const vy = [1, 0, -1, 0];

let data = {};

function draw(turn) {
  const inData = data.turnData[turn];
  const canvas = document.getElementById("visualizer-main");
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const N = data.inData.n;
  const size = 10;
  const colors = [
    [0, 0, 0],
    [100, 100, 100],
    [100, 111, 100],
    [100, 122, 100],
    [100, 133, 100],
    [100, 144, 100],
    [100, 155, 100],
    [100, 166, 100],
    [100, 177, 100],
    [100, 188, 100]
  ];
  for (let y = 0; y < N; y++) {
    for (let x = 0; x < N; x++) {
      ctx.beginPath();
      ctx.rect(x * size, y * size, size, size);
      const fillColor = colors[inData[y][x]];
      ctx.fillStyle = `rgb(${fillColor[0]}, ${fillColor[1]}, ${fillColor[2]})`;
      ctx.fill();
    }
  }
}

function parse(seed, input, output) {
  const inData = parseInput(input);
  const outData = parseOutput(output);
  const turnData = parseTurnData(inData, outData);
  return { seed, inData, outData, turnData };
}

function parseInput(input) {
  const ws = input.trim().split("\n");
  const [id, n, k] = ws[0].split(" ").map(s => parseInt(s));
  const map = ws.slice(1).map(l => l.split('').map(s => parseInt(s)));
  return { id, n, k, map };
}

function parseOutput(output) {
  const ws = output.trim().split("\n");
  const q = parseInt(ws[0]);
  const orders = ws.slice(1).map(s => s.split(" ").map(t => parseInt(t)));
  return { q, orders };
}

function parseTurnData(inData, outData) {
  const turnData = [];
  turnData.push(inData.map);
  for (let i = 0; i < outData.q; i++) {
    const nextMap = turnData[i].map(arr => [...arr]);
    const [y, x, c] = outData.orders[i];
    updateMap(nextMap, x - 1, y - 1, nextMap[y - 1][x - 1], c)
    turnData.push(nextMap);
  }
  return turnData;
}

function updateMap(map, x, y, c, nc) {
  const visited = new Array(N).fill(0).map(arr => new Array(N).fill(false));
  visited[y][x] = true;
  map[y][x] = nc;

  const q = [];
  q.push({ x, y });
  let cnt = 0;
  while (q.length) {
    const p = q.shift();
    cnt++;
    for (let i = 0; i < 4; i++) {
      const nx = p.x + vx[i];
      const ny = p.y + vy[i];
      if (nx < 0 || nx >= N || ny < 0 || ny >= N) {
        continue;
      }
      if (visited[ny][nx]) {
        continue;
      }
      if (map[ny][nx] != c) {
        continue;
      }
      map[ny][nx] = nc;
      visited[ny][nx] = true;
      q.push({ x: nx, y: ny });
    }
  }
}

function initialize(seed, input, output) {
  data = parse(seed, input, output);
  const optionDiv = document.createElement("div");
  optionDiv.id = "option";
  optionDiv.appendChild(createScore(0));

  const canvas = document.createElement("canvas");
  canvas.id = "visualizer-main";
  canvas.width = 1000;
  canvas.height = 1000;

  const resultDiv = document.getElementById("result");
  resultDiv.innerHTML = "";
  resultDiv.appendChild(canvas);
  resultDiv.appendChild(optionDiv);

  draw(0);
}

function apply(turn) {
  draw(turn);
}

function getMaxTurn() {
  return data.outData.q;
}

function createScore(turn) {
  const scoreDiv = document.createElement("div");
  scoreDiv.id = "score";
  const scoreLabel = document.createElement("label");
  scoreLabel.innerHTML = "Score: ";
  const scoreSpan = document.createElement("span");
  scoreSpan.innerHTML = 0;
  scoreDiv.appendChild(scoreLabel);
  scoreDiv.appendChild(scoreSpan);
  return scoreDiv;
}

const visualizer = {
  apply: apply,
  initialize: initialize,
  getMaxTurn: getMaxTurn
};

export default visualizer;