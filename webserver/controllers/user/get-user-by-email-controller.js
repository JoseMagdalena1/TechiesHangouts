"use strict";

const mySqlPool = require("../../../database/mysql-pool");
const bcrypt = require("bcrypt");

async function getUser(req, res, next) {
  const { email, password } = { ...req.body };

  let connection;
  try {
    connection = await mySqlPool.getConnection();
    const sqlQuery = `SELECT * FROM Users WHERE email= ? AND deleted_at IS null`;
    const [rows] = await connection.query(sqlQuery, [email]);
    connection.release();

    /**
     * Estoy seguro que desde el if de rows hasta que acaba bcrypt.compare,
     * el código es muy mejorable. Ahora no lo veo y hace lo que pido
     */

    if (rows.length === 0) {
      return res.status(401).send();
    }

    bcrypt.compare(password, rows[0].password, function(err, response) {
      if (err) {
        console.error(err);
        return res.status(500).send();
      }
      if (response) {
        return res.status(200).send();
      } else {
        return res.status(401).send();
      }
    });
  } catch (e) {
    if (connection) {
      connection.release();
    }
    console.error(e);
    return res.status(500).send();
  }
}

module.exports = getUser;
