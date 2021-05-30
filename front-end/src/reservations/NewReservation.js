import React, { useState } from "react";
import { useHistory } from "react-router-dom";

export default function NewReservation() {
    const history = useHistory();
	// recall that useState takes the form [state, setState], where setState is an asynchronous function
	const [formData, setFormData] = useState({
        first_name: "",
        last_name: "",
        mobile_number: "",
        reservation_date: "",
        reservation_time: "",
        people: 0,
    });
    function handleSubmit(event) {
        event.preventDefault(); 
        history.push(`/dashboard?date=${formData.reservation_date}`);
    }
    function handleChange({ target }) { // i deconstruct the `event` argument
        // we will be using our useState hook to store whatever changes are made.
        // this is why we use underscore case; when we access target, we get the input name in underscore_case.
        setFormData({ ...formData, [target.name]: target.value });
        // remember to use the spread operator `...` so all previous values do not get overwritten.
    }
    return (
        <form>
            { /* use the following as a template for your input fields: */ }
            <label htmlFor="first_name">First Name:&nbsp;</label>
            { /* &nbsp; is a fancy way for HTML to place a space instead. it stands for "non-breakable space". i used it because i found the label and the input box were too close together. */ }
            
            <input
                name="first_name"
                id="first_name"
                type="text"
                onChange={handleChange} // we will add this in soon!
                value={formData.first_name} // this as well!
                required // this will make the field non-nullable
            />
            
            { /* now to make the rest of them! */ }
            <button type="submit" onClick={handleSubmit}>Submit</button>
            <button type="button" onClick={history.goBack}>Cancel</button>
            
        </form>
    );
}