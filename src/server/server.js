import express from "express";
import { BannerController } from "./controllers/BannerController.js";
import path from "path";

const app = express();
const PORT = 3000;

// API Routes
app.get("/download-banner", BannerController.download);

// Static files
app.use(express.static(path.join(process.cwd(), "src/public")));

app.listen(PORT, () => {
 console.log(`Server running at http://localhost:${PORT}`);
});
