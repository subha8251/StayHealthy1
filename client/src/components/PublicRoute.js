import React from "react";
import { Navigate, useNavigate } from "react-router-dom";


function ProtectedRoute(props) {
    
  
    if (localStorage.getItem("token")) {
      return <Navigate to="/" />;
    } else {
      return props.children;
    }
  }
  
  export default ProtectedRoute;