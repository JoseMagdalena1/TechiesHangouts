"use strict";

const mySqlPool = require("../../../database/mysql-pool");

async function getPendingRequest(req, res, next) {
  const { hangoutId } = req.params;

  let connection;

  try {
    connection = await mySqlPool.getConnection();
    const sqlQuery = `SELECT age, link_url, avatar_url, p.user_id as user_id, position, p.name as userName,  e.id as hangout_id, request_status FROM Attendance a INNER JOIN Events e ON a.event_id = e.id LEFT JOIN Thematics t ON e.thematic_id = t.id LEFT JOIN Cities c ON e.city_id = c.id LEFT JOIN Profiles p ON a.id_users = p.user_id WHERE 
    request_status = "pending" AND event_id = ?`;
    const [rows] = await connection.query(sqlQuery, hangoutId);
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
module.exports = getPendingRequest;
