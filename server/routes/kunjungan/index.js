const express = require("express");
const router = express.Router();

const kunjunganController = require("../../controller/kunjungan");

router.get("/", kunjunganController.get);
router.post("/", kunjunganController.post);
router.put("/", kunjunganController.put);

router.delete("/:uuid", kunjunganController.del);
router.get("/:uuid", kunjunganController.getId);
router.put("/:uuid", kunjunganController.putId);

module.exports = router;
