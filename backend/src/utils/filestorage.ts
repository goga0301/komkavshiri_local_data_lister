import fs from "fs";
import path from "path";
import { ILocalItem } from "../Types/ILocalItem";

const filePath = path.join(__dirname, "../Data/localItems.json");

export function readItems(): ILocalItem[] {
  try {
    const data = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(data);
  } catch (err) {
    console.error("Error reading localItems.json:", err);
    return [];
  }
}

export function writeItems(items: ILocalItem[]): void {
  try {
    fs.writeFileSync(filePath, JSON.stringify(items, null, 2));
  } catch (err) {
    console.error("Error writing to localItems.json:", err);
  }
}
