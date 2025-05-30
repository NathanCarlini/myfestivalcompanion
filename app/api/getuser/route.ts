import connection from "@/db/db";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function GET() {
  const cookieStore = cookies();
  const tokenCookie = cookieStore.get("auth_token");
  if (!tokenCookie) {
    return NextResponse.json({ success: false, message: "No auth token" }, { status: 401 });
  }

  let decoded: any;
  try {
    decoded = jwt.verify(tokenCookie.value, process.env.SECRET_KEY as string);
  } catch (e) {
    // Supprime le cookie s'il est invalide ou expiré
    const response = NextResponse.json({ success: false, message: "Invalid or expired token" }, { status: 401 });
    response.cookies.set("auth_token", "", { maxAge: 0, path: "/" });
    return response;
  }
  const email = decoded.email;
  const query = `SELECT * FROM userinterne WHERE email = '${email}'`;
  const accountInformations = await connection.query(query);

  if (!accountInformations.rows.length) {
    return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true, user: accountInformations.rows[0] });
}