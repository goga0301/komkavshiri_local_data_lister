// filestorage.ts

// Importing built-in modules for file system operations and file paths
import fs from "fs";
import path from "path";

// Importing the ILocalItem interface to ensure type safety when reading/writing data
import { ILocalItem } from "../Types/ILocalItem";

// Define the path to the JSON file where local items are stored
const filePath = path.join(__dirname, "../Data/localItems.json");

/**
 * Reads and parses local items from the JSON file.
 * 
 * @returns An array of ILocalItem objects. If an error occurs, returns an empty array.
 */
export function readItems(): ILocalItem[] {
  try {
    // Read the contents of the file synchronously as UTF-8 encoded text
    const data = fs.readFileSync(filePath, "utf-8");

    // Parse the JSON string into an array of objects and return it
    return JSON.parse(data);
  } catch (err) {
    // If reading or parsing fails, log the error and return an empty list
    console.error("Error reading localItems.json:", err);
    return [];
  }
}

/**
 * Writes the given array of local items to the JSON file.
 * 
 * @param items - An array of ILocalItem objects to save.
 */
export function writeItems(items: ILocalItem[]): void {
  try {
    // Convert the array of items into a formatted JSON string and write it to the file
    fs.writeFileSync(filePath, JSON.stringify(items, null, 2));
  } catch (err) {
    // If writing fails, log the error
    console.error("Error writing to localItems.json:", err);
  }
}
