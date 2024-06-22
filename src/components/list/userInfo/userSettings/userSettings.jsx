import { auth } from '../../../../lib/firebase'
import './userSettings.css'

const UserSettings = () => {
  return (
      <div className="userSettings">
        <h1>User Settings</h1>
        <div className="buttons">
          <button>Change Password</button>
          <button>Change Username</button>
          <button>Change Theme</button>
          <button className='logout' onClick={()=>auth.signOut()}>Log Out</button>
        </div>
        
      </div>
  )
}

export default UserSettings