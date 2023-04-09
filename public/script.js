function updateResult() {
  const seed = document.getElementById('seed').value;
  const input = document.getElementById('input').value;
  const output = document.getElementById('output').value;

  apply(seed, input, output);
}

function apply(seed, input, output) {
  // ここに実際のvisualizerの実装を書いてください。
  const result = document.getElementById('result');
  result.innerHTML = `Seed: ${seed}<br>Input: ${input}<br>Output: ${output}`;
}

async function fetchAndSetContent(url, elementId) {
  try {
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
  await fetchAndSetContent(`input_${seed}.txt`, 'input');
  await fetchAndSetContent(`output_${seed}.txt`, 'output');
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

document.addEventListener('DOMContentLoaded', () => {
  checkSeedParameter();
});
