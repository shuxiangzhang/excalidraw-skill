/* Native EA diagram renderer, embedded by generate_script.mjs. */
const diagramStyle = { ink: "#172b4d", muted: "#52647a", border: "#d5deeb",
  white: "#ffffff", feedback: "#b45309", padding: 60, gapX: 90, gapY: 110 };

function setFont(ea, size, mono = false) {
  ea.setStyle({ fontSize: size, fontFamily: mono ? 3 : 2 });
}

/** Wrap by measured glyph width, including Chinese and long source paths. */
function wrapLabel(ea, value, width, size, mono = false) {
  setFont(ea, size, mono);
  return value.split("\n").flatMap(paragraph => {
    const lines = [];
    let line = "";
    for (const character of Array.from(paragraph)) {
      if (line && ea.measureText(line + character).width > width) {
        // Keep closing punctuation with a preceding character when wrapping Chinese text.
        if (/[。，、；：！？,.!?;:)）\]】》”’]/u.test(character) && Array.from(line).length > 1) {
          const characters = Array.from(line);
          const preceding = characters.pop();
          lines.push(characters.join(""));
          line = preceding + character;
          continue;
        }
        const split = line.lastIndexOf(" ");
        if (split > line.length / 2) {
          lines.push(line.slice(0, split));
          line = line.slice(split + 1) + character;
        } else { lines.push(line); line = character; }
      } else line += character;
    }
    lines.push(line);
    return lines;
  }).join("\n");
}

function addDiagramText(ea, x, y, value, size, color, mono = false) {
  ea.setStyle({ strokeColor: color, backgroundColor: "transparent", opacity: 100,
    fontSize: size, fontFamily: mono ? 3 : 2, roughness: 0 });
  return ea.addText(x, y, value);
}

function addDiagramRect(ea, x, y, width, height, stroke, fill) {
  ea.setStyle({ strokeColor: stroke, backgroundColor: fill, fillStyle: "solid",
    strokeWidth: 1, strokeStyle: "solid", roughness: 0, opacity: 100, roundness: { type: 3 } });
  return ea.addRect(x, y, width, height);
}

/** Measure card contents before positioning any scene elements. */
function planCard(ea, node, width) {
  const blocks = [];
  const title = wrapLabel(ea, node.title, width - 104, 21);
  let y = 20;
  setFont(ea, 21);
  blocks.push({ value: title, x: 64, y, size: 21, mono: false, color: diagramStyle.ink });
  y += Math.max(30, ea.measureText(title).height) + 16;
  for (const item of [
    { value: node.description, size: 18, mono: false, color: diagramStyle.muted },
    { value: node.command, size: 15, mono: true, color: node.color },
    { value: node.sources.join("\n"), size: 12, mono: true, color: diagramStyle.muted },
  ]) {
    if (!item.value) continue;
    const value = wrapLabel(ea, item.value, width - 44, item.size, item.mono);
    blocks.push({ ...item, value, x: 22, y });
    setFont(ea, item.size, item.mono);
    y += ea.measureText(value).height + 12;
  }
  return { node, blocks, height: Math.max(180, y + 10) };
}

function planDiagram(ea, spec) {
  const width = diagramStyle.padding * 2 + spec.columns * spec.cardWidth +
    (spec.columns - 1) * diagramStyle.gapX + 36;
  const title = wrapLabel(ea, spec.title, width - 120, 36);
  setFont(ea, 36);
  let y = 34 + ea.measureText(title).height + 12;
  const subtitle = wrapLabel(ea, spec.subtitle, width - 120, 19);
  const subtitleY = y;
  if (subtitle) { setFont(ea, 19); y += ea.measureText(subtitle).height + 22; }
  y += 45;
  const cards = spec.nodes.map(node => planCard(ea, node, spec.cardWidth));
  const rows = [...new Set(spec.nodes.map(node => node.row))].sort((a, b) => a - b);
  const rowPlans = [];
  for (const row of rows) {
    const rowCards = cards.filter(card => card.node.row === row);
    const height = Math.max(...rowCards.map(card => card.height));
    const heading = spec.rowTitles.find(item => item.row === row)?.title ?? "";
    const headingText = wrapLabel(ea, heading, Math.max(150, spec.cardWidth / 2 - 24), 16);
    setFont(ea, 16);
    const headingHeight = heading ? ea.measureText(headingText).height + 24 : 0;
    rowPlans.push({ row, y, height, heading: headingText, headingHeight });
    for (const card of rowCards) {
      card.x = diagramStyle.padding + card.node.column * (spec.cardWidth + diagramStyle.gapX);
      card.y = y + headingHeight;
      card.height = height;
    }
    y += headingHeight + height + diagramStyle.gapY;
  }
  const footer = wrapLabel(ea, spec.footer, width - 120, 14);
  setFont(ea, 14);
  return { width, height: y - diagramStyle.gapY + 60 + ea.measureText(footer).height + 36,
    title, subtitle, subtitleY, cards, rows: rowPlans, footer, footerY: y - diagramStyle.gapY + 40 };
}

function diagramOrigin(ea, plan) {
  const existing = ea.getViewElements().filter(element => !element.isDeleted);
  if (existing.length) {
    const bounds = ea.getBoundingBox(existing);
    return { x: bounds.topX, y: bounds.topY + bounds.height + 140 };
  }
  const center = ea.getViewCenterPosition();
  return { x: center.x - plan.width / 2, y: center.y - plan.height / 2 };
}

function drawDiagramBackground(ea, plan, origin) {
  const background = addDiagramRect(ea, origin.x, origin.y, plan.width, plan.height,
    diagramStyle.border, diagramStyle.white);
  ea.getElement(background).locked = true;
  addDiagramText(ea, origin.x + 60, origin.y + 34, plan.title, 36, diagramStyle.ink);
  if (plan.subtitle) addDiagramText(ea, origin.x + 60, origin.y + plan.subtitleY,
    plan.subtitle, 19, diagramStyle.muted);
  for (const row of plan.rows) {
    if (!row.heading) continue;
    const id = addDiagramRect(ea, origin.x + 36, origin.y + row.y - 12,
      plan.width - 72, row.height + row.headingHeight + 36, "#f1f5f9", "#f8fafc");
    ea.getElement(id).locked = true;
    addDiagramText(ea, origin.x + 60, origin.y + row.y, row.heading, 16, diagramStyle.muted);
  }
  addDiagramText(ea, origin.x + 60, origin.y + plan.footerY, plan.footer, 14, diagramStyle.muted);
}

function drawDiagramCard(ea, card, origin, index, spec) {
  const { node } = card;
  const x = origin.x + card.x;
  const y = origin.y + card.y;
  const shape = addDiagramRect(ea, x, y, spec.cardWidth, card.height, node.color, diagramStyle.white);
  const ids = [shape, ...drawIcon(ea, node.icon, { x: x + 22, y: y + 18, size: 28, color: node.color })];
  if (spec.numbered) ids.push(addDiagramText(ea, x + spec.cardWidth - 35, y + 24,
    String(index + 1).padStart(2, "0"), 12, node.color, true));
  for (const block of card.blocks) ids.push(addDiagramText(ea, x + block.x, y + block.y,
    block.value, block.size, block.color, block.mono));
  ea.addToGroup(ids);
  ea.addAppendUpdateCustomData(shape, { excalidrawSkill: { node: node.id, sources: node.sources } });
  return { id: shape, x, y, width: spec.cardWidth, height: card.height };
}

function diagramConnectionSides(from, to) {
  if (Math.abs(from.y - to.y) < 1) return from.x < to.x ? ["right", "left"] : ["left", "right"];
  return from.y < to.y ? ["bottom", "top"] : ["top", "bottom"];
}

function drawDiagramFeedback(ea, edge, from, to, plan, origin) {
  const rail = origin.x + plan.width - 24;
  const top = Math.min(from.y, to.y) - 24;
  const middle = to.x + to.width / 2;
  ea.addArrow([[from.x + from.width, from.y + from.height / 2],
    [rail, from.y + from.height / 2], [rail, top], [middle, top], [middle, to.y]], {
    startObjectId: from.id, endObjectId: to.id, startArrowHead: null, endArrowHead: "triangle",
    startBindMode: "orbit", endBindMode: "orbit", startFixedPoint: [1, 0.5], endFixedPoint: [0.5, 0],
  });
  if (edge.label) {
    const label = wrapLabel(ea, edge.label, Math.max(120, rail - middle - 16), 14);
    setFont(ea, 14);
    addDiagramText(ea, middle + 8, top - ea.measureText(label).height - 4, label, 14, diagramStyle.feedback);
  }
}

function drawDiagramEdges(ea, spec, shapes, plan, origin) {
  for (const edge of spec.edges) {
    const from = shapes.get(edge.from);
    const to = shapes.get(edge.to);
    ea.setStyle({ strokeColor: edge.kind === "feedback" ? diagramStyle.feedback : diagramStyle.muted,
      strokeWidth: 2, strokeStyle: edge.kind === "flow" ? "solid" : "dashed", roughness: 0, roundness: null });
    if (edge.kind === "feedback") {
      drawDiagramFeedback(ea, edge, from, to, plan, origin);
      continue;
    }
    const [first, second] = diagramConnectionSides(from, to);
    const arrow = ea.connectObjects(from.id, first, to.id, second,
      { startArrowHead: null, endArrowHead: "triangle", padding: 10, numberOfPoints: 0 });
    if (edge.label) {
      setFont(ea, 14);
      ea.addLabelToLine(arrow, edge.label);
    }
  }
}

/** Commit one complete diagram; repeated runs append beneath existing content. */
async function renderDiagram(ea, spec) {
  if (!ea.verifyMinimumPluginVersion("2.27.0")) throw new Error("This script requires Excalidraw 2.27.0 or newer.");
  if (!ea.getExcalidrawAPI()) throw new Error("Open an Excalidraw drawing before running this script.");
  ea.clear();
  try {
    const plan = planDiagram(ea, spec);
    const origin = diagramOrigin(ea, plan);
    drawDiagramBackground(ea, plan, origin);
    const shapes = new Map(plan.cards.map((card, index) =>
      [card.node.id, drawDiagramCard(ea, card, origin, index, spec)]));
    drawDiagramEdges(ea, spec, shapes, plan, origin);
    ea.viewZoomToElements(false, ea.getElements(), 0.05);
    if (!(await ea.addElementsToView(false, true, true))) throw new Error("Could not save the diagram.");
  } finally { ea.clear(); }
}
