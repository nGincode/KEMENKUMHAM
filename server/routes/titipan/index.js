const express = require("express");
const router = express.Router();

const titipanController = require("../../controller/titipan");

router.get("/", titipanController.get);
router.post("/", titipanController.post);
router.put("/", titipanController.put);

router.delete("/:uuid", titipanController.del);
router.get("/:uuid", titipanController.getId);
router.put("/:uuid", titipanController.putId);

module.exports = router;
