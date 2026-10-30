# Obsidian / Excalidraw native CLI

Use installed capabilities rather than assuming a particular CLI version. Read `obsidian help`, then discover the plugin's `help`, `schema`, `status` or `api` commands as relevant. If the native commands are absent, use the existing Obsidian UI or deliver the script with runtime instructions; do not change unrelated settings automatically.

## Locate the destination

`obsidian vaults verbose` lists vault names and paths. Resolve the user's selected or established vault. Read only the needed Excalidraw settings from `<vault>/.obsidian/plugins/obsidian-excalidraw-plugin/data.json`, especially `scriptFolderPath`. Do not hardcode a vault name or scripts folder in the skill.

For native command invocations, Node's `execFileSync` argument array avoids shell interpolation of JSON, spaces, quotes and user labels:

```js
const result = JSON.parse(execFileSync("obsidian", [
  "vault=" + vaultName,
  "obsidian-excalidraw-plugin:create",
  "json=" + JSON.stringify(request)
], { encoding: "utf8" }));
```

Inspect `ok`, `status`, `error`, `warnings`, `target`, `data` and any returned revision. The shell can exit successfully even when a native JSON response reports failure.

## Create, run, read, export

Read the installed schemas before relying on these example fields:

```text
obsidian ... obsidian-excalidraw-plugin:schema action=create
obsidian ... obsidian-excalidraw-plugin:schema action=script
obsidian ... obsidian-excalidraw-plugin:schema action=export
```

Typical JSON payloads:

```json
{"apiVersion":1,"command":"create","requestId":"unique-create-id","path":"Drawings/Project Workflow.excalidraw.md"}
```

The create command never overwrites an existing drawing. Use an exact new vault-relative path. Then `open` that path and retain its returned `viewId`:

```json
{"apiVersion":1,"command":"open","path":"Drawings/Project Workflow.excalidraw.md"}
```

Install the generated `.md` script into the configured Script Engine folder. If a just-copied file is not yet recognized, verify it with `obsidian file path=...` and allow the file watcher to catch up before running it. Retry that read/registration check a few times, not the drawing mutation. Execute only the exact locally authored script needed for the task:

```json
{"apiVersion":1,"command":"script","requestId":"unique-script-id","path":"Drawings/Project Workflow.excalidraw.md","view":"returned-view-id","script":"ConfiguredScripts/workflow.md","trusted":true}
```

Trust applies to this script execution; it is not permission to execute arbitrary scripts. Use top-level await in the generated script. A successful script response can still report unknown persistence.

Read the exact drawing/view:

```json
{"apiVersion":1,"command":"read","path":"Drawings/Project Workflow.excalidraw.md","view":"returned-view-id","source":"live","detail":"elements","limit":200}
```

Some versions require live reads to use the returned view ID explicitly, especially with multiple views. An `open` response does not establish that the drawing is focused in the visible app window.

Export a preview after confirming the scene:

```json
{"apiVersion":1,"command":"export","requestId":"unique-export-id","path":"Drawings/Project Workflow.excalidraw.md","view":"returned-view-id","source":"live","out":"Drawings/Project Workflow.png","theme":"light","scale":1}
```

Use `overwrite: true` only when intentionally updating that known preview. Preserve unrelated outputs. Use actual returned paths and dimensions when showing the preview.

## Persistence, revision and retry details

- Verify completion at three levels as needed: command response, expected live elements, and saved drawing. Live state and the saved file can briefly differ. Use bounded read-only checks (for example, up to three with short backoff), then report a genuine remaining limitation instead of blindly running the script again.
- A raw file's Markdown text section can lag a scene update. A changed file size alone is not proof of the expected scene. Prefer the native disk reader or reload/export through the plugin after saving.
- Treat script timeouts or ambiguous mutation results as unknown outcomes. Query `result` using the original request ID or inspect the drawing before any retry. Where the installed API supports idempotent requests, retain the same ID and effective payload when recovering that operation. Do not create another drawing or run with a fresh ID simply because the response was unclear.
- For element pagination, keep the returned revision on subsequent pages. On `STALE_REVISION`, fetch page one again and retry the read with its new revision, up to three times. Never repeat the mutation to repair pagination.
- Prefer one bounded page or an IDs filter when it answers the check. Arrow x/y plus width/height can be misleading for paths with negative local points; inspect the actual points or EA bounds when testing overlap.
- For edits through native `apply`, obtain a fresh live revision and follow the installed schema. For updates through an EA script, copy existing scene elements into the workbench and commit once.
- A physical mobile or popout interaction is only verified by testing that interaction. A desktop preview proves neither.

Remove only temporary test drawings/scripts you created, using Obsidian's recoverable trash when available. Do not empty the trash or touch user-created drawings during cleanup.
