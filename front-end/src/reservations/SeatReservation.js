import React, { useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { updateSeatReservation } from "../utils/api"
import ErrorAlert from "../layout/ErrorAlert";

export default function SeatReservation({ reservations, tables }) {
    const history = useHistory();
    const { reservation_id } = useParams();
	
	const [tableId, setTableId] = useState(0);
	const [errors, setErrors] = useState([]);

	if(!tables || !reservations) return null; 


	function handleChange({ target }) {
		setTableId(target.value);
	}
    
	async function handleSubmit(event) {
		event.preventDefault();
		
        try {
            if(validateSeat()) {
                await updateSeatReservation(tableId, reservation_id)
                history.push(`/dashboard`);
            }
        } catch(error) {
            setErrors([error])
        }
        
	}
	
	function validateSeat() {
		const foundErrors = [];
		const foundTable = tables.find((table) => table.table_id === Number(tableId));
		const foundReservation = reservations.find((reservation) => reservation.reservation_id === Number(reservation_id));
		if(!foundTable) {
			foundErrors.push({message: "The table you selected does not exist."});
		}
		else if(!foundReservation) {
			foundErrors.push("This reservation does not exist.")
		}
		else {
			if(foundTable.status === "occupied") {
				foundErrors.push({message: "The table you selected is currently occupied."})
			}

			if(foundTable.capacity < foundReservation.people) {
				foundErrors.push({message: `The table you selected cannot seat ${foundReservation.people} people.`})
			}
		}

		setErrors(foundErrors);

		return foundErrors.length === 0;
	
		
	}
	

  const tableOptionsJSX = () => {
	return tables.map((table) => 
		<option value={table.table_id}>{table.table_name} - {table.capacity}</option>);
    };

    const listErrors = () => {
        return errors.map((error, index) => {
			console.log(error, "error")
		return <ErrorAlert key={index} error={error} />});
    }
	return (
        
        <form>
			{listErrors()}
            <label htmlFor="table_id">Choose table:</label>
            <select 
                name="table_id" 
                id="table_id"
                value={tableId}
	            onChange={handleChange}
            >
                {tableOptionsJSX()}
            </select>
    
            <button type="submit" onClick={handleSubmit}>Submit</button>
            <button type="button" onClick={history.goBack}>Cancel</button>
        </form>
    );
}