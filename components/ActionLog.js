// src/components/ActionLog.js
import React from 'react';

const ActionLog = ({ actions }) => {
    return (
        <div>
            <h2>Action Log</h2>
            <ul>
                {actions.map((action, index) => (
                    <li key={index}>{action}</li>
                ))}
            </ul>
        </div>
    );
};

export default ActionLog;
