import connection from "@/db/db";
import { NextResponse } from "next/server";
import { log } from "node:console";
import jwt from "jsonwebtoken";
const bcrypt = require('bcrypt');

export async function POST(Request: Request) {
  const { name, email, password } = await Request.json();

   const validateEmail = (email: string) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };
  if (!validateEmail(email)) {
    log("Email invalide");
    return NextResponse.json(
      { success: false, message: "Email invalide" },
      { status: 400 }
    );
  }

  const validatename = (name: string) => {
    return String(name)
      .toLowerCase()
      .match(
        /^[0-9A-Za-z]{6,16}$/
      );
  };
  if (!validatename(name)) {
    log("Username invalide");
    return NextResponse.json(
      { success: false, message: "Username invalide" },
      { status: 400 }
    );
  }
  
  const validatepassword = (password: string) => {
    if( String(password)
      .match(
        /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/
      )) {
      return true;
      }else {
        return false;
      }
  };
  if (!validatepassword(password)) {
    log("mot de passe invalide");
    return NextResponse.json(
      { success: false, message: "mot de passe invalide" },
      { status: 400 }
    );
  }


  const saltRounds = 10;

    const hashPassword = async (password : string) => {
  try {
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);
    console.log('Mot de passe haché :', hashedPassword);
    return hashedPassword;
  } catch (error) {
    console.error('Erreur lors du hachage du mot de passe :', error);
    throw error;
  }
};


  const FinalHashedPassword = await hashPassword(password);

  let query = "INSERT INTO userinterne (name, email, password, createddate, isenable) VALUES";
  query += `('${name}', '${email}', '${FinalHashedPassword}', NOW(), true);`;
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