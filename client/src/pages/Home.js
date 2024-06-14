import axios from "axios";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { logout, setOnlineUser, setUser } from "../redux/userSlice";
import Sidebar from "../components/Sidebar";
import { useSocket } from "../SocketContext";

const Home = () => {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const socket = useSocket();

  console.log("user", user);

  const fetchUserDetails = async () => {
    try {
      const URL = `https://linkup-1nps.onrender.com/api/user-details`;
      const response = await axios({
        url: URL,
        withCredentials: true,
      });

      if (response.data.data.logout) {
        dispatch(logout());
        navigate("/email");
      } else {
        dispatch(setUser(response.data.data));
      }

      console.log("current user Details", response);
    } catch (error) {
      console.log("error", error);
      dispatch(logout());
      navigate("/email");
    }
  };

  useEffect(() => {
    fetchUserDetails();
  }, []);

  useEffect(() => {
    if (!user) {
      navigate("/email");
    }
  }, [user, navigate]);

  useEffect(() => {
    if (socket) {
      socket.on("onlineUser", (data) => {
        console.log(data);
        dispatch(setOnlineUser(data));
      });

      return () => {
        socket.off("onlineUser");
      };
    }
  }, [socket, dispatch]);

  const basePath = location.pathname === "/";
  return (
    <div className="grid lg:grid-cols-[300px,1fr] h-screen max-h-screen bg-gray-900">
      <section className={`bg-gray-800 ${!basePath && "hidden"} lg:block`}>
        <Sidebar />
      </section>

      {/**message component**/}
      <section className={`${basePath && "hidden"} bg-gray-900`}>
        <Outlet />
      </section>

      <div
        className={`justify-center items-center flex-col gap-2 hidden ${
          !basePath ? "hidden" : "lg:flex"
        }`}
      >
        <p className="text-lg mt-2 text-gray-400">
          Select user to send message
        </p>
      </div>
    </div>
  );
};

export default Home;
