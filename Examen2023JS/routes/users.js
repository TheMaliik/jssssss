const express = require("express");
const router = express.Router();
const validate = require("../middll/validate");
const userController = require("../controller/userController");
/*router.get("/show", (req, res) => {
  res.send("salut 4twin9");
});

router.get("/add/:username/:email/:cin", (req, res) => {
  new User({
    username: req.params.username,
    email: req.params.email,
    cin: req.params.cin,
  }).save();
  res.send("good added");
});*/

router.post("/add", validate.validateusers, userController.add);
router.get("/showuser", userController.showuser);
router.get("/showbyid/:id", userController.showByid);
router.get("/showUsername/:username", userController.showuserByname);
router.get("/showUsersname/:username", userController.showusersByname);
router.put("/update/:id", userController.update);
router.delete("/delete/:id", userController.deleteuser);
router.get("/chat", (req, res) => {
  res.render("chat");
});

module.exports = router;
