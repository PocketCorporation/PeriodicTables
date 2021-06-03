
const knex = require("../db/connection");

const tableName = "reservations";

function list(date) {
	if(date) {
		return knex(tableName)
			.select("*")
			.where({ reservation_date: date });
	}

	return knex(tableName)
		.select("*");
}

function create(reservation) {
	return knex(tableName)
		.insert(reservation)
		.returning("*");
}

function updateStatus(reservation_id, status){
	return knex("reservations")
	.where({reservation_id})
	.update({status}, "*")
	.then(result => result[0]);
}

function read(reservation_id) {
	return knex("reservations")
	.select("*")
	.where({ reservation_id})
	.then((reservation => reservation[0]))
}

function update(reservation_id, updatedReservation){
	return knex("reservations")
	.where({reservation_id})
	.update({ ...updatedReservation}, "*")
	.then(result => result[0]);
}


module.exports = {
	list,
	create,
	updateStatus,
	read,
	update
  };