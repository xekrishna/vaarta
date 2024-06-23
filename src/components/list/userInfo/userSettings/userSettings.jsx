import { auth } from '../../../../lib/firebase'
import './userSettings.css'
import Settings from './settings/settings'
import React, { useState } from 'react';

const UserSettings = () => {
  const [showSettings, setShowSettings] = useState(false)

  const handleSettingsClick = () => {
    setShowSettings(true);
  };

  const handleBackClick = () => {
    setShowSettings(false);
  };

  return (
    <div className="userSettings">
      {showSettings ? (
        <Settings onBackClick={handleBackClick} />
      ) : (
        <div className="buttons">
          <button>New group</button>
          <button onClick={handleSettingsClick}>Settings</button>
          <button className='logout' onClick={() => auth.signOut()}>Log Out</button>
        </div>
      )}
    </div>
  );
};

export default UserSettings;