import { test } from "node:test";
import assert from "node:assert/strict";
import {searchFile, searchText} from "./search-code.js";
import {mkdtemp, rm, symlink, mkdir, writeFile} from "node:fs/promises";
import {tmpdir} from "node:os";
import {join} from "node:path";

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

test("searchFile rejects symlinks outside the repository", async() => {
  const tempRoot = await mkdtemp(join(tmpdir(), "cora-test"));

  try {
    const repoRoot = join(tempRoot, "repo");
    const outsideFile = join(tempRoot, "outside.txt");

    await mkdir(repoRoot);
    await writeFile(outsideFile, "needle", "utf8");
    await symlink(outsideFile, join(repoRoot, "outside.txt"));

    await assert.rejects(
      () => searchFile(repoRoot, "outside.txt", "needle", 2),
      {
        message: "File paths outside of the repository are not supported",
      },
    );
  } finally {
    await rm(tempRoot, { recursive: true })
  }
})
