// src/services/DriverSocketContext.js
import React, {
  createContext,
  useContext,
  useRef,
  useState,
  useEffect,
} from "react";
import { io } from "socket.io-client";
import { Vibration } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch } from "react-redux";
import {
  setIncomingRide,
  clearIncomingRide,
  setRideStatus,
  setCurrentLocation,
  setActiveRide,
  setPassenger,
  rideAccepted,
  rideStarted,
  rideCompleted,
  clearActiveRide,
} from "@/features/driver/driverSlice";

const DriverSocketContext = createContext(null);

// const SOCKET_URL = 'http://10.0.2.2:8000';
const SOCKET_URL = "http://192.168.0.101:8000"; // for mobile

export const DriverSocketProvider = ({ children }) => {
  const socketRef = useRef(null);
  const [connected, setConnected] = useState(false);
  const dispatch = useDispatch();

  const connect = async () => {
    const token = await AsyncStorage.getItem("token");
    if (!token) {
      console.warn("[DriverSocket] No token – skip connect");
      return;
    }
    if (socketRef.current?.connected) return;

    if (socketRef.current) {
      socketRef.current.removeAllListeners();
      socketRef.current.disconnect();
      socketRef.current = null;
    }

    socketRef.current = io(SOCKET_URL, {
      auth: { token, role: "driver" },
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
      console.log("[DriverSocket] connected:", s.id);
    });

    s.on("connect_error", (err) => {
      setConnected(false);
      console.warn("[DriverSocket] connect_error:", err.message);
    });

    s.on("disconnect", (reason) => {
      setConnected(false);
      console.log("[DriverSocket] disconnected:", reason);
      if (reason === "io server disconnect") {
        s.connect();
      }
    });

    // ───── Incoming request ─────
    s.on("ride:new_request", (data) => {
      console.log("[DriverSocket] new_request", data);
      dispatch(setIncomingRide(data));
      Vibration.vibrate([0, 400, 200, 400, 200, 400]);
    });

    s.on("ride:request_expired", () => {
      console.log("[DriverSocket] request_expired");
      dispatch(clearIncomingRide());
    });

    s.on("ride:request_taken", () => {
      // another driver took it
      dispatch(clearIncomingRide());
    });

    // ───── After accept / during trip ─────
    s.on("ride:accepted_ack", (data) => {
      // server confirms accept
      if (data?.ride || data?.passenger) {
        dispatch(
          rideAccepted({
            ride: data.ride,
            passenger: data.passenger,
          }),
        );
      }
    });

    s.on("ride:passenger_cancelled", () => {
      console.log("[DriverSocket] passenger cancelled");
      dispatch(setRideStatus("idle"));
      dispatch(clearIncomingRide());
      dispatch(clearActiveRide());
    });

    s.on("ride:cancelled", () => {
      dispatch(clearIncomingRide());
      dispatch(clearActiveRide());
      dispatch(setRideStatus("idle"));
    });

    s.on("ride:started_ack", (data) => {
      dispatch(rideStarted(data));
    });

    s.on("ride:completed_ack", (data) => {
      dispatch(rideCompleted(data));
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
      console.warn("[DriverSocket] emit skipped – not connected:", event);
      return;
    }
    socketRef.current.emit(event, data);
  };

  // ───── Helper emits ─────
  const updateLocation = (coords) => {
    dispatch(setCurrentLocation(coords));
    emit("driver:location_update", coords);
  };

  const goOnline = () => {
    emit("driver:go_online");
  };

  const goOffline = () => {
    emit("driver:go_offline");
  };

  const arrivedAtPickup = (rideId) => {
    emit("driver:arrived_at_pickup", { rideId });
    dispatch(setRideStatus("arrived"));
  };

  const emitStartRide = (rideId) => {
    emit("driver:start_ride", { rideId });
  };

  const emitCompleteRide = (rideId) => {
    emit("driver:complete_ride", { rideId });
  };

  useEffect(() => {
    return () => disconnect();
  }, []);

  return (
    <DriverSocketContext.Provider
      value={{
        connected,
        connect,
        disconnect,
        emit,
        updateLocation,
        goOnline,
        goOffline,
        arrivedAtPickup,
        emitStartRide,
        emitCompleteRide,
        socket: socketRef,
      }}
    >
      {children}
    </DriverSocketContext.Provider>
  );
};

export const useDriverSocket = () => useContext(DriverSocketContext);
