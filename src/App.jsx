import { useEffect } from "react";
import './app.css'
import Chats from "./components/chats/chats";
import Details from "./components/details/details";
import List from "./components/list/list";
import Login from "./components/login/login";
import Notification from "./components/notification/notification";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./lib/firebase";
import { useUserStore } from "./lib/userStore";
import { useChatStore } from "./lib/chatStore";

const App = () => {

  const { currentUser, isLoading, fetchUserInfo } = useUserStore();
  const { chatId } = useChatStore();

  useEffect(() => {
    const unSub = onAuthStateChanged(auth, (user) => {
      fetchUserInfo(user?.uid);
    });

    return () => {
      unSub();
    };
  }, [fetchUserInfo]);

  if (isLoading) return (
    <div className='loader'>
      <li className="ball"></li>
      <li className="ball"></li>
      <li className="ball"></li>
    </div>
  );

  return (
    <div className='container'>
      {
        currentUser ? (
          <div className="main-content">
            <List />
            <Chats />
            <Details />
          </div>
        ) : (
          <Login />
        )
      }
      <Notification />
    </div>
  );
}

export default App;