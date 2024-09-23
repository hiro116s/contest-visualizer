import { apply as applyAhc001 } from "./ahc001/visualizer.js";
import { apply as applyChokudai003 } from "./chokudai003/visualizer.js";
import { default as visualizerChokudai005 } from "./chokudai005/visualizer.js";
import { default as visualizerAhc036 } from "./ahc036/visualizer.js";
import { default as visualizerAhc036_2 } from "./ahc036_2/visualizer.js";

let prev = Date.now();
let isPlaying = false;

const NO_OP_VISUALIZER = {
  initialize: () => { },
  apply: () => { },
  getMaxTurn: () => 0,
};

let visualizer: Visualizer = NO_OP_VISUALIZER;

interface Visualizer {
  initialize(seed: number, input: string, output: string): void;
  apply(turn: number): void;
  getMaxTurn(): number;
}

function extractContestName(pathName: string): string {
  const ws = pathName.split("/");
  if (ws.length !== 3) {
    console.error("Error: Unexpected pathname", pathName);
  }
  return ws[2];
}

async function loadSeedData(seed: number): Promise<void> {
  const contestName = extractContestName(window.location.pathname);
  const dirName = contestName;
  const [input, output] = await Promise.all([
    fetch(`/static/${dirName}/input_${seed}.txt`).then(resp => resp.text()),
    fetch(`/static/${dirName}/output_${seed}.txt`).then(resp => resp.text())]
  );
  setValueToElement('#input', input);
  setValueToElement('#output', output);

  visualizer = findVisualizer(contestName);
  visualizer.initialize(seed, input, output);
  document.querySelector<HTMLInputElement>("#rangeDiv input")?.setAttribute('max', visualizer.getMaxTurn().toString());
  stop();
  updateTurn(0);
}

function findVisualizer(contestName: string): Visualizer {
  switch (contestName) {
    case "ahc001":
      return { initialize: applyAhc001, apply: applyAhc001, getMaxTurn: () => 0 };
    case "chokudai003":
      return { initialize: applyChokudai003, apply: applyChokudai003, getMaxTurn: () => 0 };
    case "chokudai005":
      return visualizerChokudai005;
    case "ahc036":
      return visualizerAhc036;
    case "ahc036_2":
      return visualizerAhc036_2;
    default:
      console.error("Error: Unknown contest name", contestName);
      return NO_OP_VISUALIZER;
  }
}

// Modify the play function as follows
function toggle(): void {
  if (visualizer === NO_OP_VISUALIZER) {
    return;
  }
  if (!isPlaying) {
    start();
  } else {
    stop();
  }
  autoPlay();
}

function start(): void {
  const toggleButton = document.getElementById("toggleButton")!;
  if (getNumberFromElement("#turn") >= visualizer.getMaxTurn()) {
    setValueToElement("#turn", 0);
  }
  toggleButton.innerHTML = "■";
  prev = Date.now();
  isPlaying = true;
}

function stop(): void {
  const toggleButton = document.getElementById("toggleButton")!;
  toggleButton.innerHTML = "▶";
  isPlaying = false;
}

function autoPlay(): void {
  if (!isPlaying) {
    return;
  }

  const now = Date.now();
  let s = 1000;
  const speed = getNumberFromElement("#speed", 1);
  if ((now - prev) * speed >= s) {
    const inc = Math.floor((now - prev) * speed / s);
    prev += Math.floor(inc * s / speed);
    const turn = getNumberFromElement("#turn");
    const newTurn = turn + inc;
    updateTurn(newTurn);
    if (newTurn >= visualizer.getMaxTurn()) {
      toggle();
    }
  }
  requestAnimationFrame(autoPlay);
}

function updateTurn(turn: number): void {
  const newTurn = Math.min(turn, visualizer.getMaxTurn());
  setValueToElement("#turn", newTurn);
  setValueToElement("#rangeDiv input", newTurn);
  visualizer.apply(newTurn);
}

autoPlay();

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById("toggleButton")?.addEventListener("click", toggle);
  document.getElementById("turn")?.addEventListener("change", () => updateTurn(getNumberFromElement("#turn")));
  document.getElementById("seed")?.addEventListener("change", () => {
    const seed = getNumberFromElement("#seed");
    loadSeedData(seed);
  });
  document.querySelector<HTMLInputElement>("#rangeDiv input")?.addEventListener("input", (e) => {
    const target = e.target as HTMLInputElement | null;
    if (target) {
      const turn = Number(target.value);
      setValueToElement("#turn", turn);
      updateTurn(Number(turn));
    }
  });
  loadSeedData(0);
});

function getNumberFromElement(id: string, defaultValue: number = 0): number {
  const elem = document.querySelector<HTMLInputElement>(id);
  if (elem) {
    return Number(elem.value);
  } else {
    return defaultValue;
  }
}

function setValueToElement(id: string, value: number | string): void {
  const turnElem = document.querySelector<HTMLInputElement>(id);
  if (turnElem) {
    turnElem.value = value.toString();
  }
}