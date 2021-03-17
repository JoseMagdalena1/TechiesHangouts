"use strict";

const mysqlPool = require("../../../database/mysql-pool");

async function SendAcceptedInvitationEmail(email) {
  const [username] = email.split("@");
  const message = {
    to: email,
    from: "techieshangouts@yopmail.com",
    subject: "Hola amigo! :D",
    text: `Bienvenido a TechiesHangouts, ${username}! Todo nuestro equipo quiere darte la bienvenida, esperemos que disfrutes de grandes experiencias y oportunidades! Nosotros estamos encantados de aportar nuestro granito de arena para que eso suceda `,
    html: `Bienvenido a TechiesHangouts, ${username}! Todo nuestro equipo quiere darte la bienvenida, esperemos que disfrutes de grandes experiencias y oportunidades! Nosotros estamos encantados de aportar nuestro granito de arena para que eso suceda `
  };

  const data = await sengridMail.send(message);
  return data;
}

async function acceptAttendance(req, res, next) {
  let { guest_id, email } = { ...req.body };
  const { hangoutId } = req.params;
  console.log({ ...req.body });

  const id_users = guest_id;
  const event_id = hangoutId;

  try {
    const connection = await mysqlPool.getConnection();
    try {
      const sqlAcceptAttendance = `UPDATE Attendance
            SET request_status = "accepted"
            WHERE
            event_id = ?
            AND id_users = ?`;
      await connection.execute(sqlAcceptAttendance, [event_id, id_users]);

      connection.release();
      return res.status(200).send();
    } catch (e) {
      connection.release();
      throw e;
    }
  } catch (e) {
    console.error(e);
    return res.status(500).send();
  }
}

module.exports = acceptAttendance;

/**
 * hangout:
   { id: '0dbcf24e-7dec-457a-8fac-38a86aed759b',
     title: 'Cañas',
     description: 'kjndfoilkjm oiwlk dsfj oidsñlfj mrpodñsl fmerpoñsl dg',
     user_id: '45d7fcbf-15af-4239-bb1b-497b0c5b3c27',
     city_id: '5c66391c-3ae0-4bc9-8309-b275f0687ca7',
     photo_url: null,
     address: 'Plaza Mayor',
     place: 'SOHO',
     event_date: '2020-03-05T00:00:00.000Z',
     event_hour: '21:00:00',
     thematic_id: '48s502ff-8b0b-4c9a-a594-5cb22550c7c8',
     thematicName: 'Docker',
     cityName: 'Madrid',
     age: 26,
     userName: 'Alejandro',
     position: 'Looking for a Junior opportunity',
     aboutMe: 'Al oeste en Philadelphia, crecía y vivía...',
     avatar_url:
      'https://res.cloudinary.com/jandro/image/upload/v1583314674/45d7fcbf-15af-4239-bb1b-497b0c5b3c27.jpg',
     link_url:
      'https://www.linkedin.com/in/alejandro-castro-alarc%C3%B3n-503ab1107/' }
 */
