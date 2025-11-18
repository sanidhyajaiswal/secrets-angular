import { Router } from "express";
const router = Router();
import Comment, { findOne, updateOne, deleteOne } from "../models/comment";
import checkAuth from "../middleware/check-auth";

router.get("/:id",  checkAuth, (req, res) => {
    findOne({story_id: req.params.id}).then((comment) => {
        if(comment){
            res.status(200).json(comment);
        } else {
            res.status(404).json({message: "Cannot Find Comments for the post"});
        }
    });
});

router.post("",  checkAuth, (req,res) => {
    const comment =  new Comment({
        story_id: req.body._id,
        cmnt_cnt: 0,
        cmnts: []
    });
    console.log(comment);
    comment.save();
    res.status(200).json({message: "Comment Array Created!"});
});

router.patch("/:id",  checkAuth, (req,res) => {
    const newComment = req.body.comment;
    updateOne(
        {story_id: req.params.id},
        { $push: {cmnts: newComment}, $inc: { cmnt_cnt: 1 } }
    ).then((result) => {
        res.status(200).json({message: "Comment added!"})
    });
});

router.delete("",  checkAuth, (req, res) => {
    const id = req.body._id;
    console.log(id);
    deleteOne({story_id: id}).then((result) => {
        res.status(200).json({message: "Comment Array Deleted!!"});
    });
});

export default router;
