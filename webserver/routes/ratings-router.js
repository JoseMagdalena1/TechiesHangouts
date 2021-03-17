"use strict";

const express = require("express");
const checkUserSession = require("../controllers/user/check-user-session");
const createRating = require("../controllers/ratings/create-rating-controller");
const getRating = require("../controllers/ratings/get-rating-by-id");
const getCreatedRatings = require("../controllers/ratings/get-created-ratings-by-hangout");
const router = express.Router();

router.post("/rating/:hangoutId", checkUserSession, createRating);
router.get("/rating/:userId", checkUserSession, getRating);
router.get("/ratings/filter", checkUserSession, getCreatedRatings);

module.exports = router;
