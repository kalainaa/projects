// src/components/Tabs.js
import React from 'react';
import Maps from './Maps'; 

const Tabs = ({ activeTab, setActiveTab }) => {
    return (
        <div>
            <div className="tabs">
                <button onClick={() => setActiveTab('scraper')}>Scraper</button>
                <button onClick={() => setActiveTab('actionLog')}>Action Log</button>
                <button onClick={() => setActiveTab('workspace')}>Workspace</button>
                <button onClick={() => setActiveTab('map')}>Map</button> {/* New Map Tab */}
            </div>
            <div className="tab-content">
                {activeTab === 'scraper' && <div>Scraper Content</div>}
                {activeTab === 'actionLog' && <div>Action Log Content</div>}
                {activeTab === 'workspace' && <div>Workspace Content</div>}
                {activeTab === 'map' && (
                    <Maps onExit={() => setActiveTab('scraper')} /> // Pass onExit function
                )}
            </div>
        </div>
    );
};

export default Tabs;
