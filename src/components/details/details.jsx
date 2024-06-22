import "./details.css";
import { useEffect, useState } from "react";
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useChatStore } from "../../lib/chatStore";

const Details = () => {
  const { chatId, user } = useChatStore();
  const [chat, setChat] = useState(null);

  useEffect(() => {
    if (!chatId) return;
    const unSub = onSnapshot(doc(db, "chats", chatId), 
    (res) => {
      setChat(res.data());
    });

    return () => {
      unSub();
    };
  }, [chatId]);

  if (!user) return <div className="detail no-user">...</div>;

  return (
    <div className="detail">
      <div className="user">
        <img src={user.avatar || "./avatar.png"} alt="User Avatar" />
        <h2>{user.username || 'No User'}</h2>
        <p>Glob glob</p>
      </div>
      <div className="info">
        <div className="options">
          <div className="title">
            <span>Chat Setting</span>
            <img src="./arrowUp.png" alt="" />
          </div>
        </div>
        <div className="options">
          <div className="title">
            <span>Privacy & Help</span>
            <img src="./arrowUp.png" alt="" />
          </div>
        </div>
        <div className="options">
          <div className="title">
            <span>Shared Photos</span>
            <img src="./arrowDown.png" alt="" />
          </div>
          <div className="photos">
            <div className="photoItem">
              <div className="photoDetail">
                <img src="./message1.svg" alt="" />
                <span>photo_2024.png</span>
              </div>
              <img src="./download.png" alt="" className="icon" />
            </div>                    
          </div>
        </div>
        <div className="options">
          <div className="title">
            <span>Shared Files</span>
            <img src="./arrowDown.png" alt="" />
          </div>
        </div>
        <button>Block User</button>
      </div>
    </div>
  );
};

export default Details;
