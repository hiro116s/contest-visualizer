import { apply as applyAhc001 } from "./ahc001/visualizer.js";
import { apply as applyChokudai003 } from "./chokudai003/visualizer.js";
import { default as visualizerChokudai005 } from "./chokudai005/visualizer.js";
import { default as visualizerAhc036 } from "./ahc036/visualizer.js";
import { default as visualizerAhc036_2 } from "./ahc036_2/visualizer.js";

let prev = Date.now();
let isPlaying = false;
let visualizer = null;

function updateResult() {
  const seed = document.getElementById('seed').value;
  const input = document.getElementById('input').value;
  const output = document.getElementById('output').value;
  const turn = document.getElementById('turn').value;

  apply(seed, input, output, turn);
}

function extractContestName(pathName) {
  const ws = window.location.pathname.split("/");
  if (ws.length !== 3) {
    console.error("Error: Unexpected pathname", window.location.pathname);
  }
  return ws[2];
}

function apply(seed, input, output, turn) {
  const contestName = extractContestName(window.location.pathname);
  if (contestName === "ahc001") {
    applyAhc001(seed, input, output, turn);
  } else if (contestName === "chokudai003") {
    applyChokudai003(seed, input, output, turn);
  } else if (contestName === "chokudai005") {
    visualizer = visualizerChokudai005;
  } else if (contestName == 'ahc036') {
    visualizer = visualizerAhc036;
  } else if (contestName == 'ahc036_2') {
    visualizer = visualizerAhc036_2;
  } else {
    console.error(`Unknown contest name: ${contestName}`);
  }
  visualizer.initialize(seed, input, output);
  document.querySelector("#rangeDiv input").max = visualizer.getMaxTurn();
}

async function fetchAndSetContent(url, elementId) {
  try {
    console.log(`Fetching content from ${url}`);
    const response = await fetch(url);
    const content = await response.text();
    document.getElementById(elementId).value = content;
  } catch (error) {
    console.error(`Error fetching content from ${url}:`, error);
  }
}

async function loadSeedData(seed) {
  if (!Number.isInteger(seed)) {
    alert('Error: Seed must be a number');
    return;
  }
  document.getElementById('seed').value = seed;
  const contestName = extractContestName(window.location.pathname);
  const dirName = contestName;
  await fetchAndSetContent(`/static/${dirName}/input_${seed}.txt`, 'input');
  await fetchAndSetContent(`/static/${dirName}/output_${seed}.txt`, 'output');
  apply(seed, document.getElementById('input').value, document.getElementById('output').value);
}

function checkSeedParameter() {
  const urlParams = new URLSearchParams(window.location.search);
  const seedParam = urlParams.get('seed');

  if (seedParam !== null) {
    const seed = parseInt(seedParam, 10);
    if (isNaN(seed)) {
      alert('Error: Seed must be a number');
    } else {
      loadSeedData(seed);
    }
  }
}

// Add the following function
function splitOutputs(text) {
  return text.trim().split("\n\n");
}

// Modify the play function as follows
async function toggle() {
  if (visualizer === null) {
    return;
  }
  const toggleButton = document.getElementById("toggleButton");
  if (!isPlaying) {
    if (Number(document.getElementById("turn").value) >= visualizer.getMaxTurn()) {
      document.getElementById("turn").value = 0;
    }
    toggleButton.innerHTML = "■";
    prev = Date.now();
  } else {
    toggleButton.innerHTML = "▶";
  }
  isPlaying = !isPlaying;
}

function autoPlay() {
  if (isPlaying) {
    const now = Date.now();
    let s = 1000;
    console.log(speed.value);
    if ((now - prev) * document.getElementById("speed").value >= s) {
      const inc = Math.floor((now - prev) * speed.value / s);
      prev += Math.floor(inc * s / speed.value);
      const turn = Number(document.getElementById("turn").value) + inc;
      updateTurn(turn);
      if (Number(document.getElementById("turn").value) >= visualizer.getMaxTurn()) {
        const toggleButton = document.getElementById("toggleButton")
        toggleButton.innerHTML = "▶";
        isPlaying = false;
      }
    }
  }
  requestAnimationFrame(autoPlay);
}

function updateTurn(turn) {
  const turnInt = parseInt(turn);
  const newTurn = Math.min(turnInt, visualizer.getMaxTurn());
  document.getElementById("turn").value = newTurn;
  visualizer.apply(turnInt);
}

autoPlay();

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById("toggleButton").addEventListener("click", toggle);
  document.getElementById("turn").addEventListener("change", () => {
    const turn = document.getElementById("turn").value;
    updateTurn(turn);
  });
  document.querySelector("#rangeDiv input").addEventListener("input", (e) => {
    const turn = e.target.value;
    document.getElementById("turn").value = turn;
    updateTurn(turn);
  });
  checkSeedParameter();
});
