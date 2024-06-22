import { useState } from 'react'
import './login.css'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {createUserWithEmailAndPassword, signInWithEmailAndPassword} from 'firebase/auth';
import { auth, db } from '../../lib/firebase';
import { doc, setDoc } from "firebase/firestore"; 
import upload from '../../lib/upload';



const Login = () => {
    
    const [avatar, setAvatar] = useState({
        file : null,
        url : ""
    });

    const[loading,setLoading] = useState(false);

    const [showSignIn, setShowSignIn] = useState(true);

    const handleAvatar = (e) => {
        if (e.target.files[0]){
            setAvatar({
            file : e.target.files[0],
            url : URL.createObjectURL(e.target.files[0])
        })}
    };

    const handleRegister = async (e) => {
        e.preventDefault()
        const formData = new FormData(e.target)

        const { username, email, password} = Object.fromEntries(formData)
        
        try {
            const imgUrl = await upload(avatar.file)

            const res = await createUserWithEmailAndPassword(auth, email, password)

            await setDoc(doc(db, "users", res.user.uid), {
              username,
              email,
              avatar: imgUrl,
              id: res.user.uid,
              blocked: [],
            });

            await setDoc(doc(db, "userchats", res.user.uid), {
                chats: [],
              });

            toast.success("Account Created! You Can Login Now")


        } catch (err) {
            console.log(err)
            toast.error(err.message)
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData(e.target);
        const {email, password} = Object.fromEntries(formData);
        
        try {
            await signInWithEmailAndPassword(auth, email, password);
            
        } catch (err) {
            console.log(err);
            toast.error(err.message);
        }
        finally{
            setLoading(false);
        }
    };


    const handleCreateAccount = () => {
        setShowSignIn(false);
    };

    const handleAlreadyHaveAccount = () => {
        setShowSignIn(true);
    };


  return (
    <div className='login'>
        <div className={`item sign-in ${showSignIn ? 'active' : 'inactive'}`}>
            <h2>Welcome Back</h2>
            <p>Welcome to Vaarta <br />Login using your credentials to keep using the service</p>
            <form onSubmit={handleSubmit}>
                <div className="inputGroup">
                    <input type="text" name='email' placeholder='Email' required="" autoComplete="off"/>
                    <label htmlFor="name">Email</label>
                </div>
                <div className="inputGroup">
                    <input type="password" name='password' placeholder='Password' required="" autoComplete="off"/> 
                    <label htmlFor="name">Password</label>
                </div>                 
                <a href="#">Forgot Password</a>               
                <button>Log In</button>
                <a style={{margin:'10px 0 0 0'}} onClick={handleCreateAccount}>Create New Account</a>
            </form>
        </div>
        <div className={`item sign-up ${showSignIn ? 'inactive' : 'active'}`}>
            <h2>Create New Account</h2>
            <p>Welcome to Vaarta <br />Enter your details to start using our service</p>
            <form onSubmit={handleRegister}>               
                <label htmlFor="file"  className='avatar-selector'>
                    <img src={avatar.url || './avatar.png'} alt="" />
                    Upload an image</label>
                <input type="file" id='file' style={{display:"none"}} onChange={handleAvatar}/>
                <div className="inputGroup">
                    <input type="text" name='username' placeholder='Username' required="" autoComplete="off"/> 
                    <label htmlFor="name">Username</label>
                </div>
                <div className="inputGroup">
                    <input type="text" name='email' placeholder='Email' required="" autoComplete="off"/>
                    <label htmlFor="name">Email</label>
                </div>
                <div className="inputGroup">
                    <input type="password" name='password' placeholder='Password' required="" autoComplete="off"/> 
                    <label htmlFor="name">Password</label>
                </div>
                <button>Sign Up</button>                  
                <a onClick={handleAlreadyHaveAccount}>Already have an account?</a>                
            </form>
        </div>
    </div>
  )
}

export default Login