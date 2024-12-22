import { toast } from "react-toastify";
import { io, Socket } from "socket.io-client";
import { addNotification } from "@/store/notifications/notificationSlice";
import { store } from "@/store/store";

interface Notification {
  _id: string;
  userId: string;
  content: string;
  type: string;
  relatedId: string;
  isRead: boolean;
  createdAt?: string;
  updatedAt?: string;
}

let socket: Socket | null = null;

export const connectSocket = (userId: string) => {
  if (!socket) {
    socket = io("http://localhost:4000", {
      query: { userId },
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socket.on("connect", () => {
      console.log("Connected to websocket server with userId:", userId);
      toast.success("Connected to notification service");
    });

    socket.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
      toast.error("Failed to connect to notification service");
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from websocket server");
    });

    socket.on("newNotification", (rawNotification: any) => {
      console.log("Received notification:", rawNotification);

      // Extract the plain object from Mongoose document
      const notification = rawNotification._doc || rawNotification;

      if (!notification || !notification.content) {
        console.error("Invalid notification format:", notification);
        return;
      }

      // Create a clean notification object with timestamp to ensure uniqueness
      const cleanNotification = {
        _id: notification._id,
        userId: notification.userId,
        content: notification.content,
        type: notification.type,
        relatedId: notification.relatedId,
        isRead: notification.isRead,
        createdAt: notification.createdAt || new Date().toISOString(),
        updatedAt: notification.updatedAt,
        timestamp: Date.now(), // Add this to ensure uniqueness
      };

      // Dispatch to store
      store.dispatch(addNotification(cleanNotification));

      // Map notification types to toast types
      const toastTypeMap: {
        [key: string]: "success" | "error" | "info" | "warning";
      } = {
        DEBT_CREATED: "info",
        DEBT_PAID: "success",
        DEBT_REMINDER: "warning",
        DEBT_OVERDUE: "error",
        // Add more notification type mappings as needed
      };

      const toastType = toastTypeMap[notification.type] || "info";

      toast[toastType](notification.content, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    });
  }
  return socket;
};

export const getSocket = () => socket;

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
