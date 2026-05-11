const express = require("express");
const router = express.Router();
const controller = require("../../controller/admin/chat.controller");

router.post("/", controller.index);

module.exports = router;
