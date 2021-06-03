const service = require("./tables.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

async function list(req, res) {
    const response = await service.list();

    res.json({ data: response });
}

function validateBody(req, res, next) {
    if(!req.body.data.table_name || req.body.data.table_name === "") {
        return next({ status: 400, message: "'table_name' field cannot be empty" });
    }

    if(req.body.data.table_name.length < 2) {
        return next({ status: 400, message: "'table_name' field must be at least 2 characters" });
    }

    if(!req.body.data.capacity || req.body.data.capacity === "") {
        return next({ status: 400, message: "'capacity' field cannot be empty" });
    }

    if(typeof req.body.data.capacity !== "number") {
		return next({ status: 400, message: "'capacity' field must be a number" });
	}

	if(req.body.data.capacity < 1) {
		return next({ status: 400, message: "'capacity' field must be at least 1" });
	}

    next();
}

async function create(req, res) {
    req.body.data.status = "free";

    const response = await service.create(req.body.data);

    res.status(201).json({ data: response[0] });
}

async function update(req, res){
    const { reservation_id } = req.body.data;
    const table_id = req.params.tableId
    const data = await service.update(reservation_id, table_id)
    res.json({ data })
}

async function deleteSeatReservation(req, res){
    const { reservation_id } = req.body.data;
    const table_id = req.params.tableId
    console.log(reservation_id, "reservation_id")
    console.log(table_id, "table_id")
    const data = await service.deleteSeatReservation(reservation_id, table_id)
    res.json({ data })
}


module.exports = {
	list: asyncErrorBoundary(list),
	create: [validateBody, asyncErrorBoundary(create)],
    update: asyncErrorBoundary(update),
    delete: asyncErrorBoundary(deleteSeatReservation),
};