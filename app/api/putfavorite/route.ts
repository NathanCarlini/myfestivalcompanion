import connection from "@/db/db";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  // try {
    const cookieStore = cookies();
    const tokenCookie = cookieStore.get("auth_token");
    if (!tokenCookie) {
      return NextResponse.json({ success: false, message: "No auth token" }, { status: 401 });
    }

    let decoded: any;
    try {
      decoded = jwt.verify(tokenCookie.value, process.env.SECRET_KEY as string);
    } catch (e) {
      return NextResponse.json({ success: false, message: "Invalid token" }, { status: 401 });
    }
    console.log("Decoded token:", decoded);
    const email = decoded.email;
    const { festivalId } = await req.json();

    // Récupérer l'id de l'utilisateur
    const userRes = await connection.query(`SELECT id FROM userinterne WHERE email = '${email}'`);
    if (userRes.rows.length == 0) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
    }
    const userId = userRes.rows[0].id;

    // Insérer dans userfestivallink
    console.log(`Inserting favorite for userId: ${userId}, festivalId: ${festivalId}`);
    await connection.query(
      `INSERT INTO userfestivallink (account_idaccount, festival_idfestival, timestampmodification, isfavorite) VALUES ('${userId}', '${festivalId}', NOW(), true) ON CONFLICT DO NOTHING`
    );

    return NextResponse.json({ success: true });

}