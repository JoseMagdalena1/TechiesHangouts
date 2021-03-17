"use strict";

const Joi = require("@hapi/joi");
const mySqlPool = require("../../../database/mysql-pool");

async function validate(payload) {
  const schema = Joi.object({
    name: Joi.string()
      .trim()
      .min(1)
      .max(100)
      .required(),
    category: Joi.string()
      .trim()
      .min(5)
      .max(100)
      .required(),
    position: Joi.string()
      .trim()
      .min(5)
      .max(100)
      .required(),
    university_id: Joi.string(),
    about: Joi.string()
      .trim()
      .min(5)
      .max(1000)
      .required(),
    age: Joi.number()
      .min(1)
      .max(150)
      .required(),
    link_url: Joi.string()
  });

  Joi.assert(payload, schema);
}

async function updateProfile(req, res, next) {
  const profileData = { ...req.body };
  const { userId } = req.params;
  console.log({ ...req.body });
  try {
    await validate(profileData);
  } catch (e) {
    console.error(e);
    return res.status(400).send(e);
  }

  const now = new Date()
    .toISOString()
    .substring(0, 19)
    .replace("T", " ");

  const {
    age,
    name,
    category,
    position,
    about,
    link_url,
    university_id
  } = profileData;

  const profile = {
    age,
    name,
    category,
    position,
    university_id,
    aboutMe: about,
    link_url,
    updated_at: now
  };

  let connection;
  try {
    const connection = await mySqlPool.getConnection();
    const sqlQuery = `UPDATE Profiles
    SET ?
    WHERE user_id = ?`;
    try {
      await connection.query(sqlQuery, [profile, userId]);
    } catch (e) {
      console.error(e);
      throw e;
    }

    connection.release();

    return res.status(200).send();
  } catch (e) {
    if (connection) {
      connection.release();
    }
    console.error(e);
    return res.status(500).send();
  }
}

module.exports = updateProfile;
