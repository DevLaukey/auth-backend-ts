import { verifyToken } from "../../Auth/components/jwt";
import UserSchema from "../../Auth/schema/User";
export default async function Protector(req:any , res:any , next:any) {
    if(req.headers.Authorzation && req.headers.Authorzation.startsWith('Bearer')){
        try{
            const token = req.headers.Authorization.split(" ")[1];
            // make sure to pass the jtwkey provider before this middleware
            const tokenData:any = verifyToken(token , `${req.jwtAuthKey}`);
            if(!tokenData) throw new Error(`Unable to verify tou.Kindly try again`);
            if(tokenData.operation == 'auth'){
                const user = await UserSchema.findById(tokenData.id).select('-password');
                req.user = user;
                next();
            }else throw new Error(`Seems like this is an inavalid operation.Do not try again ... lol`);
        }catch(error){
            throw new Error(`Faced an error validating the user.Kindly try again`);
        }
    } else throw new Error(`Authorization token was not passed`);
}