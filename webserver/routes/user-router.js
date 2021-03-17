"use strict";

const express = require("express");
const createUser = require("../controllers/user/create-user-controller");
const deleteUser = require("../controllers/user/delete-user-controller");
const getUser = require("../controllers/user/get-user-by-email-controller");

const router = express.Router();

router.delete("/users/:userId", deleteUser);
router.post("/users/get", getUser);
router.post("/users", createUser);

module.exports = router;
