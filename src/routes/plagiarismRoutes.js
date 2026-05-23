const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });
const {
  comparePDFs,
  internetCheck
} = require("../controllers/plagiarismController");
const { generateReportPDF } = require("../services/reportService");

/* =========================
   MODE 1
========================= */
router.post(
  "/compare",
  upload.fields([
    { name: "pdf1", maxCount: 1 },
    { name: "pdfs", maxCount: 10 }
  ]),
  comparePDFs
);
/* =========================
   MODE 2
========================= */
router.post(
  "/internet-check",
  upload.single("pdf1"),
  internetCheck
);

/* =========================
   PDF REPORT GENERATOR
========================= */
router.post("/report", (req, res) => {
  try {
    const data = req.body;
    if (!data) {
      return res.status(400).json({ error: "No data provided" });
    }
    generateReportPDF(data, res);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
module.exports = router;