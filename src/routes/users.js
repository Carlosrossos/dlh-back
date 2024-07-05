var express = require("express");
var router = express.Router();
const User = require("../models/users");
const { checkBody } = require("../middlewares/checkBody");
const uid2 = require("uid2");
const bcrypt = require("bcrypt");

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

/* POST new user*/
router.post("/signup", (req, res) => {
  if (!checkBody(req.body, ["userName", "mail", "password"])) {
    res.json({ result: false, error: "Champ manquant ou invalide." });
    return;
  }

  User.findOne({ userName: req.body.userName }).then((userNameData) => {
    if (userNameData) {
      res.json({ result: false, error: "Le nom d'utilisateur existe déjà." });
      return;
    }

    User.findOne({ mail: req.body.mail }).then((emailData) => {
      if (emailData) {
        res.json({ result: false, error: "Adresse mail déjà utilisée" });
        return;
      }
      const hash = bcrypt.hashSync(req.body.password, 10);
      const newUser = new User({
        userName: req.body.userName,
        mail: req.body.mail,
        password: hash,
        token: uid2(32),
      });
      newUser.save().then((data) => {
        res.json({ result: true, data });
      });
    });
  });
});

/* POST user connection*/
router.post("/signin", (req, res) => {

  if (!checkBody(req.body, ["mail", "password"])) {
    res.json({ result: false, error: "Champ manquant ou invalide." });
    return;
  }
  User.findOne({ mail: req.body.mail }).then((data) => {
    if (data && bcrypt.compareSync(req.body.password, data.password)) {
      res.json({ result: true, token: data.token, userName: data.userName });
    } else {
      res.json({ result: false, error: "Mot de passe ou adresse mail invalide" });
    }
  });
});


module.exports = router;
