import React from "react";
import { deleteSeatReservation, updateReservationStatus } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import { previous, today, next } from "../utils/date-time";
import { useHistory, Link } from "react-router-dom";

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard({ date, reservations, tables, reservationsError, setReservationsError, tablesError, setTablesError }) {
 
  const history = useHistory();


  if (!reservations) {
    return <div></div>;
  }
  async function handleFinish(reservation_id, table_id) {
    console.log(reservation_id, "reservation_id");
    console.log(table_id, "table_id")
		if(window.confirm("Is this table ready to seat new guests? This cannot be undone.")) {
			// delete request here, we will add this later
      try{
        await deleteSeatReservation(reservation_id, table_id)
        history.push("/dashboard");
      } catch (error){
        setTablesError([error])
      }
		}
  }

  function handleEdit(reservation_id){
    history.push(`/reservations/${reservation_id}/edit`);
  }

  async function handleCancel(reservation_id){
    if(window.confirm("Do you want to cancel this reservation? This cannot be undone.")) {
      try{
        await updateReservationStatus(reservation_id)
        history.push("/dashboard");
      } catch (error){
        setTablesError([error])
      }
		}
  }

  return (
    <main>
      <h1>Dashboard</h1>
      <div className="d-md-flex mb-3">
        <h4 className="mb-0">Reservations for {date}</h4>
      </div>
      <ErrorAlert error={reservationsError} />

      <table className="table table-responsive-md table-striped table-hover">
        <thead>
          <th scope="col">Reservation Id</th>
          <th scope="col">First Name</th>
          <th scope="col">Last Name</th>
          <th scope="col">Mobile Number</th>
          <th scope="col">Reservation Date</th>
          <th scope="col">Reservation Time</th>
          <th scope="col">People</th>
          <th scope="col">Status</th>
          <th scope="col" colSpan="3">Actions</th>
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
console.log(status, "status")
            return (
              <tr>
                <td>{reservation_id}</td>
                <td>{first_name}</td>
                <td>{last_name}</td>
                <td>{mobile_number}</td>
                <td>{reservation_date}</td>
                <td>{reservation_time}</td>
                <td>{people}</td>
                <td data-reservation-id-status={reservation_id}>{status}</td>
                {status === "booked" && <td>
                  <Link to={`/reservations/${reservation_id}/seat`}>
                    Seat
                  </Link>
                </td>}
                {status !== "cancelled" && status !== "finished" && <><td >
                    <button onClick={()=>handleEdit(reservation_id)} type="button">
                      Edit
                    </button>
                  </td>
                  <td data-reservation-id-cancel={reservation_id}>
                    <button onClick={()=>handleCancel(reservation_id)} type="button">
                      Cancel
                    </button>
                  </td></>}
              </tr>
            );
          })}
        </tbody>
      </table>

      <button
        type="button"
        onClick={() => history.push(`/dashboard?date=${previous(date)}`)}
      >
        Previous
      </button>
      <button
        type="button"
        onClick={() => history.push(`/dashboard?date=${today()}`)}
      >
        Today
      </button>
      <button
        type="button"
        onClick={() => history.push(`/dashboard?date=${next(date)}`)}
      >
        Next
      </button>
      <div className="mt-4">
        <h2>Tables</h2>
      </div>
      <ErrorAlert error={tablesError} />
      <table className="table table-responsive-md table-striped table-hover">
        <thead>
          <th scope="col">Table Id</th>
          <th scope="col">Table Name</th>
          <th scope="col">Capacity</th>
          <th scope="col">Status</th>
          <th scope="col">Action</th>

        </thead>
        <tbody>
          {tables.map((table) => {
            const { reservation_id, table_id, table_name, capacity, status } = table;
            return (
              <tr>
                <td>{table_id}</td>
                <td>{table_name}</td>
                <td>{capacity}</td>
                <td data-table-id-status={table_id}>{status}</td>
                {status === "occupied" && (
                  <td data-table-id-finish={table_id}>
                    <button onClick={()=>handleFinish(reservation_id, table_id)} type="button">
                      Finish
                    </button>
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </main>
  );
}

export default Dashboard;
