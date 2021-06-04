import React from "react";
import ErrorAlert from "../layout/ErrorAlert";
import { previous, today, next } from "../utils/date-time";
import { useHistory } from "react-router-dom";
import ReservationsList from "./ReservationsList";
import TablesList from "./TablesList";

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard({
  date,
  reservations,
  tables,
  reservationsError,
  setReservationsError,
  tablesError,
  setTablesError,
  loadDashboard
}) {
  const history = useHistory();

  if (!reservations) {
    return <div></div>;
  }

  return (
    <main>
      <h1>Dashboard</h1>
      <div className="d-md-flex mb-3">
        <h4 className="mb-0">Reservations for {date}</h4>
      </div>
      <ErrorAlert error={reservationsError} />
      <ReservationsList
        reservations={reservations}
        setReservationsError={setReservationsError}
        loadDashboard={loadDashboard}
      />
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
      <TablesList tables={tables} setTablesError={setTablesError}/>
    </main>
  );
}

export default Dashboard;
