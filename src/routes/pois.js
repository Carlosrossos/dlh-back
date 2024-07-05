var express = require("express");
var router = express.Router();
const Poi = require("../models/pois");
const User = require("../models/users");

/*POST a new POI */
router.post("/", (req, res) => {
    const newPoi = new Poi(req.body);
    newPoi.save().then((data) => res.json({esult: true, data}));
  });

    /*GET all POIs */
  router.get("/", (req, res) => {
    Poi.find().then((data) => {
      res.json({ pois: data });
    });
  });

  /*PATCH Fav un POI */
  router.patch("/favPoi", async (req, res) => {
    const userId = await User.findOne({ token: req.body.token });
    // Check si userId._id est déjà présent dans le tableau favorite
    const poi = await Poi.findOne({ _id: req.body.poiId, favorite: userId._id });
    if (!poi) {
      // Si userId._id n'est pas déjà présent, mettre  à jour le tableau avec $addToSet
      await Poi.updateOne(
        { _id: req.body.poiId },
        { $addToSet: { favorite: userId._id } }
      );
      return res.json({
        result: true,
        message: "POI marqué comme favori par l'utilisateur",
      });
    } else {
      // Si userId._id est déjà présent, ne rien faire
      return res.json({
        result: false,
        message: "POI déjà marqué comme favori par l'utilisateur",
      });
    }
  });

    /*PATCH unFav un POI */
    router.patch("/unfavPoi", async (req, res) => {
        const userId = await User.findOne({ token: req.body.token });
        // Check si userId._id est déjà présent dans le tableau favorite
        const poi = await Poi.findOne({ _id: req.body.poiId, favorite: userId._id });
        if (poi) {
          // Si userId._id est déjà présent, supprimez-le du tableau avec $pull
          await Poi.updateOne(
            { _id: req.body.poiId },
            { $pull: { favorite: userId._id } }
          );
          return res.json({
            result: true,
            message: "POI désépinglé par l'utilisateur",
          });
        } else {
          // Si userId._id n'est pas présent, ne rien faire
          return res.json({
            result: false,
            message: "POI non épinglé par l'utilisateur",
          });
        }
      });

  module.exports = router;