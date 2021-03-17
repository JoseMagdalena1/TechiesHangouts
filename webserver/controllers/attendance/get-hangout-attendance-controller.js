"use strict";

const mySqlPool = require("../../../database/mysql-pool");

async function getHangoutAttendance(req, res, next) {
  const { hangoutId } = req.params;

  let connection;

  try {
    connection = await mySqlPool.getConnection();
    const sqlQuery = `SELECT a.id_users as guest_id, u.email, age, link_url, avatar_url, e.user_id as organizator_id, position, p.name as userName,  e.id as hangout_id, request_status FROM Attendance a INNER JOIN Events e ON a.event_id = e.id LEFT JOIN Thematics t ON e.thematic_id = t.id LEFT JOIN Cities c ON e.city_id = c.id LEFT JOIN Profiles p ON a.id_users = p.user_id LEFT JOIN Users u ON p.user_id = u.id WHERE event_id = ?`;
    const [rows] = await connection.query(sqlQuery, [hangoutId]);
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
module.exports = getHangoutAttendance;
