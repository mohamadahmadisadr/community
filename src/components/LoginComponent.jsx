import { Button, Card, TextField } from "@mui/material";
import React, { Component } from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateUser } from "../slices/userSlice";
import LoginForm from "../pages/LoginPage";
import { GoogleLogin, googleLogout } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

function LoginComponent (props) {
  const {login} = useAuth();
  const navigate = useNavigate();
  



  
 
  const handleGoogleLogin = async (credentialResponse) => {
  
    
    if (credentialResponse && credentialResponse.credential){
      const idToken = credentialResponse.credential;
      try{
        const user = jwtDecode(idToken);
        console.log(user);
        login(user);
        console.log("User logged in:", user);
        navigate("/");
        
      }catch (error) {
        console.error("Error decoding token:", error);
      }
    }else{
      console.error("No credential response received", credentialResponse);
    }
    
    
  }



    return (
     <LoginForm
        handleGoogleLogin={handleGoogleLogin}
      />
    );

}
export default LoginComponent;