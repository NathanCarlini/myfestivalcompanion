import connection from "@/db/db";
import { NextResponse } from "next/server";
import { log } from "node:console";

export async function POST(Request: Request) {
    const { name, email, password } = await Request.json();

    var query = "INSERT INTO userinterne (name, email, password, createddate, isactive) VALUES";
  
    query += `("${name}", "${email}", "${password}", NOW(), true);`;
    console.log(query)
     await connection.query(query);
    //  console.log(festivalBulkList.rows)
    return  NextResponse.json(true);
  }