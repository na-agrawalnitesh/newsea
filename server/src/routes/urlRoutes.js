const express = require("express");
const urlController = require("../controllers/urlController");
const router = express.Router();

router.post("/create", urlController.createUrl);
router.get("/get", urlController.getUrl);
router.delete("/:urlId", urlController.deleteUrl);
router.put("/:urlId", urlController.updateUrl);

module.exports = router;