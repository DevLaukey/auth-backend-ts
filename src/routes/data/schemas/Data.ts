import mongoose from "mongoose";


const DataSchema = new mongoose.Schema({
    text:{
        type:String,
        required:[true , 'Data to store was not passed'],
    },
    owner:{
        type:mongoose.Types.ObjectId,
        required:[true , 'Owner of the data was not passed'],
    }
} , { timestamps : true});


export default mongoose.model('Data' , DataSchema);