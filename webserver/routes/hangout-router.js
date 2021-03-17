"use strict";
const express = require("express");
const checkUserSession = require("../controllers/user/check-user-session");
const createHangout = require("../controllers/hangouts/create-hangout-controller");
const deleteHangout = require("../controllers/hangouts/delete-hangout-controller");
const getHangout = require("../controllers/hangouts/get-hangout-controller");
const getAllHangouts = require("../controllers/hangouts/get-all-hangouts-controller");
const getHangoutsByQuery = require("../controllers/hangouts/get-hangouts-by-query");
const updateHangout = require("./../controllers/hangouts/update-hangout-controller");
const getOrganizedHangouts = require("../controllers/hangouts/get-organized-hangouts-controller");
const router = express.Router();

/**
 * No autentifico al usuario en el getAll porque me pidieron que un usuario anónimo pudiese
 * entrar a la página principal.
 */

router.post("/hangouts", checkUserSession, createHangout);
router.get(
  "/hangouts/organized/:userId",
  checkUserSession,
  getOrganizedHangouts
);
router.get("/hangouts", getAllHangouts);
router.get("/hangouts/filter", checkUserSession, getHangoutsByQuery);
router.get("/hangouts/:hangoutId", checkUserSession, getHangout);
router.delete("/hangouts/:hangoutId", checkUserSession, deleteHangout);
router.put("/hangouts/:hangoutId", checkUserSession, updateHangout);

module.exports = router;
