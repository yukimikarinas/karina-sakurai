
const container = document.getElementById("wl-demo");

const controls = document.createElement("div");
controls.innerHTML = `
<button id="generate">Generate Graph</button>
<button id="step">Step</button>
<button id="reset">Reset</button>
<hr/>
`;
container.appendChild(controls);

const graphDiv = document.createElement("div");
graphDiv.style.height = "400px";
container.appendChild(graphDiv);

let nodes = [];
let edges = [];
let colors = {};

function randomGraph(n = 10, p = 0.3) {
  nodes = [];
  edges = [];
  colors = {};

  for (let i = 0; i < n; i++) {
    nodes.push({ id: i, label: String(i) });
    colors[i] = "0";
  }

  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      if (Math.random() < p) {
        edges.push({ from: i, to: j });
      }
    }
  }

  draw();
}

function neighbors(v) {
  return edges
    .filter(e => e.from === v || e.to === v)
    .map(e => (e.from === v ? e.to : e.from));
}

function refine() {
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
  draw();
}

function draw() {
  const palette = ["#e41a1c","#377eb8","#4daf4a","#984ea3","#ff7f00"];

  const visNodes = nodes.map(n => ({
    ...n,
    label: `${n.id}\nC:${colors[n.id]}`,
    color: { background: palette[colors[n.id] % palette.length] }
  }));

  const data = {
    nodes: new vis.DataSet(visNodes),
    edges: new vis.DataSet(edges)
  };

  new vis.Network(graphDiv, data, { physics: false });
}

document.getElementById("generate").onclick = () => randomGraph();
document.getElementById("step").onclick = () => refine();
document.getElementById("reset").onclick = () => draw();

randomGraph();
