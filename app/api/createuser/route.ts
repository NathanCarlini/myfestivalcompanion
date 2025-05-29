import connection from "@/db/db";
import { NextResponse } from "next/server";
import { log } from "node:console";
import jwt from "jsonwebtoken";

export async function POST(Request: Request) {
  const { name, email, password } = await Request.json();

  var query =
    "INSERT INTO userinterne (name, email, password, createddate, isenable) VALUES";

  const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };
  if (!validateEmail(email)) {
    return NextResponse.json(
      { success: false, message: "Email invalide" },
      { status: 400 }
    );
  }

  const validatename = (name) => {
    return String(name)
      .toLowerCase()
      .match(
        /^[0-9A-Za-z]{6,16}$/
      );
  };
  if (!validatename(name)) {
    return NextResponse.json(
      { success: false, message: "Username invalide" },
      { status: 400 }
    );
  }
  const validatepasswowrd = (passwowrd) => {
    return String(passwowrd)
      .toLowerCase()
      .match(
        /^(?=.*?[0-9])(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[^0-9A-Za-z]).{8,32}$/
      );
  };
  if (!validatepasswowrd(passwowrd)) {
    return NextResponse.json(
      { success: false, message: "mot de passe invalide" },
      { status: 400 }
    );
  }


  

  query += `('${name}', '${email}', '${password}', NOW(), true);`;
  console.log(query);
  await connection.query(query);
  //  console.log(festivalBulkList.rows)
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
