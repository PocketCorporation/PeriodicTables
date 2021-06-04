const knex = require("../db/connection");

const tableName = "reservations";

function list() {
  return knex("reservation");
}

function listByDate(date) {
  return knex(tableName)
    .select("*")
    .where({ reservation_date: date })
    .whereNot({ status: "finished" })
    .whereNot({ status: "cancelled" })
    .orderBy("reservation_time");
}

function create(reservation) {
  return knex(tableName).insert(reservation).returning("*");
}

function updateStatus(reservation_id, status) {
  return knex(tableName)
    .where({ reservation_id })
    .update({ status }, "*")
    .then((result) => result[0]);
}

function read(reservation_id) {
  return knex(tableName)
    .select("*")
    .where({ reservation_id })
    .then((reservation) => reservation[0]);
}

function update(reservation_id, updatedReservation) {
  return knex(tableName)
    .where({ reservation_id })
    .update({ ...updatedReservation }, "*")
    .then((result) => result[0]);
}

function listByPhoneNumber(mobile_number) {
  return knex(tableName)
    .whereRaw(
      "translate(mobile_number, '() -', '') like ?",
      `%${mobile_number.replace(/\D/g, "")}%`
    )
    .orderBy("reservation_date");
}

module.exports = {
  list,
  listByDate,
  listByPhoneNumber,
  create,
  updateStatus,
  read,
  update,
};
