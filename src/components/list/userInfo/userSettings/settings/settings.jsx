import React, { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../../../../../lib/firebase';
import './settings.css';
import SettingsList from './settingsList/settingsList';
import SettingsMain from './settingsMain/settingsMain';

const Settings = ({ onBackClick }) => {
  const [selectedOption, setSelectedOption] = useState('Profile');
  const [userData, setUserData] = useState({
    avatar: '',
    username: '',
  });

  const fetchUserData = async () => {
    const user = auth.currentUser;
    if (user) {
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (userDoc.exists()) {
        setUserData(userDoc.data());
      }
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const handleOptionClick = (option) => {
    setSelectedOption(option);
  };

  const handleUserDataChange = () => {
    fetchUserData();
  };

  return (
    <div className="settings">
      <SettingsList
        onOptionClick={handleOptionClick}
        selectedOption={selectedOption}
      />
      <SettingsMain
        selectedOption={selectedOption}
        userData={userData}
        onUserDataChange={handleUserDataChange}
      />
      <button className="return" onClick={onBackClick}>
        Return
      </button>
    </div>
  );
};

export default Settings;
