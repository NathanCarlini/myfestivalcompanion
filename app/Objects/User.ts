import { DateTime } from "next-auth/providers/kakao"

export default class User {
    readonly timesampmodification : Date;
    iduser! : number;
    name! : string;
    email! : string;
    password! : string;
    creationdate! : DateTime;
    deletiondate! : DateTime;
    editdate! : DateTime;
    isverified! : boolean;
    image! : string

    constructor(){
        this.timesampmodification = new Date();
    }
}