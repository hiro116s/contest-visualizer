let data = {};

function parse(seed, input, output) {
  const inData = parseInput(input);
  const outData = parseOutput(output);
  const turnData = parseTurnData(inData, outData);
  return { seed, inData, outData, turnData };
}

function parseTurnData(inData, outData) {
  const result = [];

  let ti = 0;
  let si = 0;
  let next = [{ v: 0, si }];
  for (let i = 0; i < outData.ops.length && ti < inData.t; i++) {
    const [op, ...args] = outData.ops[i];
    if (op === "s") {
      si++;
    } else if (op == "m") {
      const v = parseInt(args[0]);
      next.push({ v, si });
      if (inData.ts[ti] === v) {
        ti++;
        si = 0;
        result.push(next);
        next = [{ v, si }];
      }
    }
  }
  return result;
}

function parseInput(input) {
  const inputLines = input.trim().split("\n");
  const [n, m, t, la, lb] = inputLines.shift().split(" ").map(Number);
  console.log();

  const es = [];
  for (let i = 0; i < m; i++) {
    es.push(inputLines.shift().split(" ").map(Number));
  }
  const ts = inputLines.shift().split(" ").map(Number);

  const ps = [];
  for (let i = 0; i < n; i++) {
    ps.push(inputLines.shift().split(" ").map(Number).map((v) => v + 10));
  }

  return { n, m, t, la, lb, es, ts, ps };
}

function parseOutput(output) {
  const outputLines = output.trim().split("\n");

  const a = outputLines.shift().split(" ").map(Number);
  const ops = outputLines.map((line) => {
    const [op, ...args] = line.split(" ");
    return [op, args.map(Number)];
  });
  console.log(ops);
  return { a, ops };
}

function draw(turn) {
  const { n, m, t, la, lb, es, ts, ps } = data.inData;
  const { a, ops } = data.outData;
  const turnData = data.turnData[turn];

  const canvas = document.getElementById("visualizer-main");
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < m; i++) {
    const [u, v] = es[i];
    ctx.beginPath();
    ctx.moveTo(ps[u][0], ps[u][1]);
    ctx.lineTo(ps[v][0], ps[v][1]);
    ctx.strokeStyle = "gray";
    ctx.lineWidth = 1;
    ctx.stroke();
  }
  for (let i = 0; i < n; i++) {
    const red = [255, 100, 0];
    const fillColor = red;

    ctx.beginPath();
    ctx.arc(ps[i][0], ps[i][1], 5, 0, 2 * Math.PI);
    ctx.fillStyle = `rgb(${fillColor[0]}, ${fillColor[1]}, ${fillColor[2]})`;
    ctx.fill();
    ctx.lineWidth = 1;
    ctx.strokeStyle = "black";
    ctx.stroke();
  }

  const colors = [
    "blue",
    "green",
    "red",
    "yellow",
    "purple",
    "orange",
    "cyan",
    "magenta",
    "black",
    "white",
    "gray",
    "brown",
    "pink",
    "lime",
    "olive",
    "navy",
    "teal",
    "aqua",
    "maroon",
    "silver",
    "purple",
    "fuchsia"
  ];
  for (let i = 0; i < turnData.length - 1; i++) {
    const v = turnData[i].v;
    const nv = turnData[i + 1].v;
    ctx.beginPath();
    ctx.moveTo(ps[v][0], ps[v][1]);
    ctx.lineTo(ps[nv][0], ps[nv][1]);
    ctx.strokeStyle = "black";
    ctx.lineWidth = 3;
    ctx.stroke();
  }
  for (let i = 0; i < turnData.length; i++) {
    const { v, si } = turnData[i];

    ctx.beginPath();
    ctx.arc(ps[v][0], ps[v][1], 10, 0, 2 * Math.PI);
    ctx.fillStyle = colors[si];
    ctx.fill();
    ctx.strokeStyle = "green";
    ctx.stroke();
  }
}

function initialize(seed, input, output) {
  data = parse(seed, input, output);

  const canvas = document.createElement("canvas");
  canvas.id = "visualizer-main";
  canvas.width = 1050;
  canvas.height = 1050;

  const resultDiv = document.getElementById("result");
  resultDiv.innerHTML = "";
  resultDiv.appendChild(canvas);

  draw(0);
}

function apply(turn) {
  draw(turn);
}

function getMaxTurn() {
  return data.inData.n;
}

const visualizer = {
  initialize: initialize,
  apply: apply,
  getMaxTurn: getMaxTurn
};

export default visualizer;
