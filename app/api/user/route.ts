import connection from "@/db/db";
import NowDate from "@/app/Objects/Date";
import { cookies } from "next/headers";

export async function createUser(name: string, email: string, password: string, imageprofil: string) {
    
    const verif = `select * from account where email = '${email}'`
    const verifEmail = await connection.query(verif);
    if(verifEmail.rows.length > 0){
        return "Email already used"
    }else{
        const query = `INSERT INTO account (name, email, password, imageprofil, timestamp, creationDate) VALUES ('${name}', '${email}', '${password}', '${imageprofil}', ${Date.now()}, ${new NowDate().fulldate });`;
        const festivalBulkList = await connection.query(query);
        return true;
    }
  //  console.log(festivalBulkList.rows)
}
export async function POST() {
    
    const cookieStore = await cookies();
    const verif =  cookieStore.get('isUserLoggedIn');

        const query = `Select * from account where email = '${email}';`;
        const festivalBulkList = await connection.query(query);
        return festivalBulkList.rows[0];
    
  //  console.log(festivalBulkList.rows)
}