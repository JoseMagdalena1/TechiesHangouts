"use strict";
const express = require("express");
const checkUserSession = require("../controllers/user/check-user-session");

const getAllCities = require("../controllers/aux/get-all-cities-controller");
const getAllThematics = require("../controllers/aux/get-all-thematics-controller");
const getCityName = require("../controllers/aux/get-city-by-id-controller");
const getThematicName = require("../controllers/aux/get-thematic-by-id-controller");

const router = express.Router();

router.get("/city/:city_id", checkUserSession, getCityName);
router.get("/thematic/:thematic_id", checkUserSession, getThematicName);
router.get("/allcities", getAllCities);
router.get("/allthematics", getAllThematics);

module.exports = router;
