import React, { useState } from "react";
import ReservationsList from "../dashboard/ReservationsList";
import ErrorAlert from "../layout/ErrorAlert";
import { listReservations } from "../utils/api";

function Search() {
  const [reservations, setReservations] = useState([]);
  const [formData, setFormData] = useState({
    mobile_number: "",
  });
  const [error, setError] = useState(null);

  function handleChange({ target }) {
    setFormData({ ...formData, [target.name]: Number(target.value) });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    try {
      const reservations = await listReservations({
        mobile_number: formData.mobile_number,
      });
      setReservations(reservations);
    } catch (error) {
      setError(error);
    }
  }
  return (
    <main>
      {error && <ErrorAlert error={error} />}
      <form onSubmit={handleSubmit} className="form-group">
        <h2>Search</h2>
        <label htmlFor="mobile_number" className="form-label">
          Phone Number:{" "}
        </label>

        <input
          className="form-control"
          name="mobile_number"
          id="mobile_number"
          type="tel"
          placeholder="Enter a customer's phone number"
          onChange={handleChange}
          value={formData.mobile_number}
          required
        />
        <button type="submit">Find</button>
      </form>
      {reservations.length > 0 && (
        <ReservationsList reservations={reservations} />
      )}
      {reservations.length < 1 && <p> No reservations found</p>}
    </main>
  );
}

export default Search;
