import mongoose from "mongoose";
const UserSchema = new mongoose.Schema({
    email:{
        type:String,
        required:[true , 'Email was not passed'],
    },
    username:{
        type:String,
        required:[true , 'A username is requied'],
    },
    password:{
        type:String,
        required:[true , 'Password was not passed']
    }
} , { timestamps : true});


export default mongoose.model('User' , UserSchema);