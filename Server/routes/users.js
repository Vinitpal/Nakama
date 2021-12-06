const router = require("express").Router();

router.get("/", (req, res) => {
  res.send("Its a user route");
});

module.exports = router;
