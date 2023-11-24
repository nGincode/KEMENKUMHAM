const express = require("express");
const router = express.Router();

const pengajuanController = require("../../controller/pengajuan");

router.get("/", pengajuanController.get);
router.post("/", pengajuanController.post);
router.put("/", pengajuanController.put);

router.delete("/:uuid", pengajuanController.del);
router.get("/:uuid", pengajuanController.getId);
router.put("/:uuid", pengajuanController.putId);

module.exports = router;
