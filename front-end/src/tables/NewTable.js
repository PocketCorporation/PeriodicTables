import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import ErrorAlert from "../layout/ErrorAlert";
import { createTable } from "../utils/api";

export default function NewReservation() {
    const history = useHistory();
    const [errors, setErrors] = useState([]);
    const [formData, setFormData] = useState({
        table_name: "",
        capacity: "",
    });
    
    function validateDate() {
        const reserveDate = new Date(formData.reservation_date);
        const todaysDate = new Date();
        const foundErrors = [];
        
        if(reserveDate.getDay() === 2) {
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
             
                await createTable(formData)
                history.push(`/dashboard`);
         
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
            <label htmlFor="table_name" className="form-label">Table Name: </label>
            
            <input
                className="form-control"
                name="table_name"
                id="table_name"
                type="text"
                onChange={handleChange} 
                value={formData.table_name} 
                required 
            />

            <label htmlFor="capacity" className="form-label">Capacity: </label>
            
            <input
                className="form-control"
                name="capacity"
                id="capacity"
                type="number"
                min={1}
                onChange={handleChange} 
                value={formData.capacity} 
                required 
            />

    

            <button type="submit" onClick={handleSubmit}>Submit</button>
            <button type="button" onClick={history.goBack}>Cancel</button>
            
        </form>
    );
    }