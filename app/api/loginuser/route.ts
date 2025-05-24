import connection from "@/db/db";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
require('dotenv').config();

export async function POST(Request: Request) {
  const { email, password } = await Request.json();

  // Vérification de l'utilisateur existant
  var query = "SELECT * FROM userinterne WHERE ";
  query += `Email = '${email}' AND Password = '${password}' ;`;
  console.log(query);
  const resultBulkList = await connection.query(query);

  if (resultBulkList == null || resultBulkList.rows.length === 0) {
    return NextResponse.json({ success: false, message: "Invalid credentials" });
  }

  // Génération du JWT
  const token = jwt.sign(
    {
      email: email,
      exp: Math.floor(Date.now() / 1000) + 2 * 60 * 60, // Expiration dans 2 heures
    },
    process.env.SECRET_KEY as string // || (() => { throw new Error("SECRET_KEY is not defined in environment variables"); })()
  );
  // localStorage.setItem("token", token);  
  return NextResponse.json({ success: true, token });
}