"use strict";

const mySqlPool = require("../../../database/mysql-pool");

/**
 *
 * Sería muy interesante que hubiese solo una columna en la tabla con DATETIME para
 * poder mostrar los eventos que no han ocurrido ya (por fecha y hora). De esta forma
 * puede pasar que te muestre eventos ya ocurridos ese día o que no
 * te muestre los eventos del día en que realizas la búsqueda, no lo sé.
 *
 */

async function getAllHangouts(req, res, next) {
  let connection;
  try {
    connection = await mySqlPool.getConnection();
    const sqlQuery = `SELECT e.id, title, description, e.user_id, city_id, photo_url, address, place, event_date, event_hour, thematic_id, t.name as thematicName, c.name as cityName, age, p.name as userName, position, aboutMe, avatar_url, link_url FROM Events e left JOIN Users u ON e.user_id = u.id LEFT JOIN Cities c ON e.city_id = c.id LEFT JOIN Thematics t ON e.thematic_id = t.id LEFT JOIN Profiles p ON u.id = p.user_id WHERE event_date  >= ? AND e.deleted_at IS NULL ORDER BY event_date ASC`;

    const today = new Date().toISOString().substring(0, 10);

    const [rows] = await connection.execute(sqlQuery, [today]);
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

module.exports = getAllHangouts;
