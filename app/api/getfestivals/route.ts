import Festival from "@/app/Objects/Festival";
import connection from "@/db/db";
import { NextResponse } from "next/server";

export async function GET() {
  const query = "SELECT * FROM festival";

  const festivalBulkList = await connection.query(query);
  //  console.log(festivalBulkList.rows)
  return NextResponse.json(festivalBulkList.rows);
}

export async function POST(
  // argandvalues: Array<Object>
){
  // console.log(argandvalues)
  // let query = `SELECT * FROM festival WHERE `;
  // argandvalues != null ? argandvalues.forEach((element)  => {
  //     var cond = `${Object.keys(element)[0] = Object.values(element)[0]}`
  //     if (argandvalues.length > 1 && argandvalues.indexOf(element) < argandvalues.length - 1) {
  //       cond += ` AND `
  //   }
  //   query += cond + ` LIMIT 20 ;`
  // }) : query = `SELECT * FROM festival ;`;  
  // const festivalBulkMapInfos = await connection.query(query);
   
  // return  NextResponse.json(festivalBulkMapInfos.rows);
  return  NextResponse.json(success : true);

}
