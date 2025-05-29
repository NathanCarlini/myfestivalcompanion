import Festival from "@/app/Objects/Festival";
import connection from "@/db/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const data = await req.json(); 
    if (!data || !data.id) {
      return NextResponse.json(
        { message: "Identifiant manquant dans la requête" },
        { status: 400 }
      );
    }
    const identifiant = data.id;

    const query = `SELECT * FROM festivalgeo WHERE identifiant = '${identifiant}'`;
    const festivalBulkList = await connection.query(query);
    
    return NextResponse.json({
      message: "Données reçues avec succès",
      data: festivalBulkList.rows[0],
    });
  } catch (error) {
    console.error("Erreur de traitement de la requête:", error);
    return NextResponse.json(
      { message: "Erreur lors du traitement" },
      { status: 500 }
    );
  }
}
