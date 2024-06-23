import React, { useEffect, useRef } from 'react';
import './settingsList.css';

const SettingsList = ({ onOptionClick }) => {
  const options = [
    'Profile',
    'Account',
    'Themes',
    'Privacy & Security',
    'Help',
    'Credits',
  ];

  const profileRef = useRef(null);

  useEffect(() => {
    if (profileRef.current) {
      profileRef.current.focus();
    }
  }, []);

  return (
    <div className="settingsList">
      <h2>Settings</h2>
      {options.map((option) => (
        <div
          key={option}
          className="item"
          tabIndex={0}
          onClick={() => onOptionClick(option)}
          ref={option === 'Profile' ? profileRef : null}
        >
          <p>{option}</p>
        </div>
      ))}
    </div>
  );
};

export default SettingsList;
