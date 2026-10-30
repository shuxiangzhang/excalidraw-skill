---
name: excalidraw
description: Create or edit native, editable Excalidraw diagrams and reusable Obsidian Excalidraw scripts. Use when the user requests Excalidraw (including “escalate draw”), a codebase workflow or architecture drawing in Excalidraw, or changes to an existing Excalidraw drawing. Supports Chinese requests such as “根据代码画流程图”.
---

# Excalidraw

Turn the user's codebase or described process into an editable Excalidraw drawing. Package a reusable Script Engine script when useful or requested. Use the bundled renderer and native icon assets without depending on the original ea-script-template repository.

## Choose the work

- **Codebase to diagram:** inspect the target repository and trace the requested behavior. Infer the current repository and established vault when clear. Ask only when a missing target or scope changes the result materially.
- **Described process to diagram:** use the supplied steps and relationships; do not invent implementation evidence.
- **Edit an existing drawing:** read its current scene and preserve user edits, element IDs, groups and connector bindings. Add or modify the requested elements in place.
- **Custom automation script:** use the EA runtime guidance in [references/ea-runtime.md](references/ea-runtime.md). The bundled card renderer is a starting point, not a requirement for every Excalidraw script.

The primary deliverable is a native drawing. Deliver a PNG/SVG preview alongside it when helpful. Use the user's requested format; do not substitute Mermaid or a flat image for an editable drawing.

## Trace the actual project

Read applicable repository instructions, documentation, command configuration, entrypoints, and the functions that establish the flow. Distinguish application execution from the developer build/release workflow. Choose the scope from the conversation; do not combine both into one oversized diagram automatically.

Record the evidence behind important nodes and edges. Cite real source paths and verified line numbers when useful. Mark inferred or uncertain relationships instead of presenting them as code facts. Distinguish manual steps, optional commands and automatic operations. Analyze each new codebase afresh; never reuse the old template project's steps as a generic project workflow.

## Generate a reusable drawing script

For workflow cards, bound arrows, source labels and editable icons:

1. Read [references/diagram-spec.md](references/diagram-spec.md) and write a diagram JSON definition in a task output directory. Use [assets/example-workflow.json](assets/example-workflow.json) only as a schema example; replace its sample content.
2. Run the bundled helper using the skill's actual installed path:

   ```sh
   node /path/to/excalidraw/scripts/generate_script.mjs /path/to/diagram.json /path/to/diagram.md
   ```

   It needs Node.js and no npm packages. It embeds the renderer and icons, checks the definition and JavaScript syntax, and writes a ready-to-run `.md` script. Use `--force` when intentionally updating that generated script.
3. Review the layout against the actual flow. Explicit rows/columns help separate branches. The renderer wraps labels using EA's font measurement and appends below existing content on repeat runs.
4. For layouts outside this card renderer—decision diamonds, custom architecture, timelines or specialized interactions—adapt a task-local copy or use native EA methods after checking their installed API. Preserve the requested visual outcome rather than forcing it into the example's structure.

Use the user's language for labels. Prefer recognizable line icons and native symbols, readable contrast, short titles, grouped cards and bound connectors. Keep optional paths and feedback loops visually distinct. The bundled assets are native vectors, so users can edit them after drawing.

## Run in Obsidian

Read [references/obsidian-cli.md](references/obsidian-cli.md) for the native CLI workflow and its persistence/retry details. Prefer its purpose-built commands when available; otherwise use the existing Obsidian UI.

Discover the actual vault, installed Excalidraw version, and configured Script Engine folder. Create a new drawing when the user has not selected an existing one. Copy the generated script to the configured folder, run it against the exact drawing/view, and export a preview. A `.md` script is executable code; a `.excalidraw.md` file is the drawing created by the plugin.

If Obsidian or the required plugin is unavailable, still deliver the runnable script and concise installation steps. State which runtime checks remain unverified. Do not install plugins or change unrelated application preferences just to complete a diagram.

## Modify an existing drawing

Inspect the current scene before editing. Identify target elements by stable IDs or generator metadata, with groups and labels as fallbacks. Copy existing elements into EA for editing, preserve IDs, then commit once. Use a narrow patch for requests such as “add icons”; avoid regenerating and replacing the entire drawing.

Group new icons with their existing cards, retain bound connector endpoints, and preserve unrelated notes. Keep the reusable script consistent with the edited drawing when both were requested or already form the task's deliverables.

## Verify and deliver

- Check the generated script and any changed code with the relevant workspace checks. Do not import executable entrypoints into tests.
- In Obsidian, verify the expected nodes/edges, editable objects, groups and valid connector bindings. Check text bounds and a rendered preview; fix overlaps or clipped labels.
- Confirm saving separately from script execution. A CLI completion response alone does not prove persistence. Follow the bounded read/retry procedure in the CLI reference rather than rerunning a mutation blindly.
- Exercise meaningful behaviors affected by the change: existing-content preservation for edits, repeated-run placement for generators, and cancellation for scripts with prompts.
- Clean up only temporary artifacts created for this task. Leave the requested drawing, reusable script and useful preview.

Return the drawing and script links, a brief description of what was drawn or changed, and any material verification limit. Do not claim that a view is visible merely because the native CLI opened it in the background.
