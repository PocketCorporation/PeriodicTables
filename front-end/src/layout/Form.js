import React, { useState, useEffect } from 'react';
import { Link, useParams } from "react-router-dom";
import { readDeck } from '../utils/api';


function Form({ onSubmit, deckType}) {
	const [deck, setDeck] = useState({ name: '', description: '' });
	const { deckId } = useParams()
	
	function changeHandler({ target: { name, value } }) {
		setDeck((prevState) => ({
			...prevState,
			[name]: value
		}));
	}
    
	const getDeck = async() => {
        const deck = await readDeck(deckId)
       setDeck(deck)
    }

    useEffect(() => {
		if (deckType === "edit"){
			getDeck()
		}
       // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [deckType]);

	const submitHandler = (event) => {
		event.preventDefault();
		onSubmit(deck);
	}

	return (
		<>
			<form onSubmit={submitHandler} className='deck-edit'>
				<fieldset>
					<div className='form-group'>
						<label htmlFor='name'>Name</label>
						<input
							type='text'
							id='name'
							name='name'
							className='form-control'
							value={deck.name}
							required={true}
							placeholder='Deck Name'
							onChange={changeHandler}
						/>
					</div>
					<div className='form-group'>
						<label htmlFor='description'>Description</label>
						<textarea
							id='description'
							name='description'
							className='form-control'
							rows='4'
							required={true}
							placeholder='Brief description of the deck'
							value={deck.description}
							onChange={changeHandler}
						/>
					</div>
					<Link to="/"
						type='button'
						className='btn btn-secondary mr-2'
						>
						Cancel
					</Link>
					<button type='submit' className='btn btn-primary'>
						Submit
					</button>
				</fieldset>
			</form>
		</>
	);
}

export default Form;