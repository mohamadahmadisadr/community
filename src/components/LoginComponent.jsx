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
        login(user);
        navigate("/");

      }catch (error) {
        // Handle error silently in production
      }
    }else{
      // Handle error silently in production
    }
    
    
  }



    return (
     <LoginForm
        handleGoogleLogin={handleGoogleLogin}
      />
    );

}
export default LoginComponent;