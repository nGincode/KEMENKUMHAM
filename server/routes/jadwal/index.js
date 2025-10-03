const express = require("express");
const router = express.Router();

const jadwalController = require("../../controller/jadwal");

router.get("/", jadwalController.get);
router.put("/", jadwalController.put);

module.exports = router;
