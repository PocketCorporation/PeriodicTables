import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import { updateSeatReservation } from "../utils/api"
import ErrorAlert from "../layout/ErrorAlert";

export default function SeatReservation({ reservations, tables }) {
    const history = useHistory();
    const { reservation_id } = useParams();
	
	// here are the states we need to keep track of
	const [tableId, setTableId] = useState(0);
	const [errors, setErrors] = useState([]);

    useEffect(()=>{
        if(tables.length > 0){
        const table = tables[0]
        setTableId(table.table_id)}
    },[tables])

	// in case the props passed in don't exist
	if(!tables || !reservations) return null; 


	// change handler sets tableId state
	function handleChange({ target }) {
        
        const table = tables[target.value - 1]
        
		setTableId(table.table_id);
	}
    
	// submit handler does nothing as of yet
	async function handleSubmit(event) {
		event.preventDefault();

		// we will be creating a validation function as well
		
        try {
            if(validateSeat()) {
                await updateSeatReservation(tableId, reservation_id)
                history.push(`/dashboard`);
            }
        } catch(error) {
            setErrors([error])
        }
        
	}
	
	// validation function uses the same principles from my other vaidation functions in previous sections
	function validateSeat() {
		const foundErrors = [];
        console.log(tableId, "tableid");
		console.log(reservation_id, "reservation_id")
		console.log(tables, "tables");
		console.log(reservations, "res");
		// we will need to use the find method here to get the actual table/reservation objects from their ids
		const foundTable = tables.find((table) => table.table_id === tableId);
		const foundReservation = reservations.find((reservation) => reservation.reservation_id === Number(reservation_id));
		console.log(foundTable, "foundtable");
		console.log(foundReservation, "foundres");
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

		// this conditional will either return true or false based off of whether foundErrors is equal to 0
		return foundErrors.length === 0;
		
		// if you read my previous sections, you will recall that i programmed it like this previously:
		// if(foundErrors.length > 0) {
		// 	return false;
		// }
		// return true;
		
		// both my new return statement and the old return statement do the same thing. i find the one-liner more elegant.
	}
	
	// ...

  const tableOptionsJSX = () => {
	return tables.map((table) => 
		// make sure to include the value
		// the option text i have here is required for the tests as included in the instructions
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