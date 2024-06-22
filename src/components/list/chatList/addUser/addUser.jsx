import './addUser.css';
import { db } from '../../../../lib/firebase';
import { arrayUnion, collection, doc, getDoc, getDocs, query, serverTimestamp, setDoc, updateDoc, where } from 'firebase/firestore';
import { useState } from 'react';
import { useUserStore } from '../../../../lib/userStore';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AddUser = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const currentUser = useUserStore(state => state.currentUser);

  const handleSearch = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const username = formData.get('username');

    if (!currentUser) {
      setError('Current user is not set');
      return;
    }

    if (username === currentUser.username) {
      toast.error('You cannot add yourself');
      setUser(null);
      return;
    }

    try {
      const userRef = collection(db, 'users');
      const q = query(userRef, where('username', '==', username));

      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        setUser(querySnapshot.docs[0].data());
        setError(null);
      } else {
        toast.error('User not found');
        setUser(null);
      }
    } catch (error) {
      console.log(error);
      toast.error('An error occurred');
    }
  };

  const handleAdd = async () => {
    const chatRef = collection(db, 'chats');
    const userChatsRef = collection(db, 'userchats');

    try {
      const userChatsSnapshot = await getDoc(doc(userChatsRef, currentUser.id));
      const userChatsData = userChatsSnapshot.data();
      const existingChat = userChatsData?.chats?.find(chat => chat.receiverId === user.id);

      if (existingChat) {
        toast.error('Chat already exists');
        return;
      }

      const newChatRef = doc(chatRef);

      await setDoc(newChatRef, {
        createdAt: serverTimestamp(),
        messages: [],
      });

      await updateDoc(doc(userChatsRef, user.id), {
        chats: arrayUnion({
          chatId: newChatRef.id,
          lastMessage: '',
          receiverId: currentUser.id,
          updatedAt: Date.now(),
        })
      });

      await updateDoc(doc(userChatsRef, currentUser.id), {
        chats: arrayUnion({
          chatId: newChatRef.id,
          lastMessage: '',
          receiverId: user.id,
          updatedAt: Date.now(),
        })
      });

      console.log(newChatRef.id);
      setError(null);

    } catch (error) {
      console.log(error);
      setError('An error occurred while adding the chat');
    }
  };

  return (
    <div className='addUser'>
      <form onSubmit={handleSearch}>
        <input type='text' placeholder='Username' name='username' />
        <button>Search</button>
      </form>
      {error && <div className='error'>{error}</div>}
      {user && <div className='user'>
        <div className='detail'>
          <img src={user.avatar || './avatar.png'} alt='' />
          <span>{user.username}</span>
        </div>
        <button onClick={handleAdd}>Add User</button>      
      </div>}
    </div>
  );
};

export default AddUser;