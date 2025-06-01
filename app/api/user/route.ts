import connection from "@/db/db";
import NowDate from "@/app/Objects/Date";
import { NextResponse } from "next/server";

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