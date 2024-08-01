import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const ProtectedRoute = ({children}) => {
  //States
  const auth = JSON.parse(localStorage.getItem('auth')) || {isAuth:false,user:null};
  const navigate = useNavigate();
  const {pathname} = useLocation();

  //Rendering
  useEffect(() => {
    console.log(auth)
    if (!auth.isAuth){
      if(pathname==='/register')navigate('/register')
      else navigate("/login");
    }
    else navigate('/');
  }, []);

  return <>{children}</>;
};

export default ProtectedRoute;
