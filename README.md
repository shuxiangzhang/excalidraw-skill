# Excalidraw Skill

A reusable Codex skill for turning a codebase or a described process into an
editable Excalidraw diagram in Obsidian.

The skill includes a standalone drawing-script generator, native vector icons,
source-reference labels, bound connectors, and guidance for updating existing
drawings. It works independently of the original `ea-script-template` repository.

## Install

Clone this repository into your personal Codex skills directory:

```sh
git clone https://github.com/shuxiangzhang/excalidraw-skill.git "${CODEX_HOME:-$HOME/.codex}/skills/excalidraw"
```

The destination must not already exist. If you already installed this repository
there, update it with:

```sh
git -C "${CODEX_HOME:-$HOME/.codex}/skills/excalidraw" pull --ff-only
```

## Use in Codex

Invoke the skill from the project you want to understand:

```text
$excalidraw Analyze this codebase and create an editable workflow diagram with icons in Obsidian.
```

Chinese requests work too:

```text
$excalidraw 分析当前项目的代码，生成带图标的可编辑工作流程图，并保存到 Obsidian。
```

The agent traces the actual code, prepares a diagram definition, generates a
Script Engine script, and runs it in the selected Obsidian vault when available.
It can also edit an existing drawing while preserving unrelated content.

## Generate a script directly

Use Node.js 22.13 or newer. No npm dependencies or build step are required.

From this repository:

```sh
mkdir -p output
node scripts/generate_script.mjs assets/example-workflow.json output/example.md
```

Replace the sample definition with your own nodes, relationships, and source
references. Use `--force` when intentionally replacing a generated output.

Copy the resulting `.md` script into the folder configured under **Obsidian →
Excalidraw → Script Engine**. Open a drawing, open the command palette, and run
the script. The runtime requires the Excalidraw plugin version 2.27.0 or newer.

The native Obsidian CLI is optional; the skill can use it to create drawings, run
scripts, and export previews. Without a running Obsidian environment, it can
still generate the runnable script.

## Checks

Run the regression tests using Node's built-in runner:

```sh
node --test tests/*.test.mjs
```

The CLI test verifies script generation through a symlinked checkout.

## Contents

| Path | Purpose |
| --- | --- |
| [SKILL.md](SKILL.md) | Skill instructions and workflow |
| [scripts/generate_script.mjs](scripts/generate_script.mjs) | Dependency-free script generator |
| [assets/example-workflow.json](assets/example-workflow.json) | Sample diagram definition |
| [assets/runtime.js](assets/runtime.js) | Native Excalidraw rendering and text layout |
| [assets/icons.mjs](assets/icons.mjs) | Editable vector icons |
| [references/diagram-spec.md](references/diagram-spec.md) | Input format and layout options |
| [references/ea-runtime.md](references/ea-runtime.md) | Script Engine API guidance |
| [references/obsidian-cli.md](references/obsidian-cli.md) | Native CLI integration and verification |

The agent analyzes the codebase; the generator renders the supplied definition.
Generated diagrams are snapshots, and running a drawing script again appends
another copy beneath existing content.
