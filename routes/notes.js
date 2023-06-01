const express = require("express");
const router = express.Router();
const Notes = require("../models/notesModel");
const fetchUser = require("../middleware/fetchUser.js");

router.get("/", fetchUser, async (req, res) => {
  const id = req.body.userId;
  const result = await Notes.find({ user: id });
  if (!result) {
    return res.send("Wow! Such Empty!");
  }
  res.status(200).json(result);
});

router.post("/", fetchUser, async (req, res) => {
  const { title, desc, tag } = req.body;
  try {
    const note = new Notes({ user: req.body.userId, title, desc, tag });
    const result = await note.save();
    result && res.json({status:true, msg: "New Note Saved", newuser:result});
  } catch (error) {
    res.status(500).json({error:error})
  }
});

router.put("/:id", fetchUser, async (req, res) => {
  const { title, desc, tag } = req.body;
  const note = await Notes.findById(req.params.id);
  if (!note) {
    return res.status(404).json("Not found!");
  }
  if (note.user.toString() !== req.body.userId) {
    return res.status(401).send("Not Authorized");
  }
  const newNote = {};
  if (title) newNote.title = title;
  if (desc) newNote.desc = desc;
  if (tag) newNote.tag = tag;
  try {
    const result = await Notes.findByIdAndUpdate(
      req.params.id,
      { $set: newNote }, //! Imp
      { new: true }
    );

    res.json({ User_Updated: result });
  } catch (error) {
    res.status(500).json({ error });
  }
});

router.delete("/:id", fetchUser, async (req, res) => {
  const note = await Notes.findById(req.params.id);
  if (!note) {
    return res.status(404).json("Not found!");
  }
  if (note.user.toString() !== req.body.userId) {
    return res.status(401).send("Not Authorized");
  }

  try {
    const result = await Notes.findByIdAndDelete(req.params.id, { new: true });

    res.json({ Note_Deleted: result });
  } catch (error) {
    res.status(500).json({ error });
  }
});

module.exports = router;
