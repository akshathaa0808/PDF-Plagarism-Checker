require("dotenv").config({ path: "../.env" });

const express = require("express");
const path = require("path");

const plagiarismRoutes = require("./routes/plagiarismRoutes");


const app = express();

/* =========================
   BASIC MIDDLEWARE
========================= */
app.use(express.json());
app.use("/reports", express.static("reports"));
app.use(express.urlencoded({ extended: true }));

/* =========================
   FRONTEND STATIC FILES
========================= */
app.use(express.static(path.join(__dirname, "../public")));

/* =========================
   API ROUTES
========================= */
app.use("/api/plagiarism", plagiarismRoutes);

/* =========================
   HEALTH CHECK
========================= */
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    message: "Server running"
  });
});

/* =========================
   FRONTEND FALLBACK
========================= */
app.get("*", (req, res) => {
  res.sendFile(
    path.join(__dirname, "../public", "index.html")
  );
});

/* =========================
   START SERVER
========================= */
const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

/* =========================
   ERROR HANDLING
========================= */
server.on("error", (err) => {

  if (err.code === "EADDRINUSE") {

    console.error(
      `Port ${PORT} is already in use`
    );

  } else {

    console.error("Server error:", err);
  }

  process.exit(1);
});