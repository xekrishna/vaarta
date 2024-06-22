import UserSettings from './userSettings/userSettings'
import './userInfo.css'
import { useState } from 'react'
import { useUserStore} from '../../../lib/userStore'

function UserInfo(){
  const [addMode, setAddMode] = useState(false)

  const {currentUser} = useUserStore()

  return (
    <div className='userInfo'>
        <div className="user">
            <img src={currentUser.avatar || "./avatar.png"} alt="" />
            <h2>{currentUser.username}</h2>
        </div>
        <div className="icons">
            <img src="./more.png" alt="" onClick={() => setAddMode((prev) => (!prev))}/>
        </div>
        {addMode && <UserSettings/>}
    </div>
  )
}

export default UserInfo