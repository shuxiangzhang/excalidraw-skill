# ExcalidrawAutomate runtime essentials

The Obsidian Excalidraw Script Engine injects `ea` and `utils`. Use runtime Obsidian classes through `ea.obsidian`. A finished script cannot import runtime npm, `obsidian`, or plugin modules. Type-only imports are acceptable in an existing TypeScript build workspace; never invent ambient API stubs to make a build pass.

Prefer EA methods, then `ea.getExcalidrawAPI()`, then low-level ExcalidrawLib helpers only when needed. Check the installed API with the native CLI's `api` command (discover its schema/help first), or inspect the installed plugin/declarations. This reference is a small set of proven methods, not the full API.

## Creation and editing

```js
ea.clear();
try {
  ea.style.strokeColor = "#1d4ed8";
  ea.style.fontSize = 22;
  const box = ea.addRect(0, 0, 320, 180);
  const label = ea.addText(20, 20, "Read the code");
  ea.addToGroup([box, label]);
  await ea.addElementsToView(false, true, true);
} finally {
  ea.clear();
}
```

For an existing scene, use identity-preserving workbench copies:

```js
const selected = ea.getViewSelectedElements();
ea.clear();
try {
  ea.copyViewElementsToEAforEditing(selected);
  for (const original of selected) ea.getElement(original.id).strokeColor = "#1d4ed8";
  await ea.addElementsToView();
} finally {
  ea.clear();
}
```

Scene elements are immutable. `cloneElement`/`cloneElements` create new IDs and are for actual duplicates. Clear the workbench between transactions; `clear()` does not delete scene elements. Await one operation before starting another on the same EA instance.

Proven creation methods:

- `addRect(x, y, width, height)`, `addEllipse(...)`, `addDiamond(...)` return element IDs.
- `addText(x, y, text, formatting?)` returns an ID. Set styles before creation.
- `addLine([[x, y], ...])` creates native vector lines, suitable for editable icons.
- `connectObjects(idA, "right", idB, "left", {endArrowHead: "triangle", padding: 10, numberOfPoints: 0})` creates a bound arrow.
- `addLabelToLine(arrowId, label)` supports straight, two-point lines/arrows.
- `addArrow(points, {startObjectId, endObjectId, startFixedPoint: [1, .5], endFixedPoint: [.5, 0], startArrowHead: null, endArrowHead: "triangle"})` supports a custom route with bound ends.
- `measureText(text)` returns width/height using current EA font settings.
- `addAppendUpdateCustomData(id, data)` safely merges generator metadata.

To add icons to a pre-existing group, assign the new workbench icon elements the card's group IDs. Keep their frame ID consistent when relevant. Preserve existing card and connector IDs. After changing an existing text element's font size, use `refreshTextElementSize(id)` as needed.

## Execution and UI

`utils.inputPrompt(...)` and `utils.suggester(...)` return `undefined` on cancellation; check this explicitly. Empty input is not automatically cancellation. Use Obsidian modals for custom confirmations or forms. Use the target view's owning document/window for UI in popouts.

Use `ea.verifyMinimumPluginVersion(version)` for Excalidraw and `ea.obsidian.requireApiVersion(version)` for Obsidian. They are different checks. A restored sidepanel can begin with no target view; bind explicitly using `ea.setView(view)` and clear with `ea.setView(null)` when unbound. Register external listeners and timers with `ea.registerCleanup(...)`.

Generated scripts use top-level `await` supported by the Script Engine so completion can include their async work. Avoid a fire-and-forget `void main()` when a caller needs to await completion. If using a workspace bundler, verify its output contract before introducing top-level await; a bundler's ordinary-script syntax check may reject it.

## Export and save

- Commit persistent edits with `await ea.addElementsToView(...)`; saving defaults to true.
- `viewZoomToElements(false, elements, margin)` can frame staged elements before committing, keeping the actual scene edit last in the history sequence.
- Use `createViewSVG` / `createViewPNG` for a live view, and `createSVG(null, ...)` / `createPNG(null, ...)` for workbench export.
- `elementsOverride` replaces the complete export set; it is not an additive patch.
- Use the plugin loader/serializer for existing `.excalidraw.md` files. Do not hand-edit their compressed scene data.

For workspace source changes, honor local checks and generated type ownership. For a standalone generated script, use the helper's syntax validation and a real Obsidian smoke test; static checks alone cannot establish runtime behavior.
