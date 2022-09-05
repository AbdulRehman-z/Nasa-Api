import express from "express";
import cors from "cors";
import { api } from "./routes/api.js";
import path, { dirname } from "path";
import { fileURLToPath } from "url";

export const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// app.use(
//   cors({
//     origin: "http://localhost:3000",
//   })
// );

app.use(express.json());

app.use(express.static(path.join(__dirname, "..", "public")));
app.use("/v1", api);
app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "public", "index.html"));
});
