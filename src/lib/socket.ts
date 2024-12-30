import { toast } from "react-toastify";
import { io, Socket } from "socket.io-client";
import { addNotification } from "@/store/notifications/notificationSlice";
import { store } from "@/store/store";
import { getUserAccounts } from "@/store/account/accountSlice";
import {
  fetchCreatedDebts,
  fetchDebts,
  fetchDebtSummary,
} from "@/store/debt/debtSlice";

let socket: Socket | null = null;

// Add type for debt-related notifications
const DEBT_NOTIFICATIONS = [
  "DEBT_CREATED",
  "DEBT_PAID",
  "DEBT_REMINDER",
  "DEBT_OVERDUE",
  "DEBT_CANCELLED",
  "DEBT_PAYMENT",
];
const baseURL = import.meta.env.VITE_API_URL;

export const connectSocket = (userId: string) => {
  if (!socket) {
    socket = io(baseURL, {
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

      // Check if it's a debt-related notification
      if (DEBT_NOTIFICATIONS.includes(notification.type)) {
        // For payment notifications, update account balance
        if (notification.type === "DEBT_PAYMENT") {
          store.dispatch(getUserAccounts());
        }

        // Update debt-related data
        store.dispatch(fetchDebts());
        store.dispatch(fetchCreatedDebts());
        store.dispatch(fetchDebtSummary());
      }

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
