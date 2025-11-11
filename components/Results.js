// src/components/Results.js

import React from 'react';

const Results = ({ results }) => {
    return (
        <div>
            <h2>Results</h2>
            <ul>
                {results.map((result, index) => (
                    <li key={index}>
                        <strong>{result.Text}</strong> <br />
                        <a href={result.FirstURL} target="_blank" rel="noopener noreferrer">
                            {result.FirstURL}
                        </a>
                        {result.Icon && result.Icon.URL && (
                            <img src={result.Icon.URL} alt={result.Text} style={{ width: '50px', height: '50px' }} />
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Results;
