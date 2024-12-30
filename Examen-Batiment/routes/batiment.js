const express = require("express");
const router = express.Router();
const BatimentController = require("../controller/batimentcontroller");

router.post("/addBatiment", BatimentController.addbatiment);
router.get("/getallbatiment", BatimentController.getallbatiemnt);
router.get("/getbyidbatiment/:id", BatimentController.getbyidbatiment);
router.delete("/deletebatimentByID/:id", BatimentController.deletebyidBatiment);
router.delete("/deleteniveau/:id", BatimentController.deletebyidniveau);
router.post("/addNiveau", BatimentController.addNiveau);
router.put("/construction/:id", BatimentController.construction);
router.get("/getNiveauAll", BatimentController.getallNiveau);
router.post("/AddBatAndNiveau",BatimentController.AddBatiAndNiveaux);



router.get("/batiment", (req, res, next) => {
  res.render("batiment");
});
module.exports = router;
