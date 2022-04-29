const router = require("express").Router();
const bcrypt = require("bcrypt");
const User = require("../models/User");

// update a user
router.put("/:id", async (req, res) => {
  // check if admin or user
  if ((req.body.userId = req.params.id || req.body.isAdmin)) {
    // hashing password incase if updating password
    if (req.body.password) {
      try {
        const salt = bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(req.body.password, salt);
      } catch (error) {
        return res.status(500).json({ error: error });
      }
    }

    try {
      const user = await User.findByIdAndUpdate(req.params.id, {
        $set: req.body,
      });
      return res.status(200).json({ message: "Your account has been updated" });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: error });
    }
  } else {
    return res
      .status(403)
      .json({ message: "You can update only your account" });
  }
});

// delete a user
router.delete("/:id", async (req, res) => {
  // check if admin or user
  if ((req.body.userId = req.params.id || req.body.isAdmin)) {
    try {
      await User.findByIdAndDelete(req.params.id);
      return res.status(200).json({ message: "Account deleted succesfully" });
    } catch (error) {
      return res.status(500).json(error);
    }
  } else {
    return res.status(403).json("You can only delete your accound!");
  }
});

// get

// follow
// unfollow

module.exports = router;
