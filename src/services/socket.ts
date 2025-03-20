import { io } from "socket.io-client";

const SOCKET_URL = "http://3.107.84.195:3000/"; // Ensure backend is running

const socket = io(SOCKET_URL, {
  transports: ["websocket"], // Ensure WebSocket is used
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 3000,
});

// Handle WebSocket connection and errors
socket.on("connect", () => console.log("✅ WebSocket Connected"));
socket.on("connect_error", (error) => console.error("❌ WebSocket Error:", error));
socket.on("disconnect", (reason) => console.warn("⚠️ WebSocket Disconnected:", reason));

export const subscribeToRates = (callback: (data: { symbol: string; price: string }) => void) => {
  socket.emit("subscribeToRate"); // Subscribe to Binance rate updates

  socket.on("rateUpdate", (data) => {
    callback(data);
  });

  return () => {
    socket.off("rateUpdate");
  };
};

export default socket;
