import connection from "@/db/db";
import { NextResponse } from "next/server";

// Fonction de normalisation JS, à répliquer en SQL pour la requête
function normalize(str: string) {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // accents
    .replace(/[^a-z0-9]/g, ""); // remove non-alphanum
}

export async function POST(req: Request) {
  // try {
  const { query } = await req.json();
  console.log(`Recherche festival avec la requête : ${query}`);

  if (!query || typeof query !== "string") {
    return NextResponse.json({ success: true, results: [] });
  }
  // Normalise la string côté JS pour la requête SQL
  const qNorm = normalize(query);
  console.log(`Recherche festival avec la requête normalisée : ${query}`);
  // Utilise une expression SQL pour normaliser le nom du festival côté base
  const likePattern = `%${query}%`;
  const sql = `
    SELECT *
    FROM festivalgeo
    WHERE
        regexp_replace(unaccent(LOWER(festivalgeo.﻿nomfestival)), '[^a-z0-9]', '', 'g')
        LIKE '%' || format_search_string('%${query}%') || '%'
    LIMIT 20;
    `;
  // Ajoute les wildcards pour le LIKE
  console.log(`Exécution de la requête SQL : ${sql}`);
  const res = await connection.query(sql);
  console.log(
    `Résultats de la recherche : ${res.rows.length} festivals trouvés`
  );
  return NextResponse.json({ success: true, results: res.rows });
  // } catch (e) {
  //   return NextResponse.json({ success: false, results: [] }, { status: 500 });
  // }
}
