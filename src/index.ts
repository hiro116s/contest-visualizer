import { apply as applyAhc001 } from "./ahc001/visualizer.js";
import { apply as applyChokudai003 } from "./chokudai003/visualizer.js";
import { default as visualizerChokudai005 } from "./chokudai005/visualizer.js";
import { default as visualizerAhc036 } from "./ahc036/visualizer.js";
import { default as visualizerAhc036_2 } from "./ahc036_2/visualizer.js";

let prev = Date.now();
let isPlaying = false;
let visualizer: any = null;

function extractContestName(pathName: string): string {
  const ws = window.location.pathname.split("/");
  if (ws.length !== 3) {
    console.error("Error: Unexpected pathname", window.location.pathname);
  }
  return ws[2];
}

function apply(seed: string, input: string, output: string) {
  const contestName = extractContestName(window.location.pathname);
  if (contestName === "ahc001") {
    applyAhc001(seed, input, output);
  } else if (contestName === "chokudai003") {
    applyChokudai003(seed, input, output);
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
  document.querySelector<HTMLInputElement>("#rangeDiv input")?.setAttribute('max', visualizer.getMaxTurn());
}

async function fetchAndSetContent(url: string, elementId: string): Promise<void> {
  try {
    console.log(`Fetching content from ${url}`);
    const response = await fetch(url);
    const content = await response.text();
    const element = document.querySelector<HTMLInputElement>(elementId);
    if (element) {
      element.value = content;
    }
  } catch (error) {
    console.error(`Error fetching content from ${url}:`, error);
  }
}

async function loadSeedData(seed: number): Promise<void> {
  document.getElementById('seed')?.setAttribute('value', seed.toString());
  const contestName = extractContestName(window.location.pathname);
  const dirName = contestName;
  await fetchAndSetContent(`/static/${dirName}/input_${seed}.txt`, '#input');
  await fetchAndSetContent(`/static/${dirName}/output_${seed}.txt`, '#output');
  apply(seed.toString(), document.querySelector<HTMLInputElement>('#input')!.value, document.querySelector<HTMLInputElement>('#output')!.value);
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

// Modify the play function as follows
async function toggle(): Promise<void> {
  if (visualizer === null) {
    return;
  }
  const toggleButton = document.getElementById("toggleButton")!;
  if (!isPlaying) {
    const turnElement = document.querySelector<HTMLInputElement>("#turn")!;
    if (Number(turnElement.value) >= visualizer.getMaxTurn()) {
      turnElement.value = "0";
    }
    toggleButton.innerHTML = "■";
    prev = Date.now();
  } else {
    toggleButton.innerHTML = "▶";
  }
  isPlaying = !isPlaying;
}

function autoPlay(): void {
  if (isPlaying) {
    const now = Date.now();
    let s = 1000;
    const speedElem = document.querySelector<HTMLInputElement>("#speed")!;
    const speed = Number(speedElem.value);
    if ((now - prev) * speed >= s) {
      const inc = Math.floor((now - prev) * speed / s);
      prev += Math.floor(inc * s / speed);
      const turn = Number(document.querySelector<HTMLInputElement>("#turn")!.value);
      const newTurn = turn + inc;
      updateTurn(newTurn);
      if (turn >= visualizer.getMaxTurn()) {
        const toggleButton = document.getElementById("toggleButton");
        if (toggleButton) {
          toggleButton.innerHTML = "▶";
        }
        isPlaying = false;
      }
    }
  }
  requestAnimationFrame(autoPlay);
}

function updateTurn(turn: number): void {
  const newTurn = Math.min(turn, visualizer.getMaxTurn());
  const turnElem = document.querySelector<HTMLInputElement>("#turn");
  if (turnElem) {
    turnElem.value = newTurn.toString();
  }
  visualizer.apply(turn.toString());
}

autoPlay();

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById("toggleButton")?.addEventListener("click", toggle);
  document.getElementById("turn")?.addEventListener("change", () => {
    const turn = Number(document.querySelector<HTMLInputElement>("turn")!.value);
    updateTurn(turn);
  });
  document.querySelector<HTMLInputElement>("#rangeDiv input")?.addEventListener("input", (e) => {
    const target = e.target as HTMLInputElement | null;
    if (target) {
      const turn = target.value;
      const turnElem = document.querySelector<HTMLInputElement>("turn");
      if (turnElem) {
        turnElem.value = turn;
      }
      updateTurn(Number(turn));
    }
  });
  checkSeedParameter();
});
