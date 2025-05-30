import connection from "@/db/db";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function GET() {
  try {
    // Récupérer le cookie JWT
    const cookieStore = cookies();
    const tokenCookie = cookieStore.get("auth_token");
    if (!tokenCookie) {
      return NextResponse.json({ success: false, message: "No auth token" }, { status: 401 });
    }

    // Décoder le JWT pour obtenir l'email
    let decoded: any;
    try {
      decoded = jwt.verify(tokenCookie.value, process.env.SECRET_KEY as string);
    } catch (e) {
      return NextResponse.json({ success: false, message: "Invalid token" }, { status: 401 });
    }

    const email = decoded.email;

    // Récupérer l'id utilisateur
    const userRes = await connection.query(
      `SELECT id FROM userinterne WHERE email = '${email}'`,
    );
    if (!userRes.rows.length) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
    }
    const userId = userRes.rows[0].idaccount;

    // Récupérer les ids de festivals favoris
    const favRes = await connection.query(
      `SELECT festival_idfestival FROM userfestivallink WHERE account_idaccount = $1`,
      [userId]
    );
    const festivalIds = favRes.rows.map(row => row.festival_idfestival);

    // Pour chaque id, récupérer les infos du festival
    const festivals = [];
    for (const id of festivalIds) {
      const festRes = await connection.query(
        `SELECT * FROM festivalgeo WHERE festivallist_id = $1`,
        [id]
      );
      if (festRes.rows.length) {
        festivals.push(festRes.rows[0]);
      }
    }

    return NextResponse.json({ success: true, festivals });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Erreur lors du traitement" }, { status: 500 });
  }
}