import { useEffect, useRef, useState } from "react";
import "./chats.css";
import EmojiPicker from "emoji-picker-react";
import { Theme } from 'emoji-picker-react';
import { arrayUnion, doc, getDoc, onSnapshot, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../../lib/firebase';
import { useChatStore } from "../../lib/chatStore";
import { useUserStore } from '../../lib/userStore';
import ImageModal from './imageModal/imageModal';
import moment from 'moment';

const Chats = () => {
  const [open, setOpen] = useState(false);
  const [chat, setChat] = useState(null);
  const [text, setText] = useState("");
  const [img, setImg] = useState({
    file: null,
    url: '',
  });
  const [modalImg, setModalImg] = useState(null);
  const { chatId, user } = useChatStore();
  const { currentUser } = useUserStore();

  const endRef = useRef(null);


  useEffect(() => {
    const unSub = chatId && onSnapshot(doc(db, "chats", chatId), (res) => {
      setChat(res.data());
    });

    return () => {
      if (unSub) unSub();
    };
  }, [chatId]);

  useEffect(() => {
    endRef?.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chat]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setChat(prev => ({ ...prev }));
    }, 60000); // Update every minute

    return () => clearInterval(intervalId);
  }, []);

  const formatTimestamp = (timestamp) => {
    return moment(timestamp.toDate()).fromNow();
  };

  const handleImg = (e) => {
    if (e.target.files[0]) {
      setImg({
        file: e.target.files[0],
        url: URL.createObjectURL(e.target.files[0])
      });
    }
  };

  const handleEmoji = (e) => {
    setText(prev => prev + e.emoji);
    setOpen(false);
  };

  const uploadImage = async (file) => {
    const storageRef = ref(storage, `images/${file.name}`);
    await uploadBytes(storageRef, file);
    return await getDownloadURL(storageRef);
  };

  const handleSend = async () => {
    if (text === "" && !img.file) return;

    let imgUrl = null;

    if (img.file) {
      imgUrl = await uploadImage(img.file);
    }

    try {
      await updateDoc(doc(db, "chats", chatId), {
        messages: arrayUnion({
          senderId: currentUser.id,
          text,
          createAt: new Date(),
          ...(imgUrl && { img: imgUrl })
        }),
      });

      const userIDs = [currentUser.id, user.id];
      console.log(userIDs);

      userIDs.forEach(async id => {
        const userChatRef = doc(db, "userchats", id);
        const userChatSnapshot = await getDoc(userChatRef);

        if (userChatSnapshot.exists()) {
          const userChatsData = userChatSnapshot.data();
          const chatIndex = userChatsData.chats.findIndex(c => c.chatId === chatId);

          userChatsData.chats[chatIndex].lastMessage = text;
          userChatsData.chats[chatIndex].isSeen = id === currentUser.id ? true : false;
          userChatsData.chats[chatIndex].updatedAt = Date.now();

          await updateDoc(userChatRef, {
            chats: userChatsData.chats,
          });
        }
      });

    } catch (error) {
      console.log(error);
    }

    setImg({
      file: null,
      url: '',
    });

    setText("");
  };

  const handleImageClick = (imgSrc) => {
    setModalImg(imgSrc);
  };

  const closeModal = () => {
    setModalImg(null);
  };

  if (!user) return (
    <div className="chat no-user">Open a Chat</div>
  );

  return (
    <div className={`chat ${modalImg ? 'blur' : ''}`}>
      <div className="chat">
        <div className="top">
          <div className="user">
            <img src={user.avatar || "./avatar.png"} alt="User Avatar" />
            <div className="text">
              <span>{user.username}</span>
              <p>sshh</p>
            </div>
          </div>
          <div className="icons">
            <img src="./phone.png" alt="Phone Icon" />
            <img src="./video.png" alt="Video Icon" />
            <img src="/info.png" alt="Info Icon" />
          </div>
        </div>

        <div className="center">
          {chat?.messages?.map((message) => (
            <div className={message.senderId === currentUser?.id ? 'message own' : 'message'} key={message?.createAt}>
              <div className="texts">
                {message.img && <img src={message.img} alt="" onClick={() => handleImageClick(message.img)} />}
                <p>{message.text}</p>
                <span>{formatTimestamp(message.createAt)}</span>
              </div>
            </div>
          ))}
          {img.url && (
            <div className='message own'>
              <div className="texts">
                <img src={img.url} alt="" />
              </div>
            </div>
          )}
          <div ref={endRef}></div>
        </div>

        <div className="bottom">
          <div className="emoji">
            <img src="./emoji.png" alt="Emoji Icon" onClick={() => setOpen(prev => !prev)} />
            <div className="picker">
              <EmojiPicker open={open} onEmojiClick={handleEmoji} theme="dark" emojiStyle="native"/>
            </div>
          </div>
          <input 
            type="text" 
            placeholder="Message" 
            value={text} 
            onChange={(e) => setText(e.target.value)} 
          />
          <div className="icons">
            <label htmlFor="file">
              <img src="image.svg" alt="Image Icon" />
            </label>
            <input type="file" id="file" style={{ display: 'none' }} onChange={handleImg} />
            <img src="mic.svg" alt="Mic Icon" />
          </div>
          <button className="sendButton" onClick={handleSend}>
            <div className="svg-wrapper-1">
              <div className="svg-wrapper">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width="24"
                  height="24"
                >
                  <path fill="none" d="M0 0h24v24H0z"></path>
                  <path
                    fill="currentColor"
                    d="M1.946 9.315c-.522-.174-.527-.455.01-.634l19.087-6.362c.529-.176.832.12.684.638l-5.454 19.086c-.15.529-.455.547-.679.045L12 14l6-8-8 6-8.054-2.685z"
                  ></path>
                </svg>
              </div>
            </div>
            <span>Send</span>
          </button>
        </div>

        {modalImg && <ImageModal imgSrc={modalImg} onClose={closeModal} />}
      </div>
    </div>
  );
};

export default Chats;
