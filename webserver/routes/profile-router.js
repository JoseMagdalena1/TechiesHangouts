"use strict";

const express = require("express");
const multer = require("multer");
const router = express.Router();
const upload = multer();

const checkUserSession = require("../controllers/user/check-user-session");
const getProfile = require("../controllers/profile/get-profile-controller");
const getAvatar = require("../controllers/profile/get-avatar");
const uploadAvatar = require("../controllers/profile/upload-avatar-controller");
const updateProfile = require("../controllers/profile/update-profile-controller");

router.put(
  "/profiles/avatar/:userId",
  checkUserSession,
  upload.single(`file`),
  uploadAvatar
);
router.get("/profiles/avatar/:userId", checkUserSession, getAvatar);

router.put("/profiles/:userId", checkUserSession, updateProfile);
router.get("/profiles/:userId", checkUserSession, getProfile);
module.exports = router;
