"use strict";

const mySqlPool = require("../../../database/mysql-pool");

async function getThematicName(req, res, next) {
  const { thematic_id } = { ...req.params };
  const id = thematic_id;
  let connection;
  try {
    connection = await mySqlPool.getConnection();
    const sqlQuery = `SELECT name FROM Thematics WHERE id = ?`;

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

module.exports = getThematicName;
