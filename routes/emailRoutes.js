const express = require("express");
const router = express.Router();
const emailController = require("../controllers/emailController");
const upload = require("../middlewares/upload");

router.post("/send-email", emailController.sendSingleEmail);
router.post("/upload-excel", upload.single("file"), emailController.uploadExcel);
// router.post("/upload-excel", upload.single("file"), emailController.uploadExcel);
// router.post("/send-multiple-emails", emailController.sendMultipleEmails);

module.exports = router;
