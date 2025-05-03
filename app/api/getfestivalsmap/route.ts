import Festival from "@/app/Objects/Festival";
import connection from "@/db/db";
import { NextResponse } from "next/server";

export async function GET() {
    const query = "SELECT * FROM festivalgeo LIMIT 100";
  
    const festivalBulkList = await connection.query(query);
    //  console.log(festivalBulkList.rows)
    return NextResponse.json(festivalBulkList.rows);
  }