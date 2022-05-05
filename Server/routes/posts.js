const router = require("express").Router();
const Post = require("../models/Post");
const User = require("../models/User");

// create a post
router.post("/", async (req, res) => {
  try {
    // save post in db
    const newPost = new Post(req.body);
    const savedPost = await newPost.save();

    // send response
    return res.status(200).json(savedPost);
  } catch (error) {
    return res.status(500).json(error);
  }
});

// update a post
router.put("/:id", async (req, res) => {
  // retrieve post from db
  const post = await Post.findById(req.params.id);

  // if not found then return 404 not found
  !post && res.status(404).json({ message: "Post does not exist" });

  try {
    // if found then check userId
    if (post.userId === req.body.userId) {
      // update the post
      await post.updateOne({ $set: req.body });
      return res.status(200).json({ message: "Post updated successfully" });
    } else {
      // return 403 forbidden
      return res.status(403).json({ message: "You can only update your post" });
    }
  } catch (error) {
    return res.status(500).json(error);
  }
});

// delete a post
router.delete("/:id", async (req, res) => {
  // retrieve post from db
  const post = await Post.findById(req.params.id);

  // if not found then return 404 not found
  !post && res.status(404).json({ message: "Post does not exist" });

  try {
    // if found then check userId
    if (post.userId === req.body.userId) {
      // delete the post
      await post.deleteOne();
      return res.status(200).json({ message: "Post deleted successfully" });
    } else {
      // return 403 forbidden
      return res.status(403).json({ message: "You can only delete your post" });
    }
  } catch (error) {
    return res.status(500).json(error);
  }
});

// like or dislike a post
router.put("/:id/like", async (req, res) => {
  // retrieve the post from db
  const post = await Post.findById(req.params.id);

  // if not found then return 404 not found
  !post && res.status(404).json({ message: "Post does not exist" });

  try {
    if (!post.likes.includes(req.body.userId)) {
      // if not already liked then like the post
      // by adding userId to likes array

      await post.updateOne({ $push: { likes: req.body.userId } });
      return res.status(200).json({ message: "Post liked succesfully" });
    } else {
      // if already liked then dislike the post
      // by removing userId from likes array

      await post.updateOne({ $pull: { likes: req.body.userId } });
      return res.status(200).json({ message: "Post disliked successfully" });
    }
  } catch (error) {
    return res.status(500).json(error);
  }
});

// get a post
router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    return res.status(200).json(post);
  } catch (error) {
    return res.status(500).json(error);
  }
});

// get timeline posts
router.get("/timeline/all", async (req, res) => {
  try {
    // get currentUser and his posts
    const currentUser = await User.findById(req.body.userId);
    const userPosts = await Post.find({ userId: currentUser._id });

    let friendPosts;

    // get the posts of the users that currentUser is following
    friendPosts = await Promise.all(
      currentUser.following.map((friendId) => {
        return Post.find({ userId: friendId });
      })
    );

    // concat and send all the post that will appear in the timeline
    return res.status(200).json(userPosts.concat(...friendPosts));
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
});

module.exports = router;
