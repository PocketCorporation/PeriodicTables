const knex = require("../db/connection");

const tableName = "tables";

function list() {
	return knex(tableName)
		.select("*");
}

function create(table) {
	return knex(tableName)
		.insert(table)
		.returning("*");
}

async function update(reservation_id, table_id){
	const knexTransaction = await knex.transaction()
	
	return knexTransaction("reservations")
	.where({reservation_id})
	.update({status: "seated"})
	.then(()=>{
		return knexTransaction("tables")
		.where({table_id})
		.update({reservation_id, status:"occupied"})
	})
	.then(knexTransaction.commit)
	
}

async function deleteSeatReservation(reservation_id, table_id){
	const knexTransaction = await knex.transaction()

	return knexTransaction("reservations")
	.where({reservation_id})
	.update({status: "finished"})
	.then(()=>{
		return knexTransaction("tables")
		.where({table_id})
		.update({reservation_id, status:"free"})
	})
	.then(knexTransaction.commit)
}

module.exports = {
	list,
	create,
	update,
	deleteSeatReservation,
}