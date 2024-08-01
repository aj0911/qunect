import React, { useState } from "react";
import "./Auth.css";
import { useNavigate } from "react-router-dom";
import ProtectedRoute from "../../Components/ProtectedRoute";
import { URL_PREFIX, validateEmail } from "../../Helper/Helper";
import axios from "axios";
import toast from "react-hot-toast";

const Register = () => {
  //States
  const navigate = useNavigate();
  const [data,setData] = useState({email:'',name:'',password:''});

  //Methods
  const handleSubmit = async(e) => {
    e.preventDefault();
    if(data.email && data.password && data.name){
      if(validateEmail(data.email) && data.password?.length>=8){
        try{
          const res = await axios.post(`${URL_PREFIX}/register`,data);
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
              <h3>Hello 👋</h3>
              <p>
                It's time to connect with the world and start making friends.
              </p>
            </div>
            <div className="form-input">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                onChange={(e)=>setData({...data,name:e.target.value})}
              />
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
              value={`Register`}
            />
            <p onClick={()=>navigate('/login')}>Already have an Account?</p>
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


export default Register