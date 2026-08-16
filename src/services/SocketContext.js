// src/services/SocketContext.js
import React, {
  createContext,
  useContext,
  useRef,
  useState,
  useEffect,
} from "react";
import { io } from "socket.io-client";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch } from "react-redux";
import {
  updateRideStatus,
  updateDriverLocation,
  setDriver,
  updateETA,
  setCurrentRide,
  resetRide,
} from "@/features/ride/rideSlice";

const SocketContext = createContext(null);

// Android emulator: 10.0.2.2 | Real device: your local IP
// const SOCKET_URL = "http://10.0.2.2:8000";
const SOCKET_URL = "http://192.168.0.101:8000"; // for mobile

export const SocketProvider = ({ children }) => {
  const socketRef = useRef(null);
  const [connected, setConnected] = useState(false);
  const dispatch = useDispatch();

  const connect = async () => {
    const token = await AsyncStorage.getItem("token");
    if (!token) {
      console.warn("[Socket] No token – skip connect");
      return;
    }
    if (socketRef.current?.connected) return;

    // clean old instance
    if (socketRef.current) {
      socketRef.current.removeAllListeners();
      socketRef.current.disconnect();
      socketRef.current = null;
    }

    socketRef.current = io(SOCKET_URL, {
      auth: { token, role: "passenger" },
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionDelay: 2000,
      reconnectionDelayMax: 10000,
      reconnectionAttempts: 30,
      timeout: 20000,
      forceNew: true,
    });

    const s = socketRef.current;

    s.on("connect", () => {
      setConnected(true);
      console.log("[Socket] Passenger connected:", s.id);
    });

    s.on("connect_error", (err) => {
      setConnected(false);
      console.warn("[RubelSocket] Passenger connect_error:", err.message);
    });

    s.on("disconnect", (reason) => {
      setConnected(false);
      console.log("[Socket] Passenger disconnected:", reason);
      if (reason === "io server disconnect") {
        s.connect();
      }
    });

    // ───── Ride lifecycle ─────
    s.on("ride:driver_found", (data) => {
      console.log("[Socket] driver_found", data);
      if (data?.driver) dispatch(setDriver(data.driver));
      if (data?.ride) dispatch(setCurrentRide(data.ride));
      dispatch(updateRideStatus("accepted"));
    });

    s.on("ride:driver_location", (data) => {
      if (data?.location) dispatch(updateDriverLocation(data.location));
      if (data?.eta != null) dispatch(updateETA(data.eta));
    });

    s.on("ride:driver_arrived", (data) => {
      console.log("[Socket] driver_arrived");
      if (data?.ride) dispatch(setCurrentRide(data.ride));
      dispatch(updateRideStatus("pickup"));
    });

    s.on("ride:started", (data) => {
      console.log("[Socket] ride started");
      if (data?.ride) dispatch(setCurrentRide(data.ride));
      dispatch(updateRideStatus("ongoing"));
    });

    s.on("ride:completed", (data) => {
      console.log("[Socket] ride completed");
      if (data?.ride) dispatch(setCurrentRide(data.ride));
      dispatch(updateRideStatus("completed"));
    });

    s.on("ride:cancelled", (data) => {
      console.log("[Socket] ride cancelled", data);
      dispatch(updateRideStatus("cancelled"));
    });

    s.on("ride:passenger_cancelled", () => {
      dispatch(updateRideStatus("cancelled"));
    });

    s.on("ride:no_drivers", () => {
      console.log("[Socket] no drivers");
      dispatch(updateRideStatus("no_drivers"));
    });
  };

  const disconnect = () => {
    if (socketRef.current) {
      socketRef.current.removeAllListeners();
      socketRef.current.disconnect();
      socketRef.current = null;
    }
    setConnected(false);
  };

  const emit = (event, data) => {
    if (!socketRef.current?.connected) {
      console.warn("[Socket] emit skipped – not connected:", event);
      return;
    }
    socketRef.current.emit(event, data);
  };

  // cleanup on unmount
  useEffect(() => {
    return () => disconnect();
  }, []);

  return (
    <SocketContext.Provider
      value={{
        connected,
        connect,
        disconnect,
        emit,
        socket: socketRef,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
