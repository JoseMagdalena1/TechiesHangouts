"use strict";

const Joi = require("@hapi/joi");
const mysqlPool = require("../../../database/mysql-pool");

async function validate(payload) {
  const schema = Joi.object({
    rating: Joi.number().required(),
    id_rated: Joi.string()
  });

  Joi.assert(payload, schema);
}

async function createRating(req, res, next) {
  let ratingData = req.body;

  const userId = req.claims;
  const hangoutId = req.params;

  try {
    await validate(ratingData);
  } catch (e) {
    console.error(e);
    return res.status(400).send(e);
  }
  const { id_rated, rating } = ratingData;

  const ratingObject = {
    id_rater: userId.userId,
    event_id: hangoutId.hangoutId,
    id_rated,
    rating
  };

  const connection = await mysqlPool.getConnection();
  try {
    const sqlInsertRatingQuery = `INSERT INTO Ratings SET ?`;
    await connection.query(sqlInsertRatingQuery, [ratingObject]);

    connection.release();
  } catch (e) {
    console.error(e);
    res.status(500).send(e.code);
  }

  res.status(200).send();
}

module.exports = createRating;
