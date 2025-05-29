import connection from "@/db/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const data = await req.json();

    if (!data || !data.cat) {
      return NextResponse.json(
        { message: "Catégorie manquante dans la requête" },
        { status: 400 }
      );
    }
    const category = data.cat;

    const query = `SELECT * FROM festivalgeo f 
    LEFT JOIN festivaltype ft 
    ON f.typefestival = ft.name 
    WHERE ${category} IS NOT NULL AND ft.image = '${category}'`;
    const festivalBulkList = await connection.query(query);

    festivalBulkList.rows = festivalBulkList.rows.filter(element => {
        return !(element[category] == null || element[category] == "" || element[category] == " ");
    });
    

    return NextResponse.json({
      message: "Festivals récupérés avec succès",
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
