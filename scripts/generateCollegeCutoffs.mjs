import { readFile, writeFile } from "node:fs/promises";
import { PDFParse } from "pdf-parse";

const INPUT_PATH = "cutoff/last_rank_engg_p2_final.pdf";
const OUTPUT_PATH = "src/data/collegeCutoffs.js";

const TYPE_MAP = {
  G: "Government",
  N: "Govt. Controlled",
  S: "Self Financing"
};

const FOOTER_TOKENS = [
  "OFFICE OF THE COMMISSIONER FOR ENTRANCE EXAMINATIONS",
  "KEAM 2025 - Admission to Engineering Courses",
  "LAST RANK TABLE",
  "COMMISSIONER FOR ENTRANCE EXAMINATIONS"
];

const collapse = (value) => value.replace(/\s+/g, " ").trim();

const normalizeCollegeName = (value) =>
  collapse(value)
    .replace(/,\s*/g, ", ")
    .replace(/\s+\./g, ".")
    .replace(/\s{2,}/g, " ");

const isBranchRow = (row) => {
  const cells = row.map((cell) => collapse(String(cell ?? "")));
  const first = cells[0] ?? "";
  const remaining = cells.slice(1).every((cell) => cell === "");
  return (
    first !== "" &&
    remaining &&
    !first.includes("Name of College") &&
    !first.startsWith("-- ") &&
    !FOOTER_TOKENS.some((token) => first.includes(token))
  );
};

const isHeaderRow = (row) => row.some((cell) => collapse(String(cell ?? "")) === "Name of College");

const isNumericRank = (value) => /^\d+$/.test(value);

const getTypeIndex = (cells) => {
  for (let index = 0; index < cells.length; index += 1) {
    if (TYPE_MAP[cells[index]] && (isNumericRank(cells[index + 1] ?? "") || cells[index + 1] === "-")) {
      return index;
    }
  }
  return -1;
};

const parseCollegeCells = (leadingCells) => {
  if (leadingCells.length === 0) {
    return { code: "", college: "" };
  }

  if (leadingCells.length >= 2 && /^[A-Z]{2,4}$/.test(leadingCells[0])) {
    return {
      code: leadingCells[0],
      college: collapse(leadingCells.slice(1).join(" "))
    };
  }

  const combined = collapse(leadingCells.join(" "));
  const match = combined.match(/^([A-Z]{2,4})\s+(.+)$/);
  if (match) {
    return { code: match[1], college: match[2] };
  }

  return { code: "", college: combined };
};

const getLocation = (college) => {
  const cleaned = college.replace(/\.$/, "");
  const parts = cleaned
    .split(",")
    .map((part) => collapse(part))
    .filter(Boolean);

  return parts.length > 1 ? parts[parts.length - 1] : "";
};

const normalizeBranch = (branch) =>
  branch
    .replace(/^B\.Tech\.\s*/i, "")
    .replace(/^\((.+)\)$/, "$1")
    .replace(/\s+/g, " ")
    .trim();

const toJsModule = (items) => {
  const body = JSON.stringify(items, null, 2).replace(/"([^"]+)":/g, "$1:");
  return `export const collegeCutoffs = ${body};\n`;
};

const buffer = await readFile(INPUT_PATH);
const parser = new PDFParse({ data: buffer });
const tableResult = await parser.getTable();
await parser.destroy();

const cutoffs = [];
let currentBranch = "";

for (const page of tableResult.pages ?? []) {
  for (const table of page.tables ?? []) {
    for (const rawRow of table) {
      const cells = rawRow.map((cell) => collapse(String(cell ?? "")));
      if (cells.every((cell) => cell === "")) {
        continue;
      }

      if (isHeaderRow(cells)) {
        continue;
      }

      if (isBranchRow(cells)) {
        currentBranch = normalizeBranch(cells[0]);
        continue;
      }

      if (
        cells[0].startsWith("-- ") ||
        FOOTER_TOKENS.some((token) => cells.some((cell) => cell.includes(token)))
      ) {
        continue;
      }

      const typeIndex = getTypeIndex(cells);
      if (typeIndex === -1 || currentBranch === "") {
        continue;
      }

      const leadingCells = cells.slice(0, typeIndex).filter(Boolean);
      const { code, college } = parseCollegeCells(leadingCells);
      const normalizedCollege = normalizeCollegeName(college);
      const typeCode = cells[typeIndex];
      const smValue = cells[typeIndex + 1] ?? "";

      if (!normalizedCollege || !TYPE_MAP[typeCode] || !isNumericRank(smValue)) {
        continue;
      }

      cutoffs.push({
        code,
        college: normalizedCollege,
        location: getLocation(normalizedCollege),
        branch: currentBranch,
        closingRank: Number(smValue),
        type: TYPE_MAP[typeCode],
        sourceCategory: "SM",
        sourceYear: 2025,
        sourceRound: "Second Phase"
      });
    }
  }
}

const uniqueCutoffs = Array.from(
  new Map(
    cutoffs.map((item) => [
      `${item.branch}__${item.code}__${item.college}__${item.closingRank}`,
      item
    ])
  ).values()
).sort((left, right) => left.closingRank - right.closingRank || left.college.localeCompare(right.college));

await writeFile(OUTPUT_PATH, toJsModule(uniqueCutoffs), "utf8");

console.log(`Generated ${uniqueCutoffs.length} college cutoff rows from ${INPUT_PATH}`);
