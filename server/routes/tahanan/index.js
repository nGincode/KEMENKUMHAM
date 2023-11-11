const express = require("express");
const router = express.Router();

const tahananController = require("../../controller/tahanan");

router.get("/", tahananController.get);
router.post("/", tahananController.post);
router.put("/", tahananController.put);

router.delete("/:uuid", tahananController.del);
router.get("/:uuid", tahananController.getId);
router.put("/:uuid", tahananController.putId);

module.exports = router;
