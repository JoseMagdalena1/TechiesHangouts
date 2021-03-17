"use strict";

const Joi = require("@hapi/joi");
const mysqlPool = require("../../../database/mysql-pool");

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
    event_date: Joi.string().required(),
    event_hour: Joi.string(),
    photo_url: Joi.string(),
    capacity: Joi.number().min(3),
    thematic_id: Joi.string().required()
  });

  Joi.assert(payload, schema);
}

async function updateHangout(req, res, next) {
  const hangoutData = { ...req.body };
  const { hangoutId } = req.params;

  try {
    await validate(hangoutData);
  } catch (e) {
    console.error(e);
    return res.status(400).send(e);
  }

  const {
    address,
    city_id,
    event_date,
    description,
    title,
    place,
    thematic_id,
    event_hour,
    photo_url,
    capacity
  } = hangoutData;

  let connection;
  try {
    const hangout = {
      address,
      city_id,
      description,
      event_date,
      event_hour,
      max_capacity: capacity,
      photo_url,
      place,
      thematic_id,
      title
    };

    connection = await mysqlPool.getConnection();
    try {
      const sqlUpdateHangout = `UPDATE Events SET ? WHERE id = ?`;
      await connection.query(sqlUpdateHangout, [hangout, hangoutId]);

      connection.release();
      return res.status(201).send();
    } catch (e) {
      connection.release();
      throw e;
    }
  } catch (e) {
    console.error(e);
    return res.status(500).send();
  }
}

module.exports = updateHangout;
