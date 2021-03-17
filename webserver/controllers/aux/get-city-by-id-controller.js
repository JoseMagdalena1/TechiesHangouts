"use strict";

const mySqlPool = require("../../../database/mysql-pool");

async function getCityName(req, res, next) {
  const { city_id } = { ...req.params };

  const id = city_id;

  let connection;
  try {
    connection = await mySqlPool.getConnection();
    const sqlQuery = `SELECT name FROM Cities WHERE id =?`;

    const [rows] = await connection.query(sqlQuery, [id]);
    connection.release();
    if (rows.length === 0) {
      return res.status(404).send();
    }
    return res.send(rows);
  } catch (e) {
    if (connection) {
      connection.release();
    }

    console.error(e);
    return res.status(500).send();
  }
}

module.exports = getCityName;
