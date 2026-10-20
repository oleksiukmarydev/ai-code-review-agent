import { betaZodTool } from "@anthropic-ai/sdk/helpers/beta/zod";
import { z } from "zod";

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