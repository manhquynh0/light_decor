const express = require("express");
const router = express.Router();
const controller = require("../../controller/client/chat.controller");

router.post("/", controller.index);
router.get("/history", controller.getHistory);

module.exports = router;
