import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync, symlinkSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { test } from "node:test";

const root = fileURLToPath(new URL("../", import.meta.url));

test("CLI generates a script when its checkout is accessed through a directory symlink", (t) => {
  const directory = mkdtempSync(join(tmpdir(), "excalidraw-cli-test-"));
  t.after(() => rmSync(directory, { recursive: true, force: true }));
  const alias = join(directory, "skill-alias");
  symlinkSync(root, alias, "junction");
  const output = join(directory, "example.md");
  const result = spawnSync(process.execPath, [
    join(alias, "scripts/generate_script.mjs"),
    join(alias, "assets/example-workflow.json"),
    output,
  ], { cwd: directory, encoding: "utf8" });

  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /Generated /);
  const script = readFileSync(output, "utf8");
  assert.match(script, /await renderDiagram\(ea, diagram\)/);
  assert.doesNotMatch(script, /^import\s/m);
});
