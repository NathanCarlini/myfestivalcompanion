import Festival from "@/app/Objects/Festival";
import connection from "@/db/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const data = await req.json(); // On récupère le corps de la requête en JSON
    console.log(data); // Affiche le contenu de la requête

    // Exemple d'accès à la donnée "cat"
    const category = data.cat;

    const query = `SELECT * FROM festivalgeo f 
    LEFT JOIN festivaltype ft 
    ON f.typefestival = ft.name 
    WHERE ${category} IS NOT NULL AND ft.image = '${category}'`;
    const festivalBulkList = await connection.query(query);

    festivalBulkList.rows = festivalBulkList.rows.filter(element => {
        return !(element[category] == null || element[category] == "" || element[category] == " ");
    });
    

    // Renvoyer une réponse appropriée
    return NextResponse.json({
      message: "Données reçues avec succès",
      data: festivalBulkList.rows,
    });
  } catch (error) {
    console.error("Erreur de traitement de la requête:", error);
    return NextResponse.json(
      { message: "Erreur lors du traitement" },
      { status: 500 }
    );
  }
}
