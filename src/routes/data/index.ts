// this is going to be a simple note saver page
// to do -- add real time updates using web sokets
import express from "express";
import jwtKeyMiddleWare from "./middlewares/jwtAuthKey";
import eah from "express-async-handler";
import Protector from "./middlewares/Protector";
import DataSchema from "./schemas/Data";
const DataRouter = express.Router();
import ResponseFunc from "../../components/ResponseFunc";

DataRouter.get('/' , [jwtKeyMiddleWare , Protector] , eah( async (req:any , res:any)=>{
    // req.user is obtained from the protector middleware and contains essential user data
    if(!req.user) throw new Error(`Hmm.Well this is embarasing.. i am unable to locate you in my brainbase`);
    const AllMyData = await DataSchema.find({ owner : req.user._id});
    if(!AllMyData){
        res.json({
            ...ResponseFunc({
                status:200,
                messsage:`You currently have no notes.We have however presented you with an empty array`,
            }),
            notes:[],
        });
    }
    else{
        res.json({
            ...ResponseFunc({
                status:200,
                messsage:`Your notes have been availed`,
            }),
            notes:AllMyData,
        })
    }
}));


DataRouter.post('/', [jwtKeyMiddleWare , Protector] , eah(async (req:any , res:any ) =>{
    if(!req.user) throw new Error(`Hmm.Well this is embarasing.. i am unable to locate you in my brainbase`);
    const { note } = req.body;
    if(!(note && note.length > 0)) throw new Error(`Invalid note length\nNote is ${!note ? 'undefined' : 'below the requied length'}`);
    const NewNote = await DataSchema.create({
        text: note ,
        owner: req.user._id,
    });
    if(!NewNote) throw new Error(`Unable to create note now.Try again later`);
    else res.json({
        ...ResponseFunc({
            status:200,
            messsage:`Note created`,
        }),
        note:NewNote,
    })
}));

DataRouter.delete("/:id" , [jwtKeyMiddleWare , Protector] , eah( async (req:any , res) =>{
    if(!req.user) throw new Error(`Hmm.Well this is embarasing.. i am unable to locate you in my brainbase`);
    const { id } = req.params;
    if(!id) throw new Error(`Id was not passed`);
    // ensure not exists in the first place
    const NoteToDelete = await DataSchema.findById(id);
    if(!NoteToDelete) throw new Error(`404 error : Not with the id ${id} was not found`);
    //ensure owner id is same to user id
    if(!(NoteToDelete.owner == req.user._id)) throw new Error(`This operation is not authorizied`);
    else{
        const DeleteThisNote = await DataSchema.findByIdAndDelete(NoteToDelete._id);
        if(!DeleteThisNote) throw new Error(`Was not able to delete the note.Try again later`);
        else res.json({
            ...ResponseFunc({
                status:200,
                messsage:`Note with id ${id} has been deleted`,
            })
        })
    }

}));

DataRouter.patch('/:id' , [jwtKeyMiddleWare , Protector] , eah( async (req:any , res ) =>{
    if(!req.user) throw new Error(`Hmm.Well this is embarasing.. i am unable to locate you in my brainbase`);
    if(!(req.params.id && req.body.note)) throw new Error(`Document ${req.body.note ? req.params.id ? 'data or id' : 'id' : 'data'} was not passed`);
    const { id } = req.body;
    const { note } = req.body;
    const NoteToPatch = await DataSchema.findById(id);
    if(!NoteToPatch) throw new Error(`Note to update with id ${id} was not found`);
    if(NoteToPatch && NoteToPatch.owner == req.user._id){
        const UpdateNote = await DataSchema.findByIdAndUpdate( id , { text :note } , { new : true});
        if(!UpdateNote) throw new Error(`Unable to update note`);
        else res.json({
            ...ResponseFunc({
                status:200,
                messsage:`Note updated!`
            })
        })
    } else throw new Error(`This operation is not authorized`);
}));


export default DataRouter;