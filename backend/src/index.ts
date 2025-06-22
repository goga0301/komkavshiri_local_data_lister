import express, { Request, Response } from "express";
import cors from "cors";
import { ILocalItem } from "./Types/ILocalItem";
import { v4 as uuidv4 } from "uuid";
import { readItems, writeItems } from "./utils/filestorage";


const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

app.get("/api/local-items", (_req: Request, res: Response) => {
  const items = readItems();
  res.json(items);
});

app.post("/api/local-items", (req: Request, res: Response) => {
  const item = req.body as ILocalItem;

  if (!item.name || !item.coordinates) {
    res.status(400).json({ error: "Name and coordinates required" });
  }

  const items = readItems();
  const newItem = { ...item, id: uuidv4() };
  items.push(newItem);
  writeItems(items);
  res.status(201).json(newItem);
});

// Health check
app.get("/health", (_req: Request, res: Response) => {
  res.send({ status: "Backend is healthy" });
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});

