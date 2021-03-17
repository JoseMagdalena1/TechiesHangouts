"use strict";

const Joi = require("@hapi/joi");
const uuidV4 = require("uuid/v4");
const mysqlPool = require("../../../database/mysql-pool");

const httpServerDomain = process.env.HTTP_SERVER_DOMAIN;

async function validate(payload) {
  const schema = Joi.object({
    title: Joi.string()
      .trim()
      .min(1)
      .max(255)
      .required(),
    description: Joi.string()
      .trim()
      .min(10)
      .max(65536)
      .required(),
    address: Joi.string().required(),
    place: Joi.string().required(),
    city_id: Joi.string(),
    date: Joi.date().required(),
    hour: Joi.string(),
    photo_url: Joi.string(),
    capacity: Joi.number().min(3),
    thematic_id: Joi.string().required()
  });

  Joi.assert(payload, schema);
}

async function createHangout(req, res, next) {
  const hangoutData = { ...req.body };
  const { userId } = req.claims;
  try {
    await validate(hangoutData);
  } catch (e) {
    console.error(e);
    return res.status(400).send(e);
  }
  const now = new Date()
    .toISOString()
    .substring(0, 19)
    .replace("T", " ");

  const {
    title,
    description,
    address,
    place,
    city_id,
    thematic_id,
    date,
    hour,
    photo_url,
    capacity
  } = hangoutData;

  const hangoutId = uuidV4();
  let connection;
  try {
    const hangout = {
      id: hangoutId,
      address,
      event_date: date,
      max_capacity: capacity,
      description,
      place,
      thematic_id,
      title,
      photo_url,
      city_id,
      event_hour: hour,
      created_at: now,
      user_id: userId
    };

    hangout.photo_url === undefined
      ? "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQBOB-XVtR0-q1kBfUrjXXDjDiCxfJHl54p3ER0mGNDAKO7rBKi"
      : hangoutData.photo_url;
    console.log(hangout.photo_url);

    connection = await mysqlPool.getConnection();
    try {
      const sqlCreateHangout = `INSERT INTO Events SET ?`;
      await connection.query(sqlCreateHangout, hangout);

      try {
        const sqlUpdateAttendance = `INSERT INTO Attendance SET ?`;
        await connection.query(sqlUpdateAttendance, {
          id_users: userId,
          event_id: hangoutId,
          request_status: "accepted"
        });
      } catch (e) {
        throw e;
      }
      connection.release();
      res.header("Location", `${httpServerDomain}/api/hangouts/${hangoutId}`);
      return res.status(201).send(hangoutId);
      /**
       * Devuelve hangoutId para meter en variable de entorno
       * de Postman
       */
    } catch (e) {
      connection.release();
      throw e;
    }
  } catch (e) {
    console.error(e);
    return res.status(500).send();
  }
}

module.exports = createHangout;
