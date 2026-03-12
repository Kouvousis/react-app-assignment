import express from "express";
import cors from "cors";
import autocompleteRouter from "./src/routes/autocomplete.js";
import adsRouter from "./src/routes/ads.js";
import { initDb } from "./src/database.js";

const app = express();
const PORT = 3000;

// Allow CORS for frontend running on http://localhost:5173
app.use(
  cors({
    origin: "http://localhost:5173",
  }),
);

app.use(express.json());

app.use("/api", autocompleteRouter);
app.use("/api", adsRouter);

app.listen(PORT, () => {
  initDb();
  console.log(`Server running on http://localhost:${PORT}`);
});
