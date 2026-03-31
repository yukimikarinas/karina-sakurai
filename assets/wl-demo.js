const container = document.getElementById("wl-demo");

const controls = document.createElement("div");
controls.innerHTML = `
<button id="generate">Generate Graph</button>
<button id="step">Step</button>
<button id="back">Back</button>
<button id="reset">Reset</button>
<hr/>
`;
container.appendChild(controls);

const graphDiv = document.createElement("div");
graphDiv.style.height = "420px";
container.appendChild(graphDiv);

let nodes = [];
let edges = [];
let colors = {};
let history = [];

let network;
let visNodes;
let visEdges;

function randomGraph(n = 10, p = 0.3) {
  nodes = [];
  edges = [];
  colors = {};
  history = [];

  for (let i = 0; i < n; i++) {
    nodes.push({ id: i });
    colors[i] = "0";
  }

  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      if (Math.random() < p) {
        edges.push({ from: i, to: j });
      }
    }
  }

  initNetwork();
  updateColors();
}

function neighbors(v) {
  return edges
    .filter(e => e.from === v || e.to === v)
    .map(e => (e.from === v ? e.to : e.from));
}

function refine() {
  history.push(JSON.parse(JSON.stringify(colors)));

  const newColors = {};
  const signatures = {};

  nodes.forEach(n => {
    const neigh = neighbors(n.id).map(x => colors[x]).sort();
    signatures[n.id] = colors[n.id] + "|" + neigh.join(",");
  });

  const unique = [...new Set(Object.values(signatures))];

  nodes.forEach(n => {
    newColors[n.id] = String(unique.indexOf(signatures[n.id]));
  });

  colors = newColors;
  updateColors();
}

function back() {
  if (history.length === 0) return;
  colors = history.pop();
  updateColors();
}

function reset() {
  if (history.length === 0) return;
  colors = history[0];
  history = [];
  updateColors();
}

function initNetwork() {
  const palette = ["#e41a1c","#377eb8","#4daf4a","#984ea3","#ff7f00"];

  visNodes = new vis.DataSet(
    nodes.map(n => ({
      id: n.id,
      label: `${n.id}\nC:0`,
      color: { background: palette[0] }
    }))
  );

  visEdges = new vis.DataSet(edges);

  network = new vis.Network(graphDiv, {
    nodes: visNodes,
    edges: visEdges
  }, {
    physics: {
      enabled: false
    },
    layout: {
      randomSeed: 42
    }
  });
}

function updateColors() {
  const palette = ["#e41a1c","#377eb8","#4daf4a","#984ea3","#ff7f00"];

  nodes.forEach(n => {
    visNodes.update({
      id: n.id,
      label: `${n.id}\nC:${colors[n.id]}`,
      color: { background: palette[colors[n.id] % palette.length] }
    });
  });
}

document.getElementById("generate").onclick = () => randomGraph();
document.getElementById("step").onclick = () => refine();
document.getElementById("back").onclick = () => back();
document.getElementById("reset").onclick = () => reset();

randomGraph();
