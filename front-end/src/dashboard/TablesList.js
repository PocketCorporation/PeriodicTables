import React from "react";
import { deleteSeatReservation } from "../utils/api";
import { useHistory } from "react-router-dom";

function TablesList({ tables, setTablesError }) {
  const history = useHistory();
  async function handleFinish(reservation_id, table_id) {
    if (
      window.confirm(
        "Is this table ready to seat new guests? This cannot be undone."
      )
    ) {
      try {
        await deleteSeatReservation(reservation_id, table_id);
        history.push("/dashboard");
      } catch (error) {
        setTablesError([error]);
      }
    }
  }
  return (
    <table className="table table-responsive-md table-striped table-hover">
      <thead>
        <tr>
          <th scope="col">Table Id</th>
          <th scope="col">Table Name</th>
          <th scope="col">Capacity</th>
          <th scope="col">Status</th>
          <th scope="col">Action</th>
        </tr>
      </thead>
      <tbody>
        {tables.map((table) => {
          const { reservation_id, table_id, table_name, capacity, status } =
            table;
          return (
            <tr key={table_id}>
              <td>{table_id}</td>
              <td>{table_name}</td>
              <td>{capacity}</td>
              <td data-table-id-status={table_id}>{status}</td>
              {status === "occupied" && (
                <td data-table-id-finish={table_id}>
                  <button
                    onClick={() => handleFinish(reservation_id, table_id)}
                    type="button"
                  >
                    Finish
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

export default TablesList;
