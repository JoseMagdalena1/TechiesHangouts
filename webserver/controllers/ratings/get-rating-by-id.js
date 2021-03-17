"use strict";

const mysqlPool = require("../../../database/mysql-pool");

async function getRating(req, res, next) {
  const { userId } = req.params;
  const id = userId;

  const connection = await mysqlPool.getConnection();
  try {
    const sqlQuery = `SELECT * FROM Ratings WHERE id_rated = ?`;
    const [rows] = await connection.query(sqlQuery, [id]);
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

module.exports = getRating;
