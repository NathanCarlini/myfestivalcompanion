import connection from "@/db/db";
import NowDate from "@/app/Objects/Date";
import { NextResponse } from "next/server";

export async function createUser(name: string, email: string, password: string, imageprofil: string) {
  const verif = `select * from account where email = '${email}'`
  const verifEmail = await connection.query(verif);
  if (verifEmail.rows.length > 0) {
    return "Email already used";
  } else {
    const query = `INSERT INTO account (name, email, password, imageprofil, timestamp, creationDate) VALUES ('${name}', '${email}', '${password}', '${imageprofil}', ${Date.now()}, ${new NowDate().fulldate});`;
    await connection.query(query);
    return true;
  }
}

// Handler pour GET ou POST selon besoin
export async function POST(request: Request) {
  try {
    const { email } = await request.json();
    const query = `SELECT * FROM account WHERE email = '${email}';`;
    const result = await connection.query(query);
    if (result.rows.length === 0) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, user: result.rows[0] });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Error fetching user" }, { status: 500 });
  }
}