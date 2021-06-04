import React, { useState, useEffect } from "react";

import { Redirect, Route, Switch, useRouteMatch } from "react-router-dom";
import Dashboard from "../dashboard/Dashboard";
import NotFound from "./NotFound";
import { today } from "../utils/date-time";
import NewReservation from "../reservations/NewReservation";
import EditReservation from "../reservations/EditReservation";
import SeatReservation from "../reservations/SeatReservation";
import NewTable from "../tables/NewTable";
import Search from "../search/Search";
import useQuery from "../utils/useQuery";
import { listReservations, listTables } from "../utils/api";

/**
 * Defines all the routes for the application.
 *
 * You will need to make changes to this file.
 *
 * @returns {JSX.Element}
 */
function Routes() {
  const url = useRouteMatch();
  const query = useQuery();
  const date = query.get("date");
  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);

  const [tables, setTables] = useState([]);
  const [tablesError, setTablesError] = useState(null);

  useEffect(loadDashboard, [url, date]);

  function loadDashboard() {
    const abortController = new AbortController();
    setReservationsError(null);
    setTablesError(null);
    listTables().then(setTables).catch(setTablesError);
    if (date) {
      listReservations({ date }, abortController.signal)
        .then(setReservations)
        .catch(setReservationsError);
    }
    return () => abortController.abort();
  }
  return (
    <Switch>
      <Route exact={true} path="/">
        <Redirect to={"/dashboard"} />
      </Route>
      <Route exact={true} path="/reservations">
        <Redirect to={"/dashboard"} />
      </Route>
      <Route path="/dashboard">
        <Dashboard
          date={date ? date : today()}
          reservations={reservations}
          reservationsError={reservationsError}
          tables={tables}
          tablesError={tablesError}
          setReservationsError={setReservationsError}
          setTablesError={setTablesError}
          loadDashboard={loadDashboard}
        />
      </Route>
      <Route exact={true} path="/reservations/new">
        <NewReservation />
      </Route>
      <Route exact={true} path="/reservations/:reservation_id/edit">
        <EditReservation />
      </Route>
      <Route exact={true} path="/tables/new">
        <NewTable />
      </Route>
      <Route exact={true} path="/reservations/:reservation_id/seat">
        <SeatReservation reservations={reservations} tables={tables} />
      </Route>
      <Route exact={true} path="/search">
        <Search />
      </Route>
      <Route>
        <NotFound />
      </Route>
    </Switch>
  );
}

export default Routes;
