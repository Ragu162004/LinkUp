import React, { createContext, useContext, useEffect, useState } from "react";
import io from "socket.io-client";

const SocketContext = createContext(null);

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const socketConnection = io("https://linkup-1nps.onrender.com", {
      auth: {
        token,
      },
      transports: ["websocket", "polling"], // Ensure both transports are allowed
      reconnectionAttempts: 5, // Retry connection attempts
    });

    socketConnection.on("connect_error", (error) => {
      console.error("Connection Error:", error);
    });

    setSocket(socketConnection);

    return () => {
      socketConnection.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};
