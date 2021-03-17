"use strict";

const express = require("express");
const checkUserSession = require("../controllers/user/check-user-session");
const acceptAttendance = require("../controllers/attendance/accept-attendance-controller");
const createAttendance = require("../controllers/attendance/create-attendance");
const rejectAttendance = require("../controllers/attendance/reject-attendance-controller");
const getPendingAttendance = require("../controllers/attendance/get-pending-attendance-controller");
const getAcceptedAttendance = require("../controllers/attendance/get-accepted-attendance-controller");
const getAllAttendance = require("../controllers/attendance/get-all-attendance");
const getHangoutAttendance = require("../controllers/attendance/get-hangout-attendance-controller");

const router = express.Router();

router.post("/attendance/:hangoutId", checkUserSession, createAttendance);
router.put(
  "/attendance/accepted/:hangoutId",
  checkUserSession,
  acceptAttendance
);
router.put(
  "/attendance/rejected/:hangoutId",
  checkUserSession,
  rejectAttendance
);
router.get(
  "/attendance/pending/:hangoutId",
  checkUserSession,
  getPendingAttendance
);
router.get(
  "/attendance/accepted/:hangoutId",
  checkUserSession,
  getAcceptedAttendance
);
router.get("/attendance/:userId", checkUserSession, getAllAttendance);
router.get(
  "/attendance/hangout/:hangoutId",
  checkUserSession,
  getHangoutAttendance
);

module.exports = router;
