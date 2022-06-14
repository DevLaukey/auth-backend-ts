export default function jwtKeyMiddleWare(req:any ,res:any , next:any){
    req.jwtAuthKey = 'passYouRSecretAuthK$yHer$';
    next();
}
