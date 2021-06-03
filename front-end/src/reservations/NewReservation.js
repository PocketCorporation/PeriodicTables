import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import ErrorAlert from "../layout/ErrorAlert";
import { createReservation } from "../utils/api";


export default function NewReservation() {
    const history = useHistory();
    const [errors, setErrors] = useState([]);
    const [formData, setFormData] = useState({
        first_name: "",
        last_name: "",
        mobile_number: "",
        reservation_date: "",
        reservation_time: "",
        people: "",
    });
    
    function validateDate() {
        const reserveDate = new Date(formData.reservation_date);
        const todaysDate = new Date();
        const foundErrors = [];
        if(reserveDate.getDay() === 1) {
            foundErrors.push({ message: "Reservations cannot be made on a Tuesday (Restaurant is closed)." });
        }
        if(reserveDate < todaysDate) {
            foundErrors.push({ message: "Reservations cannot be made in the past." });
        }
        setErrors(foundErrors);
        if(foundErrors.length > 0) {
            return false;
        }
        return true;
    }
    async function handleSubmit(event) {
        event.preventDefault(); 
        try {
            if(validateDate()) {
                await createReservation(formData)
                history.push(`/dashboard?date=${formData.reservation_date}`);
            }
        } catch(error) {
            setErrors([error])
        }
    }
    function handleChange({ target }) {
        if (target.type === "number"){
            setFormData({ ...formData, [target.name]: Number(target.value) });
        }else{
        setFormData({ ...formData, [target.name]: target.value });
        }
    }
    let ex = errors
    ex = () => {
        return errors.map((error, index) => <ErrorAlert key={index} error={error} />);
    }
    return (
        
        <form onSubmit={handleSubmit} className="form-group">
            
            {ex()}
            <label htmlFor="first_name" className="form-label">First Name: </label>
            
            <input
                className="form-control"
                name="first_name"
                id="first_name"
                type="text"
                onChange={handleChange} 
                value={formData.first_name} 
                required 
            />

            <label htmlFor="last_name" className="form-label">Last Name: </label>
            
            <input
                className="form-control"
                name="last_name"
                id="last_name"
                type="text"
                onChange={handleChange} 
                value={formData.last_name} 
                required 
            />

            <label htmlFor="mobile_number" className="form-label">Mobile Number: </label>
            
            <input
                className="form-control"
                name="mobile_number"
                id="mobile_number"
                type="tel"
                onChange={handleChange} 
                value={formData.mobile_number} 
                required 
            />

            <label htmlFor="reservation_date" className="form-label">Reservation Date: </label>
            
            <input
                className="form-control"
                name="reservation_date"
                id="reservation_date"
                type="date"
                onChange={handleChange} 
                value={formData.reservation_date} 
                required 
            />

            <label htmlFor="reservation_time" className="form-label">Reservation Time: </label>
            
            <input
                className="form-control"
                name="reservation_time"
                id="reservation_time"
                type="time"
                onChange={handleChange} 
                value={formData.reservation_time} 
                required 
            />

            <label htmlFor="people" className="form-label">People: </label>
            
            <input
                className="form-control"
                name="people"
                id="people"
                type="number"
                min={1}
                step={1}
                onChange={handleChange} 
                value={formData.people} 
                required 
            />

            <button type="submit" onClick={handleSubmit}>Submit</button>
            <button type="button" onClick={history.goBack}>Cancel</button>
            
        </form>
    );
}