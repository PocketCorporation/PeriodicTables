const service = require("./reservations.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

/**
 * List handler for reservation resources
 */
async function list(req, res) {
  res.json({
    data: [],
  });
}

async function list(req, res) {
  const { date, mobile_number } = req.query;
  let data = [];
  if (date) {
    data = await service.listByDate(date);
  } else if (mobile_number) {
    data = await service.listByPhoneNumber(mobile_number);
  } else {
    data = await list();
  }
  res.json({ data });
}

async function create(req, res) {
  req.body.data.status = "booked";

  const response = await service.create(req.body.data);

  res.status(201).json({ data: response[0] });
}

function validateBody(req, res, next) {
  if (!req.body.data) {
    return next({ status: 400, message: "Body must include a data object" });
  }

  const requiredFields = [
    "first_name",
    "last_name",
    "mobile_number",
    "reservation_date",
    "reservation_time",
    "people",
  ];

  for (const field of requiredFields) {
    if (!req.body.data.hasOwnProperty(field) || req.body.data[field] === "") {
      return next({ status: 400, message: `Field required: '${field}'` });
    }
  }

  if (
    Number.isNaN(
      Date.parse(
        `${req.body.data.reservation_date} ${req.body.data.reservation_time}`
      )
    )
  ) {
    return next({
      status: 400,
      message:
        "'reservation_date' or 'reservation_time' field is in an incorrect format",
    });
  }

  if (typeof req.body.data.people !== "number") {
    return next({ status: 400, message: "'people' field must be a number" });
  }

  if (req.body.data.people < 1) {
    return next({ status: 400, message: "'people' field must be at least 1" });
  }

  next();
}

function validateDate(req, res, next) {
  const reserveDate = new Date(
    `${req.body.data.reservation_date}T${req.body.data.reservation_time}:00.000`
  );
  const todaysDate = new Date();

  if (reserveDate.getDay() === 2) {
    return next({
      status: 400,
      message: "'reservation_date' field: restauraunt is closed on tuesday",
    });
  }

  if (reserveDate < todaysDate) {
    return next({
      status: 400,
      message:
        "'reservation_date' and 'reservation_time' field must be in the future",
    });
  }

  if (
    reserveDate.getHours() < 10 ||
    (reserveDate.getHours() === 10 && reserveDate.getMinutes() < 30)
  ) {
    return next({
      status: 400,
      message: "'reservation_time' field: restaurant is not open until 10:30AM",
    });
  }

  if (
    reserveDate.getHours() > 22 ||
    (reserveDate.getHours() === 22 && reserveDate.getMinutes() >= 30)
  ) {
    return next({
      status: 400,
      message: "'reservation_time' field: restaurant is closed after 10:30PM",
    });
  }

  if (
    reserveDate.getHours() > 21 ||
    (reserveDate.getHours() === 21 && reserveDate.getMinutes() > 30)
  ) {
    return next({
      status: 400,
      message:
        "'reservation_time' field: reservation must be made at least an hour before closing (10:30PM)",
    });
  }

  next();
}

async function updateStatus(req, res) {
  const { status } = req.body.data;
  const { reservationId } = req.params;
  const data = await service.updateStatus(reservationId, status);
  res.status(200).json({ data });
}

async function read(req, res) {
  const { reservationId } = req.params;
  const data = await service.read(reservationId);
  res.status(200).json({ data });
}

async function update(req, res) {
  const updatedReservation = req.body.data;
  const { reservationId } = req.params;
  const data = await service.update(reservationId, updatedReservation);
  res.status(200).json({ data });
}

module.exports = {
  list: asyncErrorBoundary(list),
  create: [validateBody, validateDate, asyncErrorBoundary(create)],
  updateStatus: asyncErrorBoundary(updateStatus),
  read: asyncErrorBoundary(read),
  update: asyncErrorBoundary(update),
};
