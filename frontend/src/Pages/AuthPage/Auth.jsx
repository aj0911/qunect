import React, { useState } from "react";
import "./Auth.css";
import { useNavigate } from "react-router-dom";
import axios from 'axios'
import { URL_PREFIX, validateEmail } from "../../Helper/Helper";
import toast from "react-hot-toast";
import ProtectedRoute from "../../Components/ProtectedRoute";

const Auth = () => {
  //States
  const navigate = useNavigate();
  const [data,setData] = useState({email:'',password:''});

  //Methods
  //login
  const handleSubmit = async(e) => {
    e.preventDefault();
    if(data.email && data.password){
      if(validateEmail(data.email) && data.password?.length>=8){
        try{
          const res = await axios.post(`${URL_PREFIX}/login`,data);
          if(res.data?.success){
            localStorage.setItem('auth',JSON.stringify({
              isAuth:true,
              user:res.data?.data
            }));
            toast.success(res.data?.message);
            navigate('/')
          }
          console.log(data)
        }
        catch(err){
          console.log(err);
          toast.error(`Error Occured: ${err.response?.data?.message}`);
        }
      }
      else toast.error('All Details are in the correct format and length.');
    }
    else toast.error('All Details are necessary!!');
  };

  //Render
  return (
    <ProtectedRoute>
      <div className={`Auth`}>
        <div className="left">
          <div className="logo">
            <img src={require("../../Assets/logo.png")} alt="" />
            <h3>Qunect</h3>
          </div>
          <form onSubmit={(e) => handleSubmit(e)}>
            <div className="content">
              <h3>Welcome Back!</h3>
              <p>
                Qunect account and embark on your journey to connect through world.
              </p>
            </div>
            <div className="form-input">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                name="email"
                placeholder="example@example.com"
                onChange={(e)=>setData({...data,email:e.target.value})}
              />
            </div>
            <div className="form-input">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                name="password"
                placeholder="at least 8 characters"
                onChange={(e)=>setData({...data,password:e.target.value})}
              />
            </div>
            <input
              type="submit"
              value={`Log In`}
            />
            <p onClick={()=>navigate('/register')}>Create an Account?</p>
          </form>
          <p>
            &copy;{new Date(Date.now()).getFullYear()} Qunect. All Rights
            Reserved{" "}
          </p>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default Auth;
