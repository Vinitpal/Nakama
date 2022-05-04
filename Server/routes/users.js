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
        return res.status(500).json(error);
      }
    }

    try {
      const user = await User.findByIdAndUpdate(req.params.id, {
        $set: req.body,
      });
      return res.status(200).json({ message: "Your account has been updated" });
    } catch (error) {
      console.log(error);
      return res.status(500).json(error);
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

// get a user
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    // filter out password and updatedAt
    const { password, updatedAt, ...other } = user._doc;

    return res.status(200).json(other);
  } catch (error) {
    return res.status(500).json(error);
  }
});

// follow
router.put("/:id/follow", async (req, res) => {
  // condition to check if you're not following yourself
  if (req.body.userId !== req.params.id) {
    try {
      // here currentUser is sending follow req to user
      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(req.body.userId);

      // if not already following
      if (!user.followers.includes(req.body.userId)) {
        // then update the following and follower array
        await user.updateOne({ $push: { followers: req.body.userId } });
        await currentUser.updateOne({
          $push: { following: req.params.id },
        });

        return res.status(200).json({
          message: `${currentUser.username} is now following ${user.username}`,
        });
      } else {
        return res.status(403).json({
          message: `${currentUser.username} is already following ${user.username}`,
        });
      }
    } catch (error) {
      return res.status(500).json(error);
    }
  } else {
    return res.status(403).json({ message: "You can't follow yourself" });
  }
});

// unfollow
router.put("/:id/unfollow", async (req, res) => {
  // condition to check if you're not unfollowing yourself
  if (req.body.userId !== req.params.id) {
    try {
      // here currentUser is sending unfollow req to user
      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(req.body.userId);

      // if already following
      if (user.followers.includes(req.body.userId)) {
        // then update the following and follower array
        await user.updateOne({ $pull: { followers: req.body.userId } });
        await currentUser.updateOne({
          $pull: { following: req.params.id },
        });

        return res.status(200).json({
          message: `${currentUser.username} no more follows ${user.username}`,
        });
      } else {
        return res.status(403).json({
          message: `${currentUser.username} doesn't follow ${user.username}`,
        });
      }
    } catch (error) {
      return res.status(500).json(error);
    }
  } else {
    return res.status(403).json({ message: "You can't unfollow yourself" });
  }
});

module.exports = router;
