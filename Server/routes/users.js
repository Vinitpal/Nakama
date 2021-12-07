const router = require("express").Router();
const bcrypt = require("bcrypt");
const User = require("../models/User");

// update
router.put(":/id", async (req, res) => {
  if ((req.body.userId = req.params.id || req.body.isAdmin)) {
    if (req.body.password) {
      try {
        const salt = bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(req.body.password, salt);
      } catch (error) {
        res.status(500).json(error);
      }
    }
    try {
      const user = await User.fundByIdAndUpdate(req.params.id, {
        $set: req.body,
      });
      res.status(200).json("Your account has been updated");
    } catch {
      return res.status(500).json(error);
    }
  } else {
    return res.status(403).json("You can update only your account");
  }
});

// delete
router.delete("/:id", async (req, res) => {
  if ((req.body.userId = req.params.id || req.body.isAdmin)) {
    try {
      await User.findByIdAndDelete(req.paras.id);
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
