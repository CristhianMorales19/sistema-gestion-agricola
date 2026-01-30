import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";

const prisma = new PrismaClient();

async function main() {
  const filePath = path.join(__dirname, "../../prisma/init.sql");
  const sql = fs.readFileSync(filePath, "utf8");

  console.log("Ejecutando script SQL...");

  // Limpiar comentarios y dividir por ;
  const statements = sql
    .replace(/--.*$/gm, "") // elimina comentarios --
    .split(";")
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  for (const statement of statements) {
    console.log("➡ Ejecutando:", statement.substring(0, 60) + "...");
    await prisma.$executeRawUnsafe(statement);
  }

  console.log("Script ejecutado correctamente ✅");
}

main()
  .catch((e) => {
    console.error("❌ Error ejecutando script:", e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
