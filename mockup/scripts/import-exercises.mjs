/**
 * Importa la biblioteca de ejercicios desde la API pública de wger
 * (https://wger.de/api/v2) y genera src/data/exercises.ts, además de
 * descargar las imágenes a public/exercises/.
 *
 * Uso:  node scripts/import-exercises.mjs
 *
 * La importación es idempotente por el identificador externo de wger: el
 * fichero generado se sobrescribe por completo y las imágenes ya descargadas
 * no se vuelven a pedir.
 */
import { existsSync } from "node:fs";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const API = "https://wger.de/api/v2";
const PAGE_SIZE = 100;
const OUT_TS = "src/data/exercises.ts";
const IMG_DIR = "public/exercises";

const USER_AGENT = "STADIO-TFG/1.0 (importación de biblioteca de ejercicios)";

/** Mapa de músculo (nombre inglés de wger) → grupo muscular de STADIO. */
const MUSCLE_EN = {
  Chest: "Pecho",
  Triceps: "Tríceps",
  Biceps: "Bíceps",
  Brachialis: "Bíceps",
  Lats: "Espalda",
  Trapezius: "Espalda",
  "Serratus anterior": "Espalda",
  Shoulders: "Hombro",
  Quads: "Pierna",
  Hamstrings: "Pierna",
  Glutes: "Pierna",
  Calves: "Pierna",
  Abs: "Core",
};

/** Mapa de músculo (nombre latino de wger) → grupo muscular de STADIO. */
const MUSCLE_LATIN = {
  "Pectoralis major": "Pecho",
  "Biceps brachii": "Bíceps",
  Brachialis: "Bíceps",
  "Triceps brachii": "Tríceps",
  "Latissimus dorsi": "Espalda",
  Trapezius: "Espalda",
  "Serratus anterior": "Espalda",
  "Anterior deltoid": "Hombro",
  "Quadriceps femoris": "Pierna",
  "Biceps femoris": "Pierna",
  "Gluteus maximus": "Pierna",
  Gastrocnemius: "Pierna",
  Soleus: "Pierna",
  "Rectus abdominis": "Core",
  "Obliquus externus abdominis": "Core",
};

/** Mapa de categoría (nombre de wger) → grupo muscular de STADIO (respaldo). */
const CATEGORY = {
  Chest: "Pecho",
  Arms: "Bíceps",
  Back: "Espalda",
  Legs: "Pierna",
  Shoulders: "Hombro",
  Abs: "Core",
  Calves: "Pierna",
};

function stripHtml(html) {
  if (!html) return "";
  return html
    .replace(/<\s*br\s*\/?\s*>/gi, "\n")
    .replace(/<\s*li\s*>/gi, "• ")
    .replace(/<\s*\/\s*(p|div|li|ul|ol|h[1-6]|tr)\s*>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#0?39;/g, "'")
    .replace(/&#x([0-9a-f]+);/gi, (_, hex) => String.fromCodePoint(parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, dec) => String.fromCodePoint(Number(dec)))
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .split("\n")
    .map((line) => line.trim())
    .join("\n")
    .trim();
}

/** Resumen corto a partir del texto completo, respetando la primera frase. */
function summarize(text, max = 170) {
  if (!text) return "";
  const clean = text.replace(/\s+/g, " ").trim();
  const dot = clean.search(/[.!?](\s|$)/);
  let out = dot > 0 && dot < max ? clean.slice(0, dot + 1) : clean.slice(0, max);
  if (out.length < clean.length) out = `${out.replace(/\s+\S*$/, "")}…`;
  return out;
}

function pickTranslation(exercise) {
  const translations = exercise.translations ?? [];
  return (
    translations.find((t) => t.language === 4) ??
    translations.find((t) => t.language === 2) ??
    null
  );
}

function mapMuscle(exercise) {
  const primary = exercise.muscles?.[0];
  if (primary) {
    if (primary.name_en && MUSCLE_EN[primary.name_en]) return MUSCLE_EN[primary.name_en];
    if (primary.name && MUSCLE_LATIN[primary.name]) return MUSCLE_LATIN[primary.name];
  }
  const fallback = exercise.muscles?.[0]?.name_en ?? exercise.category?.name;
  if (fallback && MUSCLE_EN[fallback]) return MUSCLE_EN[fallback];
  if (fallback && CATEGORY[fallback]) return CATEGORY[fallback];
  return "Otros";
}

async function fetchAll() {
  const all = [];
  let url = `${API}/exerciseinfo/?limit=${PAGE_SIZE}&offset=0`;
  while (url) {
    const res = await fetch(url, { headers: { "User-Agent": USER_AGENT } });
    if (!res.ok) throw new Error(`La API respondió ${res.status} en ${url}`);
    const data = await res.json();
    all.push(...data.results);
    process.stdout.write(`\rDescargados ${all.length}/${data.count} ejercicios...`);
    url = data.next;
  }
  process.stdout.write("\n");
  return all;
}

async function downloadImage(exercise, externalId) {
  const images = exercise.images ?? [];
  const main = images.find((img) => img.is_main) ?? images[0];
  if (!main) return "";
  const url = main.thumbnails?.medium ?? main.thumbnails?.small ?? main.image;
  const ext = path.extname(new URL(url).pathname) || ".png";
  const filename = `${externalId}${ext}`;
  const dest = path.join(IMG_DIR, filename);
  try {
    if (!existsSync(dest)) {
      const res = await fetch(url, { headers: { "User-Agent": USER_AGENT } });
      if (!res.ok) return "";
      await writeFile(dest, Buffer.from(await res.arrayBuffer()));
    }
    return `/exercises/${filename}`;
  } catch {
    return "";
  }
}

/** Ejecuta `fn` sobre cada elemento con un límite de concurrencia. */
async function pool(items, limit, fn) {
  const results = new Array(items.length);
  let cursor = 0;
  const workers = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (cursor < items.length) {
      const index = cursor++;
      results[index] = await fn(items[index], index);
    }
  });
  await Promise.all(workers);
  return results;
}

async function main() {
  await mkdir(IMG_DIR, { recursive: true });

  const raw = await fetchAll();

  const usable = raw
    .map((exercise) => ({ exercise, translation: pickTranslation(exercise) }))
    .filter(({ translation }) => translation?.name);

  process.stdout.write(`Descargando imágenes de ${usable.length} ejercicios...\n`);

  const records = await pool(usable, 8, async ({ exercise, translation }) => {
    const externalId = String(exercise.id);
    const instructions = stripHtml(translation.description);
    const image = await downloadImage(exercise, externalId);
    const equipment = (exercise.equipment ?? []).map((e) => e.name).join(", ");
    return {
      id: `w${externalId}`,
      name: translation.name.trim(),
      muscle: mapMuscle(exercise),
      description: summarize(instructions),
      instructions,
      equipment,
      image,
      externalId,
    };
  });

  records.sort(
    (a, b) => a.muscle.localeCompare(b.muscle, "es") || a.name.localeCompare(b.name, "es")
  );

  const banner =
    "/**\n" +
    " * Biblioteca de ejercicios importada de la API de wger (https://wger.de/api/v2).\n" +
    " * Fichero generado automáticamente por scripts/import-exercises.mjs. No editar a mano.\n" +
    " */\n";
  const body = records
    .map((r) => `  ${JSON.stringify(r)},`)
    .join("\n");
  const file =
    `${banner}import type { Exercise } from "../types";\n\n` +
    `export const exercises: Exercise[] = [\n${body}\n];\n`;

  await writeFile(OUT_TS, file, "utf8");

  const withImage = records.filter((r) => r.image).length;
  process.stdout.write(
    `\nListo: ${records.length} ejercicios escritos en ${OUT_TS} ` +
      `(${withImage} con imagen en ${IMG_DIR}).\n`
  );
}

main().catch((error) => {
  console.error("\nError en la importación:", error.message);
  process.exitCode = 1;
});
