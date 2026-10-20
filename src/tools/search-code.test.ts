import { test } from "node:test";
import assert from "node:assert/strict";
import { searchText } from "./search-code.js";

test("searchText limits matches and reports truncation", () => {
  const actual = searchText(
    "example.ts",
    "needle\nskip\nneedle\nneedle",
    "needle",
    2,
  );

  const expected = {
    matches: [
      { file: "example.ts", line: 1, text: "needle" },
      { file: "example.ts", line: 3, text: "needle" },
    ],
    truncated: true,
  };

  assert.deepEqual(actual, expected);
});
