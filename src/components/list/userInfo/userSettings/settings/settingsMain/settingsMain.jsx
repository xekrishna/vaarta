import React, { useEffect, useState } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { auth, db, storage } from '../../../../../../lib/firebase';
import './settingsMain.css';

const SettingsMain = ({ selectedOption }) => {
  const [userData, setUserData] = useState({
    avatar: '',
    username: ''
  });
  const [avatarFile, setAvatarFile] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (user) {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          setUserData(userDoc.data());
        }
      }
    };

    fetchUserData();
  }, []);

  const handleChange = (e) => {
    setUserData({
      ...userData,
      [e.target.name]: e.target.value
    });
  };

  const handleAvatarChange = (e) => {
    if (e.target.files[0]) {
      setAvatarFile(e.target.files[0]);
      setUserData({
        ...userData,
        avatar: URL.createObjectURL(e.target.files[0])
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = auth.currentUser;
    if (user) {
      const userDocRef = doc(db, 'users', user.uid);

      // Update the username
      await updateDoc(userDocRef, {
        username: userData.username
      });

      // Handle avatar upload
      if (avatarFile) {
        const avatarRef = ref(storage, `avatars/${user.uid}`);
        await uploadBytes(avatarRef, avatarFile);
        const avatarURL = await getDownloadURL(avatarRef);

        // Update the avatar URL in Firestore
        await updateDoc(userDocRef, {
          avatar: avatarURL
        });
      }

      // Optionally, you can refetch the user data to update the state
    }
  };

  let content;

  switch (selectedOption) {
    case 'Profile':
      content = (
        <div>
          <h3>Profile Settings</h3>
          <form onSubmit={handleSubmit}>
            <div className="container-profile">
              <div className="avatar">
                 <label htmlFor="file">
                   <img src={userData.avatar || './avatar.png'} alt="Avatar" />
                   Change Your Avatar
                 </label>
                 <input type="file" id='file' style={{display: 'none'}} onChange={handleAvatarChange} />
              </div>
              <div className="inputGroup">
                 <input
                   type="text"
                   name='username'
                   placeholder="Username"
                   value={userData.username}
                   onChange={handleChange}
                   required="" 
                   autoComplete="off"
                 />
                 <input
                   type="text"
                   name='about'
                   placeholder="About"
                   autoComplete="off"
                   className='about'
                 />
                 <button type="submit">Change</button>
               </div>
            </div>
          </form>
        </div>
      );
      break;
    case 'Account':
      content = <div>Account Settings</div>;
      break;
    case 'Themes':
      content = <div>Themes Settings</div>;
      break;
    case 'Privacy & Security':
      content = <div>Privacy & Security Settings</div>;
      break;
    case 'Help':
      content = <div>Help Settings</div>;
      break;
    case 'Credits':
      content = <div>Credits Settings</div>;
      break;
    default:
      content = <div>Select a setting</div>;
  }

  return <div className="settingsMain">{content}</div>;
};

export default SettingsMain;
