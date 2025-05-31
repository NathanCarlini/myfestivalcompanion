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
  try {
  const { query } = await req.json();

  
  if (!query || typeof query !== "string") {
    return NextResponse.json({ success: true, results: [] });
  }
  const qNorm = normalize(query);

  const likePattern = `%${query}%`;
  const sql = `
    SELECT *
    FROM festivalgeo
    WHERE
        regexp_replace(unaccent(LOWER(festivalgeo.﻿nomfestival)), '[^a-z0-9]', '', 'g')
        LIKE '%' || format_search_string('%${query}%') || '%'
    LIMIT 20;
    `;

  const res = await connection.query(sql);
  console.log(
    `Résultats de la recherche : ${res.rows.length} festivals trouvés`
  );
  
  return NextResponse.json({ success: true, results: res.rows });
  } catch (e) {
    return NextResponse.json({ success: false, results: [] }, { status: 500 });
  }
}
