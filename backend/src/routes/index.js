const express = require("express");

const router = express.Router();

router.use("/auth", require("./authRoutes"));
router.use("/movies", require("./movieRoutes"));
router.use("/showtimes", require("./showtimeRoutes"));
router.use("/orders", require("./orderRoutes"));
router.use("/admin", require("./adminRoutes"));

module.exports = router;
