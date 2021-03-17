"use strict";

const mySqlPool = require("../../../database/mysql-pool");

async function getAllThematics(req, res, next) {
  let connection;
  try {
    connection = await mySqlPool.getConnection();
    const sqlQuery = `SELECT * FROM Thematics `;

    const [rows] = await connection.query(sqlQuery);

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
module.exports = getAllThematics;
