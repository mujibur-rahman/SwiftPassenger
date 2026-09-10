// src/services/SocketContext.js
import React, {
  createContext,
  useContext,
  useRef,
  useState,
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

// Gig events
import {
  receiveQuotes,
  updateBookingStatus,
  setBookingFromSocket,
} from "@/features/gig/gigSlice";
import { gigApi } from "@/features/gig/gigApi";

const SocketContext = createContext(null);

// CRITICAL: Must be the same host/port as the API (auth-server + Socket.IO on 3000)
// Android emulator: http://10.0.2.2:3000
// Physical device: http://YOUR_LAN_IP:3000
const SOCKET_URL = process.env.EXPO_PUBLIC_BASE_URL || "http://192.168.0.101:3000";

export const SocketProvider = ({ children }) => {
  const socketRef = useRef(null);
  const [connected, setConnected] = useState(false);
  const dispatch = useDispatch();

  const connect = async () => {
    const token = await AsyncStorage.getItem("token");
    if (!token || socketRef.current?.connected) return;

    socketRef.current = io(SOCKET_URL, {
      auth: { token },
      transports: ["websocket"],
      reconnection: true,
      reconnectionDelay: 2000,
      reconnectionAttempts: 8,
    });

    socketRef.current.on("connect", () => {
      setConnected(true);
      console.log("[Socket] Connected:", socketRef.current.id, "→", SOCKET_URL);
    });

    socketRef.current.on("connect_error", (err) => {
      console.warn("[Socket] Connection error:", err.message);
    });

    socketRef.current.on("disconnect", (reason) => {
      setConnected(false);
      console.log("[Socket] Disconnected:", reason);
    });

    // ========== RIDE events (existing) ==========
    socketRef.current.on("ride:driver_found", (data) => {
      dispatch(setDriver(data.driver));
      dispatch(updateRideStatus("accepted"));
    });
    socketRef.current.on("ride:driver_location", (data) => {
      dispatch(updateDriverLocation(data.location));
      dispatch(updateETA(data.eta));
    });
    socketRef.current.on("ride:driver_arrived", () => {
      dispatch(updateRideStatus("pickup"));
    });
    socketRef.current.on("ride:started", () => {
      dispatch(updateRideStatus("ongoing"));
    });
    socketRef.current.on("ride:completed", () => {
      dispatch(updateRideStatus("completed"));
    });
    socketRef.current.on("ride:passenger_cancelled", () => {
      dispatch(updateRideStatus("cancelled"));
    });
    socketRef.current.on("ride:no_drivers", () => {
      dispatch(updateRideStatus("no_drivers"));
    });

    // ========== GIG events ==========
    socketRef.current.on("gig:quotes_ready", (payload) => {
      console.log("[Socket] gig:quotes_ready", payload?.jobId);
      if (payload?.quotes?.length) {
        // 1. Update client flow state
        dispatch(receiveQuotes(payload.quotes));

        // 2. Keep RTK Query cache in sync (authoritative)
        if (payload.jobId) {
          dispatch(
            gigApi.util.updateQueryData("getQuotes", payload.jobId, () => payload.quotes)
          );
          dispatch(
            gigApi.util.updateQueryData("getGigJob", payload.jobId, (draft) => {
              if (draft) {
                draft.quotes = payload.quotes;
                draft.status = "quotes_ready";
              }
            })
          );
        }
      }
    });

    socketRef.current.on("gig:booking_status", (payload) => {
      console.log("[Socket] gig:booking_status", payload?.bookingId, payload?.status);
      if (payload?.status) {
        dispatch(updateBookingStatus(payload.status));
      }
      if (payload?.booking) {
        dispatch(setBookingFromSocket(payload.booking));
      }
      // Keep RTK Query cache in sync
      if (payload?.bookingId && payload?.booking) {
        dispatch(
          gigApi.util.updateQueryData(
            "getGigBooking",
            payload.bookingId,
            () => payload.booking
          )
        );
      }
    });
  };

  const disconnect = () => {
    socketRef.current?.disconnect();
    socketRef.current = null;
    setConnected(false);
  };

  const emit = (event, data) => socketRef.current?.emit(event, data);

  return (
    <SocketContext.Provider
      value={{ connected, connect, disconnect, emit, socket: socketRef }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);