let data = {};

function parse(seed, input, output) {
  const inData = parseInput(input);
  const outData = parseOutput(output);
  const turnData = parseTurnData(inData, outData);
  return { seed, inData, outData, turnData };
}

function parseTurnData(inData, outData) {
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

  const es = outputLines.shift().split(" ").map(Number);
  const trees = outputLines.map((line) => {
    const a = line.split(" ");
    const len = parseInt(a.shift());
    const nodes = a.map(Number);
    return { len, nodes }
  })
  console.log(trees);
  return { es, trees };
}

function draw(turn) {
  const { n, m, t, la, lb, es, ts, ps } = data.inData;
  const { es: ues, trees } = data.outData;
  const turnData = data.turnData[turn];

  const canvas = document.getElementById("visualizer-main");
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  let uvs = new Set();
  for (let i = 0; i < m; i++) {
    if (!ues.includes(i)) {
      continue;
    }
    const [u, v] = es[i];
    ctx.beginPath();
    ctx.moveTo(ps[u][0], ps[u][1]);
    ctx.lineTo(ps[v][0], ps[v][1]);
    ctx.strokeStyle = "gray";
    ctx.lineWidth = 1;
    ctx.stroke();
    uvs.add(u);
    uvs.add(v);
  }

  for (let i = 0; i < n; i++) {
    if (!uvs.has(i)) {
      continue;
    }
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

  let uvs2 = new Set();
  for (let j = 0; j < trees.length; j++) {
    if (j !== turn) {
      continue;
    }
    for (let i = 0; i < trees[j].len; i++) {
      uvs2.add(trees[j].nodes[i]);
    }
  }

  for (let i = 0; i < m; i++) {
    if (!ues.includes(i) || !uvs2.has(es[i][0]) || !uvs2.has(es[i][1])) {
      continue;
    }
    const [u, v] = es[i];
    ctx.beginPath();
    ctx.moveTo(ps[u][0], ps[u][1]);
    ctx.lineTo(ps[v][0], ps[v][1]);
    ctx.strokeStyle = "black";
    ctx.lineWidth = 3;
    ctx.stroke();
    uvs.add(u);
    uvs.add(v);
  }

  for (let j = 0; j < trees.length; j++) {
    if (j !== turn) {
      continue
    }
    const { len, nodes } = trees[j];
    for (let i = 0; i < len; i++) {
      const v = nodes[i];

      ctx.beginPath();
      ctx.arc(ps[v][0], ps[v][1], 10, 0, 2 * Math.PI);
      ctx.fillStyle = colors[Math.min(j, colors.length - 1)];
      ctx.fill();
      ctx.strokeStyle = "green";
      ctx.stroke();
    }
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
