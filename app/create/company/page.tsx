'use client'

import React, { useState } from 'react';
import axios from "axios";
import SubmitButton from "@/components/submitButton";
import SuccessModal from "@/components/SuccessModal";
import config from '../../../config.json'

const MyForm = () => {
    // Initialize state variables for the two text inputs
    const [name, setName] = useState('');
    const [notes, setNotes] = useState('');

    // submit button
    const [isClicked, setIsClicked] = useState(false);

    // success modal
    const [isOpen, setIsOpen] = useState(false);
    const [object, setObject] = useState([]);

    // Function to handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Check for empty strings
        if (name.trim() === '' || notes.trim() === '') {
            alert("Pola nie mogą być puste!");
            return;
        }

        setIsClicked(true);
        setIsOpen(false);

        const payload = {
            name: name,
            notes: notes,
        };

        const data = await axios.post('/api/company', payload);
        setObject(data.data);
        console.log(data);

        setIsOpen(true);
        setIsClicked(false);

        setName('');
        setNotes('');
    };


    return (<>

        <SuccessModal
            isOpen={isOpen}
            text={config.ui.successModal.messages.company.smallText}
            objectData={object}
            bigText={config.ui.successModal.messages.company.bigText}
        />

        <form onSubmit={handleSubmit}>
            <div>
                <label htmlFor="name">Name:</label>
                <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
            </div>
            <div>
                <label htmlFor="notes">Notes:</label>
                <input
                    type="text"
                    id="notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                />
            </div>
            <SubmitButton isClicked={isClicked} />
            {/*<button type="submit">Submit</button>*/}
        </form>

        </>
    );
};

export default MyForm;
