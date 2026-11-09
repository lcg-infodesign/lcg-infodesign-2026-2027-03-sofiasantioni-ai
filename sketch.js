
const rawData = [
  {name:"Nile", length:6650, area:3254555, discharge:2800, continent:"Africa", temp:27.5},
  {name:"Amazon", length:6575, area:7050000, discharge:209000, continent:"South America", temp:26},
  {name:"Yangtze", length:6300, area:1808500, discharge:31900, continent:"Asia", temp:17},
  {name:"Mississippi", length:6275, area:2980000, discharge:16200, continent:"North America", temp:17.5},
  {name:"Yenisei", length:5539, area:2580000, discharge:19800, continent:"Asia", temp:-2.5},
  {name:"Yellow River", length:5464, area:752546, discharge:2110, continent:"Asia", temp:11.5},
  {name:"Ob–Irtysh", length:5410, area:2990000, discharge:12800, continent:"Asia", temp:2.5},
  {name:"Paraná", length:4880, area:3100000, discharge:25700, continent:"South America", temp:18.5},
  {name:"Congo", length:4700, area:4014500, discharge:41300, continent:"Africa", temp:24},
  {name:"Amur", length:4480, area:1855000, discharge:11000, continent:"Asia", temp:-2.5},
  {name:"Lena", length:4400, area:2490000, discharge:16400, continent:"Asia", temp:-5},
  {name:"Mekong", length:4350, area:795000, discharge:16000, continent:"Asia", temp:25},
  {name:"Mackenzie", length:4241, area:1740000, discharge:9700, continent:"North America", temp:2.5},
  {name:"Niger", length:4180, area:2092000, discharge:6000, continent:"Africa", temp:27.5},
  {name:"Brahmaputra", length:3960, area:651335, discharge:19800, continent:"Asia", temp:20},
  {name:"Murray–Darling", length:3750, area:1061469, discharge:767, continent:"Australia", temp:22.5},
  {name:"Tocantins", length:3650, area:967059, discharge:13700, continent:"South America", temp:26},
  {name:"Volga", length:3645, area:1360000, discharge:8060, continent:"Europe", temp:2.5},
  {name:"Shatt al-Arab", length:3600, area:879790, discharge:1350, continent:"Asia", temp:22.5},
  {name:"Purús", length:3379, area:371042, discharge:8400, continent:"South America", temp:26},
  {name:"Madeira", length:3379, area:850000, discharge:31000, continent:"South America", temp:26},
  {name:"Yukon", length:3190, area:832700, discharge:6430, continent:"North America", temp:2.5},
  {name:"Indus", length:3180, area:1155000, discharge:6000, continent:"Asia", temp:15},
  {name:"São Francisco", length:3150, area:641000, discharge:2850, continent:"South America", temp:22.5},
  {name:"Salween", length:2990, area:271914, discharge:16300, continent:"Asia", temp:22.5},
  {name:"Saint Lawrence", length:3058, area:1344200, discharge:10400, continent:"North America", temp:5},
  {name:"Rio Grande", length:3057, area:558000, discharge:160, continent:"North America", temp:20},
  {name:"Danube", length:2860, area:817000, discharge:6450, continent:"Europe", temp:10},
  {name:"Zambezi", length:2734, area:1390000, discharge:4900, continent:"Africa", temp:22.5},
  {name:"Ganges", length:2525, area:1000000, discharge:16000, continent:"Asia", temp:20},
  {name:"Rhine", length:1233, area:185000, discharge:2900, continent:"Europe", temp:10},
  {name:"Po", length:652, area:74000, discharge:1500, continent:"Europe", temp:15}
];

let glyphs = [];
let selectedGlyph = null;


const continentColors = {
  "Africa": "#f59e0b",
  "South America": "#10b981",
  "Asia": "#ef4444",
  "North America": "#3b82f6",
  "Europe": "#8b5cf6",
  "Australia": "#ec4899",
  "Oceania": "#ec4899"
};


function setup() {
  createCanvas(windowWidth, windowHeight);

  let minLen = Math.min(...rawData.map(d => d.length));
  let maxLen = Math.max(...rawData.map(d => d.length));
  let minArea = Math.min(...rawData.map(d => d.area));
  let maxArea = Math.max(...rawData.map(d => d.area));
  let minDis = Math.min(...rawData.map(d => d.discharge));
  let maxDis = Math.max(...rawData.map(d => d.discharge));
  let minTemp = Math.min(...rawData.map(d => d.temp));
  let maxTemp = Math.max(...rawData.map(d => d.temp));

  let cols = 8;
  let marginX = 80;
  let marginY = 140;
  let spacingX = 120;
  let spacingY = 110;

  rawData.forEach((d, i) => {
    let col = i % cols;
    let row = Math.floor(i / cols);
    let x = marginX + col * spacingX;
    let y = marginY + row * spacingY;

    let baseColor = continentColors[d.continent] || "#ffffff";

    glyphs.push({
      data: d,
      x: x,
      y: y,
      size: map(sqrt(d.area), sqrt(minArea), sqrt(maxArea), 28, 65),     
      waves: floor(map(d.length, minLen, maxLen, 2, 5)),                 
      flowSpeed: map(d.discharge, minDis, maxDis, 0.01, 0.05),           
      color: color(baseColor),                                           
      tempColor: lerpColor(color('#38bdf8'), color('#f97316'), map(d.temp, minTemp, maxTemp, 0, 1)) 
    });
  });
}


function draw() {
  background(15, 23, 42);

  drawBackgroundCurrents();
  drawHeader();
  drawLegend();

  for (let g of glyphs) {
    let isHover = dist(mouseX, mouseY, g.x, g.y) < g.size / 2 + 5;
    drawWaterDropGlyph(g, isHover || selectedGlyph === g);
  }

  drawDetailsCard(selectedGlyph);
}


function drawBackgroundCurrents() {
  push();
  noFill();
  stroke(30, 41, 59, 120);
  strokeWeight(1.5);

  for (let y = 100; y < height; y += 140) {
    beginShape();
    for (let x = 0; x <= width; x += 40) {
      let wave = sin((x + frameCount * 0.5) * 0.005 + y) * 30;
      vertex(x, y + wave);
    }
    endShape();
  }
  pop();
}


function drawWaterDropGlyph(g, highlight) {
  push();
  translate(g.x, g.y);

  noStroke();
  fill(30, 41, 59, 180);
  ellipse(0, 0, g.size + 10, g.size + 10);

  if (highlight) {
    noFill();
    stroke(255, 255, 255, 200);
    strokeWeight(2);
    ellipse(0, 0, g.size + 16, g.size + 16);
  }

  let waveOffset = sin(frameCount * g.flowSpeed + g.x) * 2.5;

  let maxR = g.size / 2;
  for (let w = 1; w <= g.waves; w++) {
    let currentRadius = (maxR / g.waves) * w + waveOffset;
    if (currentRadius < 4) continue;

   noFill();
  stroke(g.color);
  strokeWeight(1.5);
  ellipse(0, 0, currentRadius * 2, currentRadius * 2); // Cerchio completo anziché arco
  }

  noStroke();
  fill(g.tempColor);
  ellipse(0, 0, 10, 10);

  fill(203, 213, 225);
  textSize(10);
  textAlign(CENTER);
  text(g.data.name, 0, maxR + 16);

  pop();
}


function drawHeader() {
  fill(248, 250, 252);
  textSize(22);
  textStyle(BOLD);
  textAlign(LEFT);
  text("I Fiumi del Mondo - Mappa delle Correnti Fluviali", 30, 40);
}

function drawLegend() {
  push();
  translate(620, 18);

  fill(30, 41, 59, 220);
  stroke(51, 65, 85);
  rect(0, 0, 450, 95, 8);

  fill(226, 232, 240);
  textSize(11);
  textStyle(BOLD);
  textAlign(LEFT);
  text("LEGENDA E PROCESSO DI CODIFICA", 15, 20);

  textStyle(NORMAL);
  textSize(10);
  fill(148, 163, 184);
  text("• Dimensione Goccia = Superficie del Bacino (km²)", 15, 38);
  text("• Numero di Onde = Lunghezza del Fiume (km)", 15, 53);
  text("• Velocità di Flusso = Portata d'Acqua (m³/s)", 15, 68);
  text("• Nucleo Centrale = Temperatura Media (Blu = Freddo, Arancione = Caldo)", 15, 83);

  pop();
}

function drawDetailsCard(g) {
  if (!g) return; // Nessun testo in basso finché non viene cliccato un glifo

  push();
  translate(30, height - 85);

  fill(30, 41, 59, 240);
  stroke(g.color);
  strokeWeight(2);
  rect(0, 0, width - 60, 65, 8);

  noStroke();
  fill(255);
  textSize(15);
  textStyle(BOLD);
  textAlign(LEFT);
  text(`${g.data.name} (${g.data.continent})`, 20, 25);

  textSize(12);
  textStyle(NORMAL);
  fill(203, 213, 225);
  text(`• Lunghezza: ${g.data.length.toLocaleString()} km`, 20, 46);
  text(`• Area Bacino: ${g.data.area.toLocaleString()} km²`, 240, 46);
  text(`• Portata: ${g.data.discharge.toLocaleString()} m³/s`, 500, 46);
  text(`• Temp. Media: ${g.data.temp} °C`, 760, 46);

  pop();
}


function mousePressed() {
  let clicked = null;
  for (let g of glyphs) {
    if (dist(mouseX, mouseY, g.x, g.y) < g.size / 2 + 5) {
      clicked = g;
      break;
    }
  }
  selectedGlyph = clicked;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}