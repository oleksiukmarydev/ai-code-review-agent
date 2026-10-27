import {betaZodTool} from "@anthropic-ai/sdk/helpers/beta/zod";
import {z} from "zod";
import {resolve, isAbsolute, relative, sep} from "node:path";
import {realpath} from "node:fs/promises";
import {readTextFile} from "../utils/read-text-file.js";

export interface SearchMatch {
  file: string;
  line: number;
  text: string;
}

export interface SearchResult {
  matches: SearchMatch[];
  truncated: boolean;
}

export function searchText(
  file: string,
  content: string,
  query: string,
  maxResults: number,
): SearchResult {
  const contentRows = content.split(/\r?\n/);
  const matches: SearchMatch[] = [];
  let isMaxResults = false;

  for (const [index, row] of contentRows.entries()) {
    if (row.includes(query)) {
      matches.push({
        file,
        line: index + 1,
        text: row,
      });
    }

    if(matches.length > maxResults) {
      isMaxResults = true;
      break;
    }

  }

  if(matches.length === 0) {
    return {
      matches: [],
      truncated: false,
    }
  }

  if(isMaxResults) {
    matches.splice(maxResults);
  }

  return {
    matches,
    truncated: isMaxResults,
  }
}

export async function searchFile(
  repoRoot: string,
  file: string,
  query: string,
  maxResults: number
): Promise<SearchResult> {
  if(isAbsolute(file)) {
    throw new Error("Absolute file paths are not supported");
  }

  const filePath = resolve(repoRoot, file);
  const relativePath = relative(repoRoot, filePath);
  if(relativePath.startsWith(".." + sep) || relativePath === ".." || isAbsolute(relativePath)) {
    throw new Error("File paths outside of the repository are not supported");
  }

  const realRepoRoot = await realpath(repoRoot);
  const realFilePath = await realpath(filePath);
  const realRelativePath = relative(realRepoRoot, realFilePath);
  if(realRelativePath.startsWith(".." + sep) || realRelativePath === ".." || isAbsolute(realRelativePath)) {
    throw new Error("File paths outside of the repository are not supported");
  }

  const fileContent = await readTextFile(realFilePath);
  return searchText(file, fileContent, query, maxResults);
}

export const searchCodeTool = betaZodTool({
  name: "search_code",
  description: "Search for literal text in repository files. " +
  "Use this to locate definitions, usages, and existing project patterns. " +
  "Returns matching file paths, line numbers, and code snippets. " +
  "Use get_file_content to read a full file",
  inputSchema: z.object({
    query: z.string()
      .trim()
      .min(1)
      .describe("Literal text to search for, not a regular expression"),
    path: z.string()
      .min(1)
      .optional()
      .describe(
        "File or directory relative to the repository root. " +
        "Omit to search the entire repository"
      ),

    maxResults: z.number()
      .int()
      .min(1)
      .max(100)
      .default(20)
      .describe("Maximum number of matching lines to return"),
  }),
  run: async (input) => {
    throw new Error("search_code not implemented yet");
  }
});