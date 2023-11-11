const express = require("express");
const router = express.Router();

const stockController = require("../../controller/stock");

router.get("/", stockController.get);
router.post("/", stockController.post);
router.put("/", stockController.put);

router.delete("/:uuid", stockController.del);
router.get("/:uuid", stockController.getId);
router.put("/:uuid", stockController.putId);

module.exports = router;
