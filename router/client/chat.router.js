const express = require("express");
const router = express.Router();
const controller = require("../../controller/client/chat.controller");

router.post("/", controller.index);

module.exports = router;
