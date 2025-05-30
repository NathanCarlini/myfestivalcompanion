import connection from "@/db/db";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { log } from "console";
const bcrypt = require("bcrypt");

const verifyPassword = async (plainPassword: string, hashedPassword: string) => {
  return await bcrypt.compare(plainPassword, hashedPassword);
};

export async function POST(Request: Request) {
  const { email, password } = await Request.json();

  var query = "SELECT * FROM userinterne WHERE LOWER(Email) = LOWER('" + email + "');";
  const resultBulkList = await connection.query(query);
  log("Query executed:", resultBulkList.rows);
  if (!resultBulkList || resultBulkList.rows.length === 0) {
    return NextResponse.json({
      success: false,
      message: "Invalid email",
    });
  }

  const user = resultBulkList.rows[0];
  log("User found:", user);
  const passwordOk = await verifyPassword(password, user.password);
  if (!passwordOk) {
    return NextResponse.json({
      success: false,
      message: "Invalid password",
    });
  }

  const token = jwt.sign(
    {
      email: email,
      exp: Math.floor(Date.now() / 1000) + 2 * 60 * 60 * 60,
    },
    process.env.SECRET_KEY as string
  );

  const response = NextResponse.json({ success: true, token });
  response.cookies.set("auth_token", token, {
    httpOnly: true,
    sameSite: "lax",
    maxAge: 2 * 60 * 60 * 60,
    path: "/",
  });
  return response;
}