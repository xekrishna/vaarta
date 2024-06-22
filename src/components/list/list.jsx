import ChatList from "./chatList/chatList";
import "./list.css"
import UserInfo from "./userInfo/userInfo";

const List = () => {
    return(
        <div className="list">
            <ChatList/>
            <UserInfo/>
        </div>
    )
}

export default List;