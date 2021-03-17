"use strict";

const mySqlPool = require("../../../database/mysql-pool");

function payloadToQuery(payload) {
  const query =
    "SELECT e.id, title, description, e.user_id, city_id, photo_url, address, place, event_date, event_hour, thematic_id, t.name as thematicName, c.name as cityName, age, p.name as userName, position, aboutMe, avatar_url, link_url FROM Events e left JOIN Users u ON e.user_id = u.id LEFT JOIN Cities c ON e.city_id = c.id LEFT JOIN Thematics t ON e.thematic_id = t.id LEFT JOIN Profiles p ON u.id = p.user_id WHERE e.deleted_at IS null and";

  const arrObject = [];

  for (const property in payload) {
    let data = {
      column: property,
      value: payload[property],
      operator: "="
    };

    /* Si metemos rango de fechas usaría este
    if (data.column === "event_date1") {
      data.operator = ">=";
      data.column = "event_date";
    } else if (data.column === "event_date2") {
      data.operator = "<=";
      data.column = "event_date";
    } else {
      data.operator = "=";
    }
*/
    arrObject.push(data);
  }

  const parsedParams = arrObject
    .filter(param => param.value !== "null")
    .map(({ column, value, operator }) => `${column} ${operator} "${value}"`)
    .join(" AND ");

  const solution = `${query} ${parsedParams}`;

  return solution;
}

async function getHangoutsByQuery(req, res, next) {
  const filters = req.query;

  const sqlQuery = payloadToQuery(filters);

  try {
    const connection = await mySqlPool.getConnection();

    const [rows] = await connection.query(sqlQuery);

    if (rows.length === 0) res.status(404).send();

    res.send(rows);
  } catch (e) {
    console.error(e);
    res.status(500).send();
  }
}

module.exports = getHangoutsByQuery;
