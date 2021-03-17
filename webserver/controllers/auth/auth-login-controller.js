"use strict";

const bcrypt = require("bcrypt");
const Joi = require("@hapi/joi");
const jwt = require("jsonwebtoken");
const mysqlPool = require("../../../database/mysql-pool");

async function validate(payload) {
  const schema = Joi.object({
    email: Joi.string()
      .email()
      .required(),
    password: Joi.string().regex(/^[a-zA-Z0-9]{6,30}$/)
  });

  Joi.assert(payload, schema);
}

async function login(req, res, next) {
  const userData = { ...req.body };

  try {
    await validate(userData);
  } catch (e) {
    return res.status(400).send(e);
  }
  const sqlQuery = `SELECT id, email, password
    FROM Users
    WHERE email = '${userData.email}'`;

  try {
    const connection = await mysqlPool.getConnection();
    const [rows] = await connection.query(sqlQuery);

    connection.release();

    if (rows.length !== 1) {
      return res.status(401).send();
    }

    const user = rows[0];

    try {
      // *  2.1 Mirar si la pass es correcta
      const isPasswordOk = await bcrypt.compare(
        userData.password,
        user.password
      );
      if (!isPasswordOk) {
        return res.status(401).send();
      }
    } catch (e) {
      return res.status(500);
    }

    const payloadJwt = {
      userId: user.id
    };

    const jwtExpiresIn = parseInt(process.env.AUTH_ACCESS_TOKEN_TTL);
    const token = jwt.sign(payloadJwt, process.env.AUTH_JWT_SECRET, {
      expiresIn: jwtExpiresIn
    });

    return res.send({
      token,
      userId: user.id,
      email: user.email,

      expiresIn: jwtExpiresIn
    });
  } catch (e) {
    console.error(e.message);
    return res.status(500).send();
  }
}

module.exports = login;
