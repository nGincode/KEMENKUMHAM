const express = require("express");
const router = express.Router();

const kunjunganController = require("../../controller/kunjunganKuasaHukum");

router.get("/", kunjunganController.get);
router.post("/", kunjunganController.post);

router.delete("/:uuid", kunjunganController.del);
router.get("/:uuid", kunjunganController.getId);
router.put("/:uuid", kunjunganController.putId);

module.exports = router;
