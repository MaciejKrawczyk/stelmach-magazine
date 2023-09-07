'use client'

import React, {useEffect, useState} from "react";
import {Shelves} from "@/objects/Shelves";
import {Places} from "@/objects/Places";
import axios from "axios";

const App = () => {

    const availablePlaceId = '18'


    const [formData, setFormData] = useState({
        name: "",
        description: "",
        itemType: "",
        companyId: "",
        placeId: availablePlaceId,  // Initialize placeId with the value "1"
        shelfType: "",
        typeAttributes: {}
    });

    const [typeAttributes, setTypeAttributes] = useState([]);

    const [itemTypes, setItemTypes] = useState([]);
    const [companyIds, setCompanyIds] = useState([]);
    const placeIds = Places
    const shelfIds = Object.keys(Shelves);


    useEffect(() => {
        const fetchData = async () => {
            try {

                const itemTypesResponse = await axios.get('/api/itemtype');
                const companiesResponse = await axios.get('/api/company');
                setItemTypes(itemTypesResponse.data);
                setCompanyIds(companiesResponse.data);
            } catch (error) {
                console.error("Error fetching data", error);
            }
        };
        fetchData();
    }, []);

    // New useEffect for fetching type attributes when itemType changes
    useEffect(() => {
        const fetchTypeAttributes = async () => {
            try {
                if (formData.itemType) {  // Only fetch if itemType exists
                    const response = await axios.get('/api/typeattribute', {
                        params: {
                            itemtypeId: formData.itemType
                        }
                    });
                    setTypeAttributes(response.data);
                }
            } catch (error) {
                console.error("Error fetching type attributes", error);
            }
        };
        fetchTypeAttributes();
    }, [formData.itemType]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleAttributesChange = (e) => {
        const { name, value } = e.target;

        // Update only the specific attribute value that was changed
        setFormData(prevState => ({
            ...prevState,
            typeAttributes: {
                ...prevState.typeAttributes,
                [name]: value
            }
        }));
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Check if any property value in formData is an empty string
        const isAnyFieldEmpty = Object.values(formData).some(value => value === "");

        // Check if any type attribute in formData.typeAttributes is an empty string
        const areTypeAttributesEmpty = typeAttributes.some(attribute => {
            return formData.typeAttributes[attribute.id] === undefined || formData.typeAttributes[attribute.id] === "";
        });

        if (isAnyFieldEmpty) {
            alert("Wszystkie pola muszą być wypełnione.");
            return;
        }

        if (areTypeAttributesEmpty) {
            alert("Wszystkie szczegółowe dane typu predmiotu nie mogą być puste.");
            return;
        }

        const payload = formData

        const data = await axios.post('/api/item', payload)
        console.log("Form data submitted", formData);
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>Name: </label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} />
            </div>
            <div>
                <label>Description: </label>
                <textarea name="description" value={formData.description} onChange={handleChange}></textarea>
            </div>
            <div>
                <label>Item Type: </label>
                <select name="itemType" value={formData.itemType} onChange={handleChange}>
                    <option value="" disabled>Select an item type</option>
                    {itemTypes.map((type, index) => (
                        <option key={index} value={type.id}>
                            {type.name}
                        </option>
                    ))}
                </select>
            </div>


            {typeAttributes.map((attribute, index) => (
                <div key={index}>
                    <label>{attribute.name}: </label>
                    <input
                        type="text"
                        name={attribute.id}  // make sure the name attribute corresponds to the ID of the attribute
                        onChange={handleAttributesChange}  // use the new handleAttributesChange function
                        value={formData.typeAttributes[attribute.id] || ''} // set the value from our state
                    />
                </div>
            ))}


            <div>
                <label>Company ID: </label>
                <select name="companyId" value={formData.companyId} onChange={handleChange}>
                    <option value="" disabled>Select a company ID</option>
                    {companyIds.map((company, index) => (
                        <option key={index} value={company.id}>
                            {company.name}
                        </option>
                    ))}
                </select>
            </div>
            <div>
                <label>Place ID: </label>
                <select name="placeId" value={formData.placeId} onChange={handleChange}>
                    <option value="" disabled>Select a place ID</option>
                    {Places.map((place, index) => (
                        <option key={index} value={place.id} disabled={place.id !== availablePlaceId}>
                            {place.name}
                        </option>
                    ))}
                </select>
            </div>
            <div>
                <label>Shelf Type: </label>
                <select name="shelfType" value={formData.shelfType} onChange={handleChange}>
                    <option value="" disabled>Select a shelf Type</option>
                    {shelfIds.map((id, index) => (
                        <option key={index} value={id}>
                            {id}
                        </option>
                    ))}
                </select>
            </div>

            <div>
                <button type="submit">Submit</button>
            </div>
        </form>
    );
};

export default App;
