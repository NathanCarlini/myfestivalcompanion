
import { cookies } from "next/headers";

export async function getConnectionCookie(){
    const cookieStore = await cookies();
    const isUserLoggedInCookie = cookieStore.get('isUserLoggedIn');
    if(isUserLoggedInCookie != null) {
        return cookies();
    }else{
        return null;
    } 
}