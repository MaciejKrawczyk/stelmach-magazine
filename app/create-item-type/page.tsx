'use client'

import { useState } from "react";
import axios from "axios";

const Page = () => {

    const [inputList, setInputList] = useState([{ value: "", disabled: false }]);
    const [itemName, setItemName] = useState("");  // New state variable for the 'name' input

    const handleNameChange = (e) => {
        setItemName(e.target.value);
    };

    // Handler to add a new input field
    const handleAddInput = (e) => {
        e.preventDefault();
        const list = inputList.map(field => ({ ...field, disabled: true }));
        list.unshift({ value: "", disabled: false });
        setInputList(list);
    };

    // Handler to remove an input field
    const handleRemoveInput = (index, e) => {
        e.preventDefault();  // Prevent form submission
        const list = [...inputList];
        list.splice(index, 1);
        setInputList(list);
    };

    // Handler to update input value
    const handleInputChange = (e, index) => {
        const { value } = e.target;
        const list = [...inputList];
        list[index].value = value;
        setInputList(list);
    };

    // Handler to submit form
    // Handler to submit form
    const handleSubmit = async (e) => {
        e.preventDefault();

        const payload = {
            name: itemName,
            list: inputList,
        };
        // console.log(payload)
        const data = await axios.post('/api/itemtype', payload);
        console.log(data);
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                name={'name'}
                type="text"
                placeholder={"nazwa typu (np. narzędzie/tulejka...)"}
                value={itemName} // Update the value based on state
                onChange={handleNameChange}  // Update state when input changes
            />

            <div>
                <input
                    type="text"
                    value={inputList[0]?.value}
                    disabled={inputList[0]?.disabled}
                    onChange={(e) => handleInputChange(e, 0)}
                />
                <button onClick={(e) => handleAddInput(e)} disabled={!inputList[0]?.value}>Add</button>
            </div>

            {inputList.slice(1).map((inputField, index) => (
                <div key={index + 1}>
                    <input
                        type="text"
                        value={inputField.value}
                        disabled={inputField.disabled}
                        onChange={(e) => handleInputChange(e, index + 1)}
                    />
                    {inputList.length > 1 && (
                        <button onClick={(e) => handleRemoveInput(index + 1, e)}>Remove</button>
                    )}
                </div>
            ))}
            <button type="submit">Submit</button>
        </form>
    );
};

export default Page;
