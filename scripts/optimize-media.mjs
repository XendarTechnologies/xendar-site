import path from "node:path";
import { fileURLToPath } from "node:url";
import fs from "node:fs/promises";
import sharp from "sharp";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, "..");
const publicDir = path.join(root, "public");
const outDir = path.join(publicDir, "optimized");

const jobs = [
  {
    input: "Background1.png",
    outputs: [
      { name: "Background1.webp", width: 1536, format: "webp", quality: 70 },
      { name: "Background1-mobile.webp", width: 900, format: "webp", quality: 66 },
    ],
  },
  {
    input: "Background2.png",
    outputs: [
      { name: "Background2.webp", width: 1536, format: "webp", quality: 70 },
      { name: "Background2-mobile.webp", width: 900, format: "webp", quality: 66 },
    ],
  },
  {
    input: "mapa-nocturno.png",
    outputs: [
      { name: "mapa-nocturno.webp", width: 1024, format: "webp", quality: 70 },
      { name: "mapa-nocturno-768.webp", width: 768, format: "webp", quality: 68 },
      { name: "mapa-nocturno.avif", width: 1024, format: "avif", quality: 48 },
      { name: "mapa-nocturno-768.avif", width: 768, format: "avif", quality: 46 },
    ],
  },
];

await fs.mkdir(outDir, { recursive: true });

for (const job of jobs) {
  const inputPath = path.join(publicDir, job.input);
  for (const output of job.outputs) {
    const outputPath = path.join(outDir, output.name);
    let t = sharp(inputPath).resize({ width: output.width, withoutEnlargement: true });
    if (output.format === "avif") {
      t = t.avif({ quality: output.quality, effort: 6 });
    } else {
      t = t.webp({ quality: output.quality });
    }
    await t.toFile(outputPath);
  }
}

console.log("optimized assets generated in public/optimized");
