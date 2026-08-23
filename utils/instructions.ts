export type ParsedInstructionItem =
  | { type: "step"; text: string }
  | { type: "note"; text: string }
  | { type: "category"; title: string; items: string[] };

export function parseInstructionBlocks(blocks: string[]): ParsedInstructionItem[] {
  const lines = blocks
    .flatMap((block) => block.split("\n"))
    .map((line) => line.trim())
    .filter(Boolean);

  const items: ParsedInstructionItem[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const isNote = /^note[:\-]/i.test(line);
    const isOptional = /^optional[:\-]/i.test(line);
    const isCategory = /^category examples[:\-]?/i.test(line);

    if (isNote || isOptional) {
      items.push({
        type: "note",
        text: line.replace(/^(note|optional)[:\-]\s*/i, ""),
      });
      continue;
    }

    if (isCategory) {
      const title =
        line.replace(/^category examples[:\-]?\s*/i, "").trim() ||
        "Need help coming up with categories for your game? Below are some examples you can reference:";
      const categoryItems: string[] = [];
      let j = i + 1;

      while (j < lines.length) {
        const peek = lines[j];
        const startsNewBlock =
          /^\d+[\.\)]/.test(peek) ||
          /^\d+\s*[-\u2013]/.test(peek) ||
          /^(note|optional)[:\-]/i.test(peek) ||
          /^category examples[:\-]?/i.test(peek);

        if (startsNewBlock) break;
        categoryItems.push(peek.replace(/^[\-\u2022]\s*/, ""));
        j++;
      }

      items.push({ type: "category", title, items: categoryItems });
      i = j - 1;
      continue;
    }

    const cleaned = line
      .replace(/^\(?\s*\d+\s*[\.\)]\s*/, "")
      .replace(/^\d+\s*[-\u2013]\s*/, "");
    items.push({ type: "step", text: cleaned });
  }

  return items;
}
