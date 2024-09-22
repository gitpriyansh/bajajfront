import React, { useState } from 'react';
import axios from 'axios';
import Ajv from 'ajv';

const ajv = new Ajv(); // Create Ajv instance

// Define your JSON schema
const schema = {
    type: 'object',
    properties: {
        data: {
            type: 'array',
            items: { type: 'string' },
        },
        file_b64: { type: 'string' },
    },
    required: ['data'],
};

function App() {
    const [inputData, setInputData] = useState('');
    const [response, setResponse] = useState(null);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null); // Reset error

        try {
            const parsedData = JSON.parse(inputData); // Parse input JSON

            // Validate input data
            const validate = ajv.compile(schema);
            const valid = validate(parsedData);

            if (!valid) {
                throw new Error('Invalid input: ' + JSON.stringify(validate.errors));
            }

            const res = await axios.post('https://super-licorice-47b8e1.netlify.app/.netlify/functions/bfhl', parsedData);
            setResponse(res.data); // Set response data
        } catch (err) {
            setError(err.message); // Handle errors
        }
    };

    return (
        <div>
            <h1>My Frontend Application</h1>
            <form onSubmit={handleSubmit}>
                <label>
                    Input JSON:
                    <textarea
                        value={inputData}
                        onChange={(e) => setInputData(e.target.value)}
                        required
                        rows="4"
                        cols="50"
                    />
                </label>
                <button type="submit">Submit</button>
            </form>

            {response && (
                <div>
                    <h2>Response:</h2>
                    <pre>{JSON.stringify(response, null, 2)}</pre>
                </div>
            )}
            {error && (
                <div>
                    <h2>Error:</h2>
                    <pre>{error}</pre>
                </div>
            )}
        </div>
    );
}

export default App;
