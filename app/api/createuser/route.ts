import connection from "@/db/db";
import { NextResponse } from "next/server";
import { log } from "node:console";
import jwt from "jsonwebtoken";
const bcrypt = require('bcrypt');

export async function POST(Request: Request) {
  const { name, email, password } = await Request.json();

  // ...validations...

  const saltRounds = 10;
  const hashPassword = async (password : string) => {
    try {
      const salt = await bcrypt.genSalt(saltRounds);
      const hashedPassword = await bcrypt.hash(password, salt);
      return hashedPassword;
    } catch (error) {
      throw error;
    }
  };

  const hashedPassword = await hashPassword(password);

  let query = "INSERT INTO userinterne (name, email, password, createddate, isenable) VALUES";
  query += `('${name}', '${email}', '${hashedPassword}', NOW(), true);`;
  await connection.query(query);

  const token = jwt.sign(
    {
      email: email,
      exp: Math.floor(Date.now() / 1000) + 2 * 60 * 60, // 2h
    },
    process.env.SECRET_KEY as string
  );

  const response = NextResponse.json({ success: true, token });
  response.cookies.set("auth_token", token, {
    httpOnly: true,
    sameSite: "lax",
    maxAge: 2 * 60 * 60, // 2h en secondes
    path: "/",
  });
  return response;
}