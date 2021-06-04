import React from "react";
import { updateReservationStatus } from "../utils/api";
import { Link, useHistory } from "react-router-dom";

function ReservationsList({
  reservations,
  setReservationsError,
  loadDashboard,
}) {
  const history = useHistory();
  function handleEdit(reservation_id) {
    history.push(`/reservations/${reservation_id}/edit`);
  }

  async function handleCancel(reservation_id) {
    if (
      window.confirm(
        "Do you want to cancel this reservation? This cannot be undone."
      )
    ) {
      try {
        await updateReservationStatus(reservation_id);
        await loadDashboard();
        history.push("/dashboard");
      } catch (error) {
        setReservationsError([error]);
      }
    }
  }

  return (
    <table className="table table-responsive-md table-striped table-hover">
      <thead>
        <tr>
          <th scope="col">Reservation Id</th>
          <th scope="col">First Name</th>
          <th scope="col">Last Name</th>
          <th scope="col">Mobile Number</th>
          <th scope="col">Reservation Date</th>
          <th scope="col">Reservation Time</th>
          <th scope="col">People</th>
          <th scope="col">Status</th>
          <th scope="col" colSpan="3">
            Actions
          </th>
        </tr>
      </thead>
      <tbody>
        {reservations.map((reservation) => {
          const {
            reservation_id,
            first_name,
            last_name,
            mobile_number,
            reservation_date,
            reservation_time,
            people,
            status,
          } = reservation;
          return (
            <tr key={reservation_id}>
              <td>{reservation_id}</td>
              <td>{first_name}</td>
              <td>{last_name}</td>
              <td>{mobile_number}</td>
              <td>{reservation_date}</td>
              <td>{reservation_time}</td>
              <td>{people}</td>
              <td data-reservation-id-status={reservation_id}>{status}</td>
              {status === "booked" && (
                <>
                  <td>
                    <Link to={`/reservations/${reservation_id}/seat`}>
                      Seat
                    </Link>
                  </td>
                  <td>
                    <button
                      onClick={() => handleEdit(reservation_id)}
                      type="button"
                    >
                      Edit
                    </button>
                  </td>
                </>
              )}
              {status !== "cancelled" && status !== "finished" && (
                <td data-reservation-id-cancel={reservation_id}>
                  <button
                    onClick={() => handleCancel(reservation_id)}
                    type="button"
                  >
                    Cancel
                  </button>
                </td>
              )}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

export default ReservationsList;
