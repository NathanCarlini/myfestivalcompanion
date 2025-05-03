import connection from "@/db/db";
import { NextResponse } from "next/server";

export async function POST(Request : Request) {

    const {email, password } = await Request.json();

    //check existing
    var query = "SELECT * FROM Account WHERE ";
  
    query += `Email = "${email}" AND Password = "${password}" ;`;
    console.log(query)
    const resultBulkList = await connection.query(query);

    if(resultBulkList == null){
        return  NextResponse.json(false);
    }
    //  console.log(festivalBulkList.rows)
    return  NextResponse.json(true);
  }