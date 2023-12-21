const express=require('express')
const router=express.Router()
const fetchUser=require("../middleware/fetchUser")
const User = require('../models/Users');
const Notes = require('../models/Notes');
const { body, validationResult } = require('express-validator');
const mongoose = require('mongoose');


//get all the notes
router.get("/fetchallnotes", fetchUser, async (req, res) => {
    try {
        // const id=new mongoose.Types.ObjectId(req.body.id);
        // console.log(id)
        const notes = await Notes.find({ user:req.user.id });
        res.json(notes);
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Some Error occured");
    }
});


//route to add a notes
router.post("/addNotes",fetchUser,[
    body('title').isLength({ min: 3 }),
    body('description').isLength({ min: 5 }),
],async(req,res)=>{
    //if errors return them
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const {title,description,tag}=req.body
    try{
       const note=new Notes({
        title:title,
        description:description,
        tag:tag,
        user:req.user.id
       })
      const savedNote = await note.save()
      res.send(savedNote)
    }catch(err){
        res.status(500).json({
            err:"Internal Server Error"
         })
    }
})

// router.put("/editNote/:id",fetchUser,[
//     body('title').isLength({ min: 3 }),
//     body('description').isLength({ min: 5 }),
// ],async(req,res)=>{
//    try{
//     const {title,description,tag}=req.body
//     const newNote={}
//     if(title){
//         newNote.title=title
//     }
//     if(description){
//         newNote.description=description
//     }
//     if(tag){
//         newNote.tag=tag
//     }
//     let note=await Notes.findById(req.params.id)
//     if(!note){res.status(404).send("Not found")}
//     if(note.user.toString()!=req.user.id){res.status(400).send("Auth yourself")}
//     note=await Notes.findByIdAndUpdate(req.params.id,{$set:newNote},{new:true} )
//      res.send(note)

//    }catch(err){
//     res.status(500).json({
//         err:"Internal Server Error"
//      })
//    }
// })

router.put('/updatenote/:id', fetchUser, async (req, res) => {
    const { title, description, tag } = req.body;
    try {
        //Create a newNote object
        const newNote = {};
        if (title) { newNote.title = title };
        if (description) { newNote.description = description };
        if (tag) { newNote.tag = tag };

        // Find the note to be updated and update it
        let note = await Notes.findById(req.params.id);
        if (!note) { return res.status(404).send("Not Found") }
        // Allow updation only if user owns this Note
        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("Not Allowed")
        }

        note = await Notes.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true })
        res.json({ note });
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Some Error occured");
    }

})

router.delete("/deleteNote/:id",fetchUser,async(req,res)=>{
    try{
    let note=await Notes.findById(req.params.id)
    if(!note){
        return res.status(404).send("Note not found")
    }
    if(req.user.id!==note.user.toString()){
       return res.status(401).send("access denied")
    }
    await Notes.findByIdAndDelete(req.params.id)
    // note=await Notes.findById(req.params.id)
    res.send("note has been deleted")
   }catch(err){
    console.log(err);
    res.status(500).send("Some Error occured");
   }
})

module.exports=router