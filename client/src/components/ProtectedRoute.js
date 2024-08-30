import React, { useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setUser, clearUser } from "../redux/userSlice";
import axios from "axios";
import { showLoading, hideLoading } from "../redux/alertsSlice";

function ProtectedRoute({ children }) {
  const { user } = useSelector((state) => state.user);
  //console.log(user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const getUser = async () => {
    dispatch(showLoading());
    try {
      const response = await axios.get("/api/user/get-user-info-by-id", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      console.log(response.data)
      dispatch(hideLoading());
      if (response.data.success) {
        dispatch(setUser(response.data.data));
      } else {
        localStorage.clear();
        dispatch(clearUser());
        navigate("/login");
      }
    } catch (error) {
      dispatch(hideLoading());
      localStorage.clear();
      dispatch(clearUser());
      navigate("/login");
    }
  };

  useEffect(() => {
    if (!user && localStorage.getItem("token")) {
      getUser();
    }
  }, [user]);

  if (localStorage.getItem("token")) {
    return children;
  } else {
    return <Navigate to="/login" />;
  }
}

export default ProtectedRoute;