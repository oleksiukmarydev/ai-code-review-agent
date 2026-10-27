import { readFile } from "node:fs/promises";

export async function readTextFile(
  filePath: string
): Promise<string> {
  return await readFile(filePath, "utf-8");
}