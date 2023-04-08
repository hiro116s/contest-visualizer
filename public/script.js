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
