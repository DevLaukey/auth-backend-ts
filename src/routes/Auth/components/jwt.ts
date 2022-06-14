import jwt from "jsonwebtoken";


export const signToken = (data:{ id:any , operation : string} , secretKey:string , expires ='30d')=>{
    // you can change the expires in time to as required
    return jwt.sign({ ...data} , `${secretKey}` , { expiresIn : expires});
}





function isTokenExpired(token:string) {
    const payloadBase64 = token.split('.')[1];
    const decodedJson = Buffer.from(payloadBase64, 'base64').toString();
    const decoded = JSON.parse(decodedJson)
    const exp = decoded.exp;
    const expired = (Date.now() >= exp * 1000)
    return expired
}


export const verifyToken = (token:any , secKey:string)=>{
    if(!(token && secKey)) throw new Error(`Invalid data passed`);
    if(isTokenExpired(token)) throw new Error(`This token has expired`)
    else return jwt.verify(token , `${secKey}`);
}