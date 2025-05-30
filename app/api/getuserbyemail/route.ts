import connection from "@/db/db";
import { verifyGoogleToken } from "@/utils/googletokenverifier";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(Request: Request) {
  const { email } = await Request.json();

  const cookieStore = cookies();
  try {

    const query = `SELECT * FROM userinterne WHERE email = '${email}'`;

    const accountInformations = await connection.query(query);
    return NextResponse.json({success: true, data : accountInformations.rows})
  } catch(_e){
    return NextResponse.json({success: false, data : null})

  }
}
