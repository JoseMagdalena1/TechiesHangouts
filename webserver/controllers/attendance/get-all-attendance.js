"use strict";

const mySqlPool = require("../../../database/mysql-pool");

async function getAllAttendance(req, res, next) {
  const { userId } = req.params;
  let connection;

  try {
    connection = await mySqlPool.getConnection();
    const sqlQuery = `SELECT p.user_id, e.id, id_users, request_status, title, description, photo_url, c.name as cityName, t.name as thematicName, address, place, event_date, event_hour, city_id, thematic_id, p.name as userName, avatar_url, position, age FROM Attendance a INNER JOIN Events e ON a.event_id = e.id LEFT JOIN Thematics t ON e.thematic_id = t.id LEFT JOIN Cities c ON e.city_id = c.id INNER JOIN Profiles p ON a.id_users = p.user_id WHERE  id_users = ?`;
    const [rows] = await connection.query(sqlQuery, [userId]);
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
module.exports = getAllAttendance;
