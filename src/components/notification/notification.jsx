import { ToastContainer } from 'react-toastify'

const Notification = () => {
  return (
    <div className='notification'>
        <ToastContainer position="bottom-center" toastStyle={{backgroundColor:'#000000'}}/>
    </div>
  )
}

export default Notification