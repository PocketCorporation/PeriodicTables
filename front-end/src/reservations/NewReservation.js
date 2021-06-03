import React, { useState } from "react";
import { useHistory } from "react-router-dom";

export default function NewReservation() {
    const history = useHistory();
    const [formData, setFormData] = useState({
        first_name: "",
        last_name: "",
        mobile_number: "",
        reservation_date: "",
        reservation_time: "",
        people: 0,
    });
    function validateDate() {
       const reserveDate = new Date(formData.reservation_date);
        
        const foundErrors = [];
        
        if(reserveDate.getDay() === 2) {
            foundErrors.push({ message: "Reservations cannot be made on a Tuesday (Restaurant is closed)." });
        }
    }
    function handleSubmit(event) {
        event.preventDefault(); 
        history.push(`/dashboard?date=${formData.reservation_date}`);
    }
    function handleChange({ target }) {
        setFormData({ ...formData, [target.name]: target.value });
        
    }
    return (
        <form>
            
            <label htmlFor="first_name">First Name: </label>
            
            <input
                name="first_name"
                id="first_name"
                type="text"
                onChange={handleChange} 
                value={formData.first_name} 
                required 
            />
            
            <button type="submit" onClick={handleSubmit}>Submit</button>
            <button type="button" onClick={history.goBack}>Cancel</button>
            
        </form>
    );
}