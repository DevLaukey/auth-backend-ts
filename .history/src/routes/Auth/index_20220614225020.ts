const AuthRouter = require('express')['Router']();
import eah from "express-async-handler";
import UserSchema from "./schema/User";
import bcrypt from "bcrypt";
import ResponseFunc from "../../components/ResponseFunc";
import { signToken , verifyToken } from "./components/jwt";
import jwtKeyMiddleWare from "./middlewares/passjwtAuthKey";


AuthRouter.post('/signup' , [jwtKeyMiddleWare] ,  eah(async (req:any , res:any ) =>{
    const { email , password , username } = req.body;
    if(!( username.length >= 4 && email && password && password.length >= 6 && email.includes('@') && email.includes('.') && email.length >= 6)) 
    throw new Error(`Data sent is invalid.Check and try again`);
    // check if email is already in use
    const DoesUSerExist = await UserSchema.findOne({ email });
    if(DoesUSerExist)  throw new Error(`A user with such an email already exists`);
    // hash the password
    const hashedPassword = await bcrypt.hash(password , await bcrypt.genSalt(10));

    const newUserCreated = await UserSchema.create({
        email,
        username,
        password:hashedPassword,
    });

    if(newUserCreated){
        res.json({
            ...ResponseFunc({
                status:200,
                messsage:`User with email ${email} has been created`,
                token:signToken(
                    {
                        id:newUserCreated._id,
                        operation:'auth',
                    }
                    , `${req.jwtAuthKey}`
                )
            })
        })
    }else{
        throw new Error(`Unable to create user!Try again later`);
    }
}));



AuthRouter.post('/login' , [jwtKeyMiddleWare], eah( async (req:any , res:any)=>{
    const { email , password } = req.body;
    if(!(email && password && password.length >= 6 && email.includes('@') && email.includes('.') && email.length >= 6)) 
    throw new Error(`Data sent is invalid.Check and try again`);

    // check if user is present
    const DoesThisUSerExist:any = await UserSchema.findOne({email});
    if(!DoesThisUSerExist) throw new Error(`User with email ${email} does not exist.Maybe try signing up`);

    if(DoesThisUSerExist && await bcrypt.compare(password , DoesThisUSerExist.password)){
        res.json({
            ...ResponseFunc({
                status:200,
                messsage:`User with email ${email} has been created`,
                token:signToken(
                    {
                        id:DoesThisUSerExist._id,
                        operation:'auth',
                    }
                    , `${req.jwtAuthKey}`
                )
            })
        })
    }else {
        res.json({
            ...ResponseFunc({
                status:404,
                messsage:`Hmm.Something is not quite right.Try again later`,
            })
        })
    }
}));

// function called every time a person goes to their home page
// why ?
// to check if token is still valid
AuthRouter.post('/checkMe' , [jwtKeyMiddleWare],eah( async (req:any , res:any )=>{
    const { token } = req.body;
    if(!token)
    throw new Error(`Well this is weird!I have to kick you out`);
    const tokenData:any = verifyToken(token , `${req.jwtAuthKey}`);

    if(tokenData.operation == 'auth'){
        res.json({
            ...ResponseFunc({
                status:200,
                messsage:`This user is good to go`,
            }),
        })
    }else throw new Error(`User is not authenicated`);
}));

// in the future add : otp mobile verification , email password reset , 


export default AuthRouter;
