"use strict";

const mysqlPool = require("../../../database/mysql-pool");

async function getCreatedRatings(req, res, next) {
  const { id_rater, event_id } = req.query;

  const connection = await mysqlPool.getConnection();
  try {
    const sqlQuery = `SELECT * FROM Ratings WHERE id_rater = ? AND event_id= ?`;
    const [rows] = await connection.query(sqlQuery, [id_rater, event_id]);
    connection.release();

    if (rows.length === 0) {
      return res.status(404).send();
    }
    return res.send(rows);
  } catch (e) {
    console.error(e);
    res.status(500).send();
  }
}

module.exports = getCreatedRatings;
