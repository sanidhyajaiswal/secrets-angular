import { Router } from "express";
const router = Router();
import Post, { find, findById, updateOne, deleteOne } from "../models/post";
import checkAuth from "../middleware/check-auth";
var ObjectId = require('mongoose').Types.ObjectId;

router.get("", checkAuth, (req,res) => {
    find().then((documents) => {
        res.status(200).json({message: "Successful", posts: documents})
    });
});

router.get("/:id",  checkAuth, (req, res) => {
    if(!(req.params.id).match(/^[0-9a-fA-F]{24}$/)){
        res.status(404).json({message: "Post Not Found"});
        return;
    }
    const newId = new ObjectId(req.params.id);
    if(!newId){
        res.status(404).json({message: "Post Not Found"});
        return;
    }
    findById(newId).then((post) => {
        if(post) {
            res.status(200).json(post);
        } else {
            res.status(404).json({message: "Post Not Found"});
        }
    });
});


router.post("", checkAuth, (req,res) => {
    const post = new Post({
        title: req.body.title,
        content: req.body.content,
        likes: req.body.likes,
        user_id: req.userData.userId
    });
    console.log(post);
    post.save();
    console.log(post._id);
    res.status(200).json({message: "Post Added!!", _id: post._id});
});

router.put("/:id",  checkAuth, (req, res) => {
    const post = new Post({
        _id: req.body._id,
        title: req.body.title,
        content: req.body.content,
        likes: req.body.likes,
        user_id: req.body.user_id
    });;  
    updateOne({_id: req.params.id, user_id: req.userData.userId}, post).then((result) => {
        if (result.modifiedCount > 0) {
            res.status(200).json({message: "Post updated! "});
        } else {
            res.status(401).json({message: "Not Authorized to Edit"});
        }
        
    });
    console.log(post);
});

router.patch("/:id",  checkAuth, (req, res) => {
    const newLike = req.body.likes;
    updateOne({_id: req.params.id}, [
        { $set: { likes: newLike} },
    ]).then((result) => {
        res.status(200).json({message: "Updated!!"});
    });
});

router.delete("",  checkAuth, (req, res) => {
    const id = req.body._id;
    deleteOne({_id: id, user_id: req.userData.userId}).then((result) => {
        console.log(result);
        if (result.deletedCount > 0) {
            res.status(200).json({message:  "Post Deleted"});
        } else {
            res.status(401).json({message: "Not Authorized to Delete"});
        }        
    });
});

export default router;
