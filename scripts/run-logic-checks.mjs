import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const moduleCache = new Map();

function loadTsModule(relativePath) {
  if (moduleCache.has(relativePath)) return moduleCache.get(relativePath);

  const filename = resolve(root, relativePath);
  const source = readFileSync(filename, "utf8");
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2020,
      esModuleInterop: true,
    },
    fileName: filename,
  });

  const module = { exports: {} };
  const localRequire = (specifier) => {
    if (relativePath === "utils/addGameForm.ts" && specifier === "./games") {
      return loadTsModule("utils/games.ts");
    }
    throw new Error(`Unexpected dependency ${specifier} in ${relativePath}`);
  };
  const wrapped = new Function("require", "module", "exports", outputText);
  wrapped(localRequire, module, module.exports);
  moduleCache.set(relativePath, module.exports);
  return module.exports;
}

const games = loadTsModule("utils/games.ts");
const instructions = loadTsModule("utils/instructions.ts");
const addForm = loadTsModule("utils/addGameForm.ts");

assert.deepEqual(games.splitCSV("Low, Moderate, High"), ["Low", "Moderate", "High"]);
assert.deepEqual(games.parsePlayers("3-4"), { min: 3, max: 4 });
assert.equal(games.playersMatchFilter("1, 2+, 5+", "1"), true);
assert.equal(games.playersMatchFilter("1+", "4"), true);
assert.equal(games.playersMatchFilter("2+", "1"), false);
assert.equal(games.playersMatchFilter("2", "3"), false);
assert.equal(games.playersMatchFilter("1, 2+, 5+", "5+"), true);
assert.equal(games.playersMatchFilter("1", "2+"), false);
assert.equal(games.normalizeAgeBand("3–5"), "4–5");
assert.deepEqual(games.sortByPreferredOrder(["High", "Moderate", "Low"], games.noiseFilterOptions), [
  "Low",
  "Moderate",
  "High",
]);
const currentFilterMap = { paper: true, "test scarf": true };
assert.deepEqual(games.pruneFilterMap(currentFilterMap, ["paper", "tape"]), { paper: true });
assert.equal(games.pruneFilterMap(currentFilterMap, ["paper", "test scarf"]), currentFilterMap);
assert.equal(games.suppliesMatchAvailable(["paper"], ["paper", "tape"]), true);
assert.equal(games.suppliesMatchAvailable(["paper", "tape"], ["paper"]), false);
assert.equal(games.suppliesMatchAvailable(["paper", "tape"], ["paper", "tape", "cups"]), true);
assert.equal(games.suppliesMatchAvailable([], ["paper"]), true);
assert.equal(games.suppliesMatchAvailable(["none"], ["paper"]), true);
assert.equal(games.suppliesMatchAvailable([], ["none"]), true);
assert.equal(games.suppliesMatchAvailable(["paper"], ["none"]), false);

const parsed = instructions.parseInstructionBlocks([
  "1) Start with a balloon\nNote: Keep it gentle\nCategory examples:\n- animals\n- colors",
]);
assert.equal(parsed[0].type, "step");
assert.equal(parsed[0].text, "Start with a balloon");
assert.equal(parsed[1].type, "note");
assert.equal(parsed[1].text, "Keep it gentle");
assert.equal(parsed[2].type, "category");
assert.deepEqual(parsed[2].items, ["animals", "colors"]);

assert.deepEqual(addForm.parseList("paper, tape, "), ["paper", "tape"]);
assert.deepEqual(addForm.toggleChoice(["paper"], "tape"), ["paper", "tape"]);
assert.deepEqual(addForm.toggleChoice(["paper", "tape"], "paper"), ["tape"]);
assert.equal(addForm.presetMatches(addForm.supplyPreset, "Paper"), true);

console.log("Logic checks passed");
