# Diagram definition and generator

Run `scripts/generate_script.mjs input.json output.md [--force]` using the installed skill path. No npm install or original template checkout is needed. Create the output directory first. Existing output is preserved unless `--force` is explicit.

## JSON fields

- `title`: required, nonempty string.
- `subtitle`, `footer`: optional strings. Include the real codebase snapshot date when relevant.
- `columns`: 1–8; defaults to at most 3 columns.
- `cardWidth`: 280–600 scene units; default 380.
- `numbered`: default true; false is useful for architecture components without a step order.
- `rowTitles`: optional array of `{ "row": 0, "title": "Develop" }`. Only title rows that contain nodes.
- `nodes`: nonempty array of the node objects below.
- `edges`: required array of explicit relationships; an empty array is valid for disconnected components.

Node fields:

```json
{
  "id": "validate",
  "title": "Validate request",
  "description": "Check the required fields before saving.",
  "command": "validateRequest(input)",
  "sources": ["src/request.ts:42"],
  "icon": "check",
  "row": 0,
  "column": 1,
  "color": "#1d4ed8"
}
```

Only `id` and `title` are required. IDs must be unique. `sources` must contain real evidence for a codebase diagram; the generator validates structure, not the truth of those paths. `color` is an optional six-digit hex color. Rows and columns are zero-based. If positions are omitted, cards follow a serpentine grid in array order. Choose explicit positions for branches; overlapping grid cells are rejected.

The renderer measures text in Obsidian and expands each row's cards to fit the tallest card. Keep titles and descriptions concise rather than relying on long auto-wrapped prose.

Available icon names:

`download`, `folderPlus`, `code`, `check`, `search`, `package`, `file`, `copy`, `play`, `pencil`, `save`, `monitorCheck`, `refresh`, `plus`.

These are editable lines, rectangles and ellipses. The default icon is `code`. For other symbols, adapt a task-local renderer after consulting the installed EA API.

Edge fields:

```json
{ "from": "validate", "to": "save", "label": "valid", "kind": "flow" }
```

- `from` and `to` refer to existing, distinct node IDs.
- `label` is optional. Short labels work best between cards.
- `kind` is `flow` (solid, default), `optional` (dashed), or `feedback` (outer routed arrow).

Main/optional arrows bind to card shapes. Their labels use EA's straight-arrow label API. Feedback arrows route outside the right edge; position feedback sources toward that edge and inspect the rendered route. For dense branches or crossing edges, revise the layout or adapt the renderer rather than accepting an unreadable result.

## Generated behavior

The `.md` script contains data, renderer and icons, with no external imports. It uses an awaitable Script Engine entrypoint, requires Excalidraw 2.27.0 or newer, stages elements in EA, commits once with saving enabled, and clears the workbench afterward.

Cards have generator metadata containing the node ID and sources. Each card's icon, title and content form a group. Arrows bind to the card shape. The board background is locked; the diagram's content remains editable. Each run adds another copy below existing content, preserving the existing scene.

A graph specification is a snapshot assembled by the agent. Neither the helper nor the generated script scans source repositories automatically.
