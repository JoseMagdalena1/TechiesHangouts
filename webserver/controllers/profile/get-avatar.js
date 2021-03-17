"use strict";

const mySqlPool = require("../../../database/mysql-pool");

async function getAvatar(req, res, next) {
  const { userId } = req.params;

  let connection;
  try {
    connection = await mySqlPool.getConnection();
    const sqlQuery = `SELECT avatar_url FROM Profiles WHERE user_id = ?`;
    const [rows] = await connection.query(sqlQuery, userId);
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
module.exports = getAvatar;
