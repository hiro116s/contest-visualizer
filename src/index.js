import { apply as applyAhc001 } from "./ahc001/visualizer.js";
import { apply as applyChokudai003 } from "./chokudai003/visualizer.js";

let playInterval;
let isPlaying = false;

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
  } else {
    console.error(`Unknown contest name: ${contestName}`);
  }
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
  await fetchAndSetContent(`/static/${contestName}/input_${seed}.txt`, 'input');
  await fetchAndSetContent(`/static/${contestName}/output_${seed}.txt`, 'output');
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
async function play() {
  const seed = document.getElementById("seed").value;
  const input = document.getElementById("input").value;
  const output = splitOutputs(document.getElementById("output").value);
  const maxTurn = output.length;
  const timeInput = document.getElementById("time");

  let currentTurn = 1;

  for (let i = 0; i < maxTurn * timeInput.value; i++) {
    setTimeout(() => {
      if (currentTurn >= maxTurn) {
        currentTurn = 0;
      }

      apply(seed, input, output[currentTurn]);
      document.getElementById("turn").value = currentTurn + 1;

      currentTurn++;
    }, (i + 1) * 100);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById("playButton").addEventListener("click", play);
  document.getElementById("turn").addEventListener("change", () => {
    const turn = document.getElementById("turn").value;
    apply(null, null, null, turn);
  });
  checkSeedParameter();

  // ボタンにイベントリスナーを追加
  const updateButton = document.querySelector('button#updateButton');
  updateButton.addEventListener('click', updateResult);
});
